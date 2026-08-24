/**
 * pipeline.js — the safety-constrained RAG pipeline from the rationale document.
 *
 *   context object -> safety screening -> hard filters -> hybrid retrieval
 *   -> section-specific rerank -> evidence validation -> grounded candidates
 *   (+ provenance) -> facility adaptation
 *
 * This module implements doc steps 6-12, 16 and 17 over the metadata-rich
 * chunk store (chunks.json) and the registry (registry.json). It is fully
 * deterministic and model-free: the model only reasons over what this returns.
 *
 * It is ADDITIVE. retrieval.js delegates to it; the /api/assist and /api/adapt
 * endpoints keep the same signatures, and no UI page changes. If chunks.json is
 * absent, callers fall back to the legacy path.
 */
const fs = require('fs');
const path = require('path');

let _chunks = null;
let _registry = null;
let _facilities = null;
let _formulary = null;

function loadJSON(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}
function chunksKB() {
  if (!_chunks) _chunks = loadJSON(path.join(__dirname, 'chunks.json'), null);
  return _chunks;
}
function registry() {
  if (!_registry) _registry = loadJSON(path.join(__dirname, 'registry.json'), { documents: [], source_priority: {} });
  return _registry;
}
function facilities() {
  if (!_facilities) _facilities = loadJSON(path.join(__dirname, '..', 'facility', 'facilities.json'), { default: null, facilities: [] });
  return _facilities;
}
function formulary() {
  if (!_formulary) {
    const gl = loadJSON(path.join(__dirname, 'guidelines.json'), { essential_medicines: [] });
    _formulary = {};
    (gl.essential_medicines || []).forEach((m) => { _formulary[m.medicine] = m; });
  }
  return _formulary;
}
function available() { return !!chunksKB(); }

function norm(s) {
  return String(s || '').toLowerCase().replace(/[_\-]+/g, ' ').replace(/\s+/g, ' ').trim();
}
function num(x) { const n = parseFloat(x); return isNaN(n) ? null : n; }

// --- doc step 6: structured clinical context object ------------------------
/**
 * Builds the context object the retriever runs against. Derived entirely from
 * the encounter + the caller's role/facility/stage. No free-text-only queries.
 */
function buildContext(enc, opts = {}) {
  const ps = (enc && enc.pageStates) || {};
  const pi = ps.dshc_patient_info || {};
  const age = num(pi.age);
  const genderRaw = norm(pi.gender);
  const s = ps.dshc_symptoms || {};
  let symptoms = [];
  if (Array.isArray(s.symptoms)) symptoms = s.symptoms.map((x) => (typeof x === 'string' ? x : (x && x.name) || '')).filter(Boolean);
  else if (s.symptoms) symptoms = String(s.symptoms).split(/[,;]/).map((x) => x.trim()).filter(Boolean);

  const pregnant = /pregnan/.test(norm(JSON.stringify(ps.dshc_history || {}))) ? true : false;

  return {
    user_role: opts.role || 'unknown',
    facility_id: opts.facility_id || 'GH-DEFAULT',
    facility_type: opts.facility_type || null,
    decision_stage: opts.decision_stage || inferStage(ps),
    patient: {
      age,
      sex: genderRaw || null,
      pregnant,
      band: age == null ? 'unknown' : age < 5 ? 'under_five' : age < 12 ? 'child' : 'adult',
    },
    presentation: { symptoms },
  };
}

// Best-effort stage inference from which pages have data, when caller omits it.
function inferStage(ps) {
  if (ps.dshc_tests && ps.dshc_tests.results) return 'testing';
  if (ps.dshc_examination) return 'integration';
  if (ps.dshc_symptoms) return 'information_gathering';
  return 'information_gathering';
}

// --- doc step 9: hard filters ----------------------------------------------
/**
 * Mandatory filters applied BEFORE any similarity scoring. A chunk that fails a
 * hard filter is clinically inapplicable and must never surface, however well
 * it matches on keywords. Country/superseded/age/pregnancy/role/facility.
 */
