/**
 * retrieval.js - Deterministic guideline retrieval for the DSHC RAG pipeline.
 *
 * Given the structured findings collected across an encounter (vitals ->
 * symptoms -> history -> examination -> tests), this module:
 *
 *   1. Flattens the encounter into a list of atomic, source-tagged findings.
 *   2. Scores each guideline condition by keyword/finding overlap.
 *   3. Returns a ranked shortlist, and for each condition the specific
 *      findings that support it (the "linkage").
 *   4. Surfaces any triggered thresholds and red flags.
 *
 * Selection is fully deterministic and inspectable - no model is involved in
 * choosing which guideline entries are retrieved. This keeps the retrieval
 * step transparent and defensible: every retrieved entry can be traced to the
 * exact findings that caused it to surface.
 */
const fs = require('fs');
const path = require('path');

const KB_PATH = path.join(__dirname, 'guidelines.json');

let _kb = null;
function kb() {
  if (!_kb) _kb = JSON.parse(fs.readFileSync(KB_PATH, 'utf8'));
  return _kb;
}

// --- helpers ---------------------------------------------------------------
function num(x) {
  const n = parseFloat(x);
  return isNaN(n) ? null : n;
}

function normalise(s) {
  return String(s || '').toLowerCase().replace(/[_\-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function verificationIsTrue(value) {
  return value === true || Boolean(value && typeof value === 'object' && (
    value.verified === true || normalise(value.status) === 'verified'
  ));
}

// Only explicitly verified laboratory/device values can become RAG findings.
// Legacy result blobs remain available to the result-reconciliation page, but
// excluding them here prevents old simulated or unverified values from changing
// a differential, red-flag match, or later test recommendation.
function verifiedTestResults(testState) {
  const t = testState || {};
  const raw = t.results;
  if (!raw) return null;
  const collectionVerified = t.results_verified === true || t.verified === true || verificationIsTrue(t.verification);
  if (collectionVerified) return raw;
  if (!Array.isArray(raw)) return null;

  const filtered = [];
  raw.forEach((entry) => {
    if (!entry || typeof entry !== 'object') return;
    if (entry.verified === true || verificationIsTrue(entry.verification)) {
      filtered.push(entry);
      return;
    }
    if (Array.isArray(entry.tests)) {
      const tests = entry.tests.filter((row) => row && typeof row === 'object' && (
        row.verified === true || verificationIsTrue(row.verification)
      ));
      if (tests.length) filtered.push({ ...entry, tests });
    }
  });
  return filtered.length ? filtered : null;
}

// Entries explicitly labelled as unsourced/AI-drafted placeholders must not be
// returned as grounded Ghana guidance. They stay in guidelines.json for future
// ingestion work, but are excluded from clinical retrieval until a verified
// source replaces the placeholder.
function isGroundedCondition(cond) {
  const note = normalise(cond && cond.sourcing_note);
  return !note || !/(ai drafted placeholder|not extracted from a real guideline|should not be treated as grounded)/.test(note);
}

/**
 * Determine whether the patient is a child for threshold purposes.
 * Returns 'child' | 'adult' | 'unknown'.
 */
function ageBand(pi) {
  if (!pi) return 'unknown';
  const a = num(pi.age);
  if (a == null) return 'unknown';
  return a < 12 ? 'child' : 'adult';
}

// --- 1. flatten encounter into atomic, source-tagged findings --------------
/**
 * Returns { findings: [{ text, source, raw }], vitals, band }
 * where source is one of: vitals | symptoms | history | examination | tests.
 * `text` is a short human-readable label; `raw` is a normalised token used
 * for matching.
 */
function extractFindings(enc) {
  const ps = (enc && enc.pageStates) || {};
  const findings = [];
  const push = (text, source) => {
    const raw = normalise(text);
    if (raw) findings.push({ text: String(text).trim(), source, raw });
  };

  const pi = ps.dshc_patient_info || {};
  const band = ageBand(pi);

  // Vitals -> emit both the raw values and interpreted flags.
  const v = ps.dshc_vitals || {};
  const vitals = {
    temp: num(v.temperature),
    hr: num(v.heartRate),
    rr: num(v.respiratoryRate),
    spo2: num(v.oxygenSaturation),
    sbp: v.bloodPressure ? num(String(v.bloodPressure).split('/')[0]) : null,
  };
  if (vitals.temp != null && vitals.temp >= 38.0) push(`Fever ${vitals.temp}\u00b0C`, 'vitals');
  if (vitals.rr != null && vitals.rr >= 30) push(`Tachypnoea (RR ${vitals.rr}/min)`, 'vitals');
  if (vitals.spo2 != null && vitals.spo2 > 0 && vitals.spo2 < 94) push(`Low SpO2 (${vitals.spo2}%)`, 'vitals');
  if (vitals.hr != null && vitals.hr >= 100) push(`Tachycardia (HR ${vitals.hr}/min)`, 'vitals');
  if (vitals.sbp != null && vitals.sbp > 0 && vitals.sbp < 90) push(`Hypotension (SBP ${vitals.sbp})`, 'vitals');

  // Symptoms.
  const s = ps.dshc_symptoms || {};
  if (Array.isArray(s.symptoms)) {
    s.symptoms.forEach((x) => push(typeof x === 'string' ? x : (x && x.name) || '', 'symptoms'));
  } else if (s.symptoms) {
    String(s.symptoms).split(/[,;]/).forEach((x) => push(x, 'symptoms'));
  }

  // History - free-text fields; emit each non-empty field's content.
  const h = ps.dshc_history || {};
  const HISTORY_FIELDS = ['presentingComplaints', 'historyOfComplaints', 'odq', 'pastMedical', 'surgicalHx', 'familyHx', 'allergies', 'socialHx'];
  HISTORY_FIELDS.forEach((f) => { if (h[f] && String(h[f]).trim()) push(h[f], 'history'); });

  // Examination - general free text + systematic per-system arrays.
  const e = ps.dshc_examination || {};
  if (e.general) push(e.general, 'examination');
  if (e.systematic && typeof e.systematic === 'object') {
    Object.entries(e.systematic).forEach(([system, list]) => {
      const arr = Array.isArray(list) ? list : [list];
      arr.forEach((item) => { if (item) push(`${system}: ${item}`, 'examination'); });
    });
  }

  // Tests.
  const t = ps.dshc_tests || {};
  const verifiedResults = verifiedTestResults(t);
  if (verifiedResults) push(typeof verifiedResults === 'string' ? verifiedResults : JSON.stringify(verifiedResults), 'tests');

  return { findings, vitals, band, patient: pi };
}

// --- 2/3. score conditions and build linkage -------------------------------
/**
 * A keyword matches a finding when the finding text contains the keyword as a
 * word/phrase. Multi-word keywords match on substring of the normalised text.
 */
function keywordMatches(keyword, finding) {
  const k = normalise(keyword);
  if (!k) return false;
  if (k.includes(' ')) return finding.raw.includes(k);
  // single word: match on word boundary within the finding
  return new RegExp(`(^|\\W)${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\W|$)`).test(finding.raw);
}

function scoreCondition(cond, findings) {
  const supportedBy = [];
  const matchedKeywords = new Set();
  findings.forEach((f) => {
    for (const kw of cond.keywords) {
      if (keywordMatches(kw, f)) {
        matchedKeywords.add(normalise(kw));
        // record the finding once per condition
        if (!supportedBy.find((sb) => sb.text === f.text && sb.source === f.source)) {
          supportedBy.push({ text: f.text, source: f.source });
        }
      }
    }
  });
  // Score: number of distinct findings that hit, plus a small bonus for
  // distinct keyword coverage, minus the condition's own priority weight so
  // more specific/urgent conditions surface when tied on evidence.
  const distinctFindings = supportedBy.length;
  const coverage = matchedKeywords.size;
  const score = distinctFindings * 2 + coverage;
  return { score, distinctFindings, coverage, supportedBy };
}

// --- threshold + red-flag detection ----------------------------------------
function triggeredThresholds(vitals, band) {
  const out = [];
  kb().thresholds.forEach((th) => {
    if (th.applies_to !== 'all' && th.applies_to !== band && band !== 'unknown') return;
    let hit = false;
    switch (th.id) {
      case 'temp_fever_adult': hit = vitals.temp != null && vitals.temp >= 38.0; break;
      case 'rr_high_adult': hit = vitals.rr != null && vitals.rr >= 30; break;
      case 'spo2_low': hit = vitals.spo2 != null && vitals.spo2 > 0 && vitals.spo2 < 94; break;
      case 'hr_high_adult': hit = vitals.hr != null && vitals.hr >= 100; break;
      case 'sbp_low': hit = vitals.sbp != null && vitals.sbp > 0 && vitals.sbp < 90; break;
      default: hit = false; // age-banded child rules need explicit RR bands; skip unless known
    }
    if (hit) out.push({ id: th.id, label: th.label, rule: th.rule, note: th.note });
  });
  return out;
}

const RED_FLAG_HINTS = {
  rf_consciousness: ['altered consciousness', 'unconscious', 'confusion', 'lethargy', 'unable to drink', 'not drinking', 'drowsy'],
  rf_neck: ['neck stiffness', 'photophobia', 'bulging fontanelle', 'stiff neck'],
  rf_convulsion: ['convulsion', 'seizure', 'fits'],
  rf_resp_distress: ['respiratory distress', 'difficulty breathing', 'chest indrawing', 'grunting', 'cyanosis'],
  rf_shock: ['shock', 'cold peripheries', 'weak pulse'],
  rf_bleeding: ['bleeding', 'petechiae', 'purpura', 'haemorrhage', 'hemorrhage'],
  rf_jaundice: ['jaundice', 'yellow eyes', 'yellowing'],
};

function triggeredRedFlags(findings, vitals) {
  const out = [];
  const allText = findings.map((f) => f.raw).join(' | ');
  kb().red_flags.forEach((rf) => {
    const hints = RED_FLAG_HINTS[rf.id] || [];
    let hit = hints.some((h) => allText.includes(h));
    // vitals-derived flags
    if (rf.id === 'rf_resp_distress' && vitals.spo2 != null && vitals.spo2 > 0 && vitals.spo2 < 90) hit = true;
    if (rf.id === 'rf_shock' && vitals.sbp != null && vitals.sbp > 0 && vitals.sbp < 90) hit = true;
    if (hit) out.push({ id: rf.id, label: rf.label, action: rf.action });
  });
  return out;
}

// --- public API ------------------------------------------------------------
/**
 * retrieve(enc, { topK }) -> retrieval bundle used to ground the model prompt.
 * Everything here is derived deterministically from the encounter.
 */
function retrieve(enc, opts = {}) {
  const topK = opts.topK || 5;
  const { findings, vitals, band, patient } = extractFindings(enc);

  const scored = kb().conditions
    .filter(isGroundedCondition)
    .map((cond) => {
      const sc = scoreCondition(cond, findings);
      return { cond, ...sc };
    })
    .filter((r) => r.distinctFindings > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.cond.priority || 9) - (b.cond.priority || 9); // urgent/specific first on ties
    })
    .slice(0, topK);

  const candidates = scored.map((r) => ({
    id: r.cond.id,
    name: r.cond.name,
    score: r.score,
    supporting_features: r.cond.supporting_features,
    discriminators: r.cond.discriminators,
    danger_signs: r.cond.danger_signs,
    confirmatory_test: r.cond.confirmatory_test,
    first_line_management: r.cond.first_line_management,
    stg_reference: r.cond.stg_reference,
    supported_by: r.supportedBy, // [{ text, source }] - the linkage
  }));

  // ---- doc pipeline (additive) ------------------------------------------
  // When the metadata-rich chunk store exists, also run the full rationale-doc
  // pipeline (context -> hard filters -> hybrid -> rerank -> validate ->
  // provenance + facility notes). This never removes the legacy fields above;
  // it adds a `pipeline` block the engine can prefer when present. Safe no-op
  // if chunks.json is absent.
  let pipeline = null;
  try {
    const pl = require('./pipeline');
    if (pl.available()) {
      const findingTexts = findings.map((f) => f.raw);
      pipeline = pl.runPipeline(enc, findingTexts, {
        role: opts.role || (enc && enc.role) || 'unknown',
        facility_id: opts.facility_id || (enc && enc.facility_id) || 'GH-DEFAULT',
        facility_type: opts.facility_type || null,
        facility_profile: opts.facility_profile || null,
        decision_stage: opts.decision_stage || null,
        topK,
      });
    }
  } catch (e) {
    pipeline = null; // fail open to legacy behaviour
  }

  return {
    findings,
    band,
    patient: { age: patient.age || null, gender: patient.gender || null },
    thresholds: triggeredThresholds(vitals, band),
    red_flags: triggeredRedFlags(findings, vitals),
    candidates,
    kb_meta: kb().meta,
    pipeline, // null when chunk store absent; else the full doc-pipeline trace
  };
}

module.exports = { retrieve, extractFindings, isGroundedCondition, kb };