function passesHardFilters(chunk, ctx) {
  if (chunk.superseded) return false;

  // Decision-stage applicability is a hard constraint. A highly similar
  // management or recognition passage must not be returned when the current
  // task is test selection (and vice versa). Danger-sign evidence is the one
  // exception: urgent safety guidance remains visible at every stage.
  const stages = chunk.decision_stage || [];
  if (
    ctx.decision_stage &&
    stages.length &&
    !stages.includes(ctx.decision_stage) &&
    chunk.recommendation_type !== 'danger_signs'
  ) return false;

  const p = ctx.patient || {};
  // Age restrictions
  if (p.age != null) {
    if (chunk.age_min_years != null && p.age < chunk.age_min_years) return false;
    if (chunk.age_max_years != null && p.age > chunk.age_max_years) return false;
  }
  // Pregnancy restriction: a pregnancy-only chunk is filtered out for a
  // known-not-pregnant patient. "not_specified" always passes.
  const preg = chunk.pregnancy_status || ['not_specified'];
  if (!preg.includes('not_specified')) {
    if (p.pregnant === false && preg.includes('pregnant') && !preg.includes('not_pregnant')) return false;
    if (p.pregnant === true && preg.includes('not_pregnant') && !preg.includes('pregnant')) return false;
  }
  // Facility level (all_levels always passes)
  const fl = chunk.facility_level || ['all_levels'];
  if (!fl.includes('all_levels') && ctx.facility_type && !fl.includes(ctx.facility_type)) return false;
  // Role/cadre (all_cadres always passes). Danger-sign chunks are NEVER hidden
  // by role — the doc requires urgent danger signs visible to every cadre.
  const cadres = chunk.cadre || ['all_cadres'];
  if (chunk.recommendation_type !== 'danger_signs' && !cadres.includes('all_cadres') && ctx.user_role && ctx.user_role !== 'unknown' && !cadres.includes(ctx.user_role)) return false;

  return true;
}

// --- doc step 10 stage 2: hybrid retrieval (semantic-proxy + lexical) -------
// We don't have embeddings in this Node prototype, so "semantic" is approximated
// by keyword coverage (the existing scorer) and "lexical" by exact term hits.
// The interface is future-proof: swap in pgvector cosine here without changing
// callers (doc step 19 — modular).
function keywordHit(term, text) {
  const k = norm(term);
  if (!k) return false;
  if (k.includes(' ')) return text.includes(k);
  return new RegExp(`(^|\\W)${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\W|$)`).test(text);
}

function scoreChunk(chunk, findingTexts) {
  const blob = findingTexts.join(' | ');
  let semantic = 0; // keyword-coverage proxy
  let lexical = 0;  // exact clinical-term hits (chunk keywords present in findings)
  const supported = [];
  (chunk.keywords || []).forEach((kw) => {
    if (keywordHit(kw, blob)) { semantic += 1; }
  });
  findingTexts.forEach((ft) => {
    (chunk.keywords || []).forEach((kw) => {
      if (keywordHit(kw, ft)) { lexical += 1; supported.push(ft); }
    });
  });
  const uniqueSupport = [...new Set(supported)];
  return {
    semantic: chunk.keywords && chunk.keywords.length ? semantic / chunk.keywords.length : 0,
    lexical: uniqueSupport.length,
    supported_by: uniqueSupport,
  };
}

// --- doc step 11: section-specific source priority -------------------------
function sourcePriority(chunk) {
  const doc = registry().documents.find((d) => d.document_id === chunk.document_id);
  if (!doc) return 50;
  return registry().source_priority[doc.document_type] || 50;
}

function docMeta(chunk) {
  const doc = registry().documents.find((d) => d.document_id === chunk.document_id) || {};
  return {
    document_id: chunk.document_id,
    title: doc.title || null,
    authority: doc.authority || null,
    edition: doc.edition || null,
    year: doc.publication_year || null,
    status: doc.status || null,
    section: chunk.source_section || chunk.recommendation_type || null,
    page: chunk.source_page || null,
  };
}

// --- doc step 10 stage 3: clinical rerank ----------------------------------
/**
 * Final score = weighted sum. Weights are tunable (doc says tune during
 * retrieval evaluation — they live here, in one place, for Strand A).
 */
const WEIGHTS = { semantic: 0.35, lexical: 0.20, authority: 0.15, population: 0.10, facility: 0.10, role: 0.05, recency: 0.05 };

function populationMatch(chunk, ctx) {
  const pop = chunk.population || [];
  const b = ctx.patient && ctx.patient.band;
  if (!b || b === 'unknown') return 0.5;
  if (b === 'under_five' && (pop.includes('child') || pop.includes('under_five'))) return 1;
  if (b === 'child' && pop.includes('child')) return 1;
  if (b === 'adult' && (pop.includes('adult') || pop.includes('adolescent'))) return 1;
  return 0.3;
}
function facilityMatch(chunk, ctx) {
  const fl = chunk.facility_level || ['all_levels'];
  if (fl.includes('all_levels')) return 0.8;
  return ctx.facility_type && fl.includes(ctx.facility_type) ? 1 : 0.3;
}
function roleMatch(chunk, ctx) {
  const c = chunk.cadre || ['all_cadres'];
  if (c.includes('all_cadres')) return 0.8;
  return ctx.user_role && c.includes(ctx.user_role) ? 1 : 0.3;
}
function recencyScore(chunk) {
  const doc = registry().documents.find((d) => d.document_id === chunk.document_id);
  const y = doc && doc.publication_year;
  if (!y) return 0.5;
  return Math.max(0, Math.min(1, (y - 2015) / 10)); // 2015->0, 2025->1
}

function rerank(scored, ctx) {
  const maxPriority = 100;
  return scored
    .map((r) => {
      const authority = sourcePriority(r.chunk) / maxPriority;
      const population = populationMatch(r.chunk, ctx);
      const facility = facilityMatch(r.chunk, ctx);
      const role = roleMatch(r.chunk, ctx);
      const recency = recencyScore(r.chunk);
      const final =
        WEIGHTS.semantic * r.semantic +
        WEIGHTS.lexical * Math.min(1, r.lexical / 3) +
        WEIGHTS.authority * authority +
        WEIGHTS.population * population +
        WEIGHTS.facility * facility +
        WEIGHTS.role * role +
        WEIGHTS.recency * recency;
      return { ...r, final, breakdown: { authority, population, facility, role, recency } };
    })
    .sort((a, b) => b.final - a.final);
}

// --- doc step 10 stage 4: diversity selection ------------------------------
// Prefer covering distinct recommendation types over five near-identical hits.
function diversify(reranked, topK) {
  // Greedy pass that rewards covering NEW (condition, type) pairs so the result
  // set spans distinct clinical questions instead of stacking one condition's
  // four chunks. A small penalty is applied for each already-seen condition and
  // already-seen recommendation type, re-sorting on the fly.
  const out = [];
  const seenCond = new Map();
  const seenType = new Map();
  const pool = [...reranked];
  while (out.length < topK && pool.length) {
    let bestIdx = 0;
    let bestVal = -Infinity;
    for (let i = 0; i < pool.length; i++) {
      const r = pool[i];
      const cond = (r.chunk.condition || [])[0];
      const type = r.chunk.recommendation_type;
      const penalty = 0.08 * (seenCond.get(cond) || 0) + 0.05 * (seenType.get(type) || 0);
      const val = r.final - penalty;
      if (val > bestVal) { bestVal = val; bestIdx = i; }
    }
    const chosen = pool.splice(bestIdx, 1)[0];
    const cond = (chosen.chunk.condition || [])[0];
    const type = chosen.chunk.recommendation_type;
    seenCond.set(cond, (seenCond.get(cond) || 0) + 1);
    seenType.set(type, (seenType.get(type) || 0) + 1);
    out.push(chosen);
  }
  return out;
}

// --- doc step 16: facility adaptation --------------------------------------
function resolveFacility(id) {
  const f = facilities();
  if (id && Array.isArray(f.facilities)) {
    const hit = f.facilities.find((x) => x.facility_id === id);
    if (hit) return hit;
  }
  return f.default;
}
/**
 * For a chunk that recommends a test/medicine, annotate whether the resource is
 * locally available and, if not, the referral pathway. Never drops the national
 * recommendation — only records the local implementation note.
 */
function facilityNote(chunk, fac) {
  if (!fac) return null;
  const text = norm(chunk.content);
  const notes = [];
  const testMap = { microscopy: 'microscopy', 'blood culture': 'blood_culture', 'full blood count': 'full_blood_count', urinalysis: 'urinalysis', rdt: 'malaria_rdt' };
  Object.entries(testMap).forEach(([term, key]) => {
    if (text.includes(term) && fac.tests && fac.tests[key] === false) {
      notes.push(`${term} is recommended but not available at this facility. Collect the appropriate specimen if referral permits and follow the referral pathway to ${fac.referral_facility}.`);
    }
  });
  return notes.length ? notes : null;
}

// --- EML formulary check (essential-medicines list, not a diagnostic doc) --
/**
 * For a management chunk's cited medicines, resolve each against the EML
 * (backend/kb/guidelines.json -> essential_medicines). Never removes or
 * rewrites the clinical recommendation -- only annotates it with what is
 * nationally listed, at what level of care, and NHIS reimbursement status,
 * or flags it as not found on the EML. Doc: "The EML is not, by itself, a
 * diagnostic guideline... it should support management recommendations
 * after a diagnosis or working diagnosis has been established."
 */
function formularyCheck(chunk) {
  if (!chunk.medicines_cited || !chunk.medicines_cited.length) return null;
  const f = formulary();
  return chunk.medicines_cited.map((name) => {
    const entry = f[name];
    if (!entry) return { medicine: name, on_eml: false };
    return {
      medicine: name,
      on_eml: true,
      formulations: entry.formulations,
      document_id: entry.document_id,
      source_page: entry.source_page,
    };
  });
}

// --- doc step 12: evidence validation ---------------------------------------
function validate(selected, ctx) {
  const problems = [];
  if (!selected.length) problems.push('no_applicable_evidence');
  // every selected chunk must belong to a known, active registry document
  selected.forEach((r) => {
    const doc = registry().documents.find((d) => d.document_id === r.chunk.document_id);
    if (!doc) problems.push(`unknown_source:${r.chunk.chunk_id}`);
    else if (doc.status && doc.status.startsWith('superseded')) problems.push(`inactive_source:${r.chunk.chunk_id}`);
  });
  return { ok: problems.length === 0, problems };
}

// --- public: run the full pipeline -----------------------------------------
/**
 * runPipeline(enc, findingTexts, opts) -> {
 *   context, safety (from caller), candidates:[{chunk, provenance, facility_notes, supported_by, final}],
 *   validation, weights
 * }
 * findingTexts: normalised finding strings (from retrieval.extractFindings) so
 * we reuse the exact same finding extraction the legacy path already trusts.
 */
function runPipeline(enc, findingTexts, opts = {}) {
  const kb = chunksKB();
  if (!kb) return null; // signal caller to use legacy path
  const ctx = buildContext(enc, opts);
  const fac = opts.facility_profile || resolveFacility(ctx.facility_id);
  ctx.facility_type = ctx.facility_type || (fac && fac.facility_type) || null;

  // hard filters -> hybrid score -> rerank -> diversify
  const filtered = kb.chunks.filter((c) => passesHardFilters(c, ctx));
  const scored = filtered
    .map((chunk) => ({ chunk, ...scoreChunk(chunk, findingTexts) }))
    .filter((r) => r.lexical > 0 || r.chunk.recommendation_type === 'danger_signs');
  const reranked = rerank(scored, ctx);
  const selected = diversify(reranked, opts.topK || 6);

  const validation = validate(selected, ctx);

  const candidates = selected.map((r) => ({
    chunk_id: r.chunk.chunk_id,
    condition: r.chunk.condition_name || (r.chunk.condition || [])[0],
    recommendation_type: r.chunk.recommendation_type,
    content: r.chunk.content,
    supported_by: r.supported_by,
    final_score: Number(r.final.toFixed(4)),
    score_breakdown: r.breakdown,
    provenance: docMeta(r.chunk),               // doc step 17
    facility_notes: facilityNote(r.chunk, fac), // doc step 16
    formulary_status: formularyCheck(r.chunk),  // EML check (medicine, not diagnosis)
    urgency: r.chunk.urgency,
    confirmatory_test: r.chunk.confirmatory_test || null,
    first_line_management: r.chunk.first_line_management || null,
  }));

  return { context: ctx, facility: fac, candidates, validation, weights: WEIGHTS };
}

module.exports = { available, runPipeline, buildContext, resolveFacility, registry, chunksKB };
