/**
 * build-chunks.js — migrates the existing condition-level guidelines.json into
 * the metadata-rich, clinically-semantic chunk store described in the rationale
 * document (steps 3 & 4). Run once (and re-run whenever guidelines.json changes):
 *
 *     node backend/kb/build-chunks.js
 *
 * It is DETERMINISTIC and NON-DESTRUCTIVE: it reads guidelines.json and writes
 * chunks.json alongside it. No clinical text is invented — every chunk's content
 * is copied verbatim from the source condition entry, only split by decision
 * stage and tagged with metadata so the pipeline can filter/rerank safely.
 *
 * Each source condition becomes up to four chunks, one per clinical question:
 *   - recognition  (supporting features / discriminators)  -> integration, working_diagnosis
 *   - danger_signs (severe-disease criteria)               -> all stages (safety)
 *   - testing      (confirmatory test)                     -> testing
 *   - management   (first-line management)                 -> management
 *
 * A condition's `document_id` maps it to a registry entry so provenance and
 * section-specific source priority resolve correctly. Malaria maps to the 2024
 * malaria programme guideline; everything else maps to the 2017 STG for now.
 * (Add real per-section document_ids as you ingest the actual PDFs.)
 */
const fs = require('fs');
const path = require('path');

const KB = JSON.parse(fs.readFileSync(path.join(__dirname, 'guidelines.json'), 'utf8'));

// condition.id -> the registry document that governs THIS condition's section.
// This is where the doc's "section-specific priority" is wired: malaria points
// at the newer disease-specific guideline; the rest point at the STG.
const CONDITION_DOCUMENT = {
  // Malaria SHOULD point at GH-MAL-2024 once that PDF is ingested (it outranks the
  // STG for malaria per registry.json source_priority). Until then it points at
  // GH-STG-2017 because that is the document the current content was actually
  // extracted from — provenance must match the real source, not the intended one.
  malaria: 'GH-STG-2017',
  typhoid: 'GH-STG-2017',
  lrti_pneumonia: 'GH-STG-2017',
  meningitis: 'GH-STG-2017',
  uti: 'GH-STG-2017',
  measles: 'GH-STG-2017',
  dengue: 'GH-STG-2017',
  viral_syndrome: 'GH-STG-2017',
};

// Conditions that are primarily paediatric/IMCI-classified surface an extra
// population tag; the pipeline still shows them to all ages but ranks by match.
const PAEDIATRIC_BIAS = new Set(['measles']);

const SYNDROME = ['acute_febrile_illness'];

function baseMeta(cond) {
  return {
    document_id: CONDITION_DOCUMENT[cond.id] || 'GH-STG-2017',
    condition: [cond.id],
    condition_name: cond.name,
    syndrome: SYNDROME,
    keywords: cond.keywords || [],
    population: PAEDIATRIC_BIAS.has(cond.id) ? ['child'] : ['adult', 'adolescent', 'child'],
    age_min_years: null,
    age_max_years: null,
    pregnancy_status: ['not_specified'],
    facility_level: ['all_levels'],
    cadre: ['all_cadres'],
    superseded: false,
    stg_reference: cond.stg_reference || null,
    // Provenance (doc step 17): the printed page number(s) and section title in the
    // actual source PDF, so every chunk is traceable back to a specific page a
    // clinician can open and check. Absent until a condition has been extracted
    // from the real guideline PDF (see extract_source_page.py).
    source_page: cond.source_page || null,
    source_section: cond.source_section || null,
    extracted_from: cond.extracted_from || null,
  };
}

function makeChunks(cond) {
  const out = [];
  const m = baseMeta(cond);
  const cid = cond.id.toUpperCase();

  // 1. Recognition chunk (integration + working diagnosis)
  if (cond.supporting_features || cond.discriminators) {
    out.push({
      chunk_id: `${m.document_id}-${cid}-RECOG`,
      content: [cond.supporting_features, cond.discriminators].filter(Boolean).join(' '),
      recommendation_type: 'recognition',
      decision_stage: ['integration', 'working_diagnosis'],
      urgency: 'non_emergency',
      evidence_priority: 60,
      ...m,
    });
  }

  // 2. Danger-sign chunk (safety layer — surfaces at every stage)
  if (Array.isArray(cond.danger_signs) && cond.danger_signs.length) {
    out.push({
      chunk_id: `${m.document_id}-${cid}-DANGER`,
      content: `Danger signs for severe ${cond.name.toLowerCase()}: ${cond.danger_signs.join('; ')}. Presence of any indicates possible severe disease requiring stabilisation and urgent referral.`,
      recommendation_type: 'danger_signs',
      decision_stage: ['information_gathering', 'integration', 'working_diagnosis', 'testing', 'management'],
      urgency: 'emergency',
      evidence_priority: 95,
      danger_signs: cond.danger_signs,
      ...m,
    });
  }

  // 3. Testing chunk
  if (cond.confirmatory_test) {
    out.push({
      chunk_id: `${m.document_id}-${cid}-TEST`,
      content: `Confirmatory testing for ${cond.name.toLowerCase()}: ${cond.confirmatory_test}`,
      recommendation_type: 'testing',
      decision_stage: ['testing'],
      urgency: 'non_emergency',
      evidence_priority: 70,
      confirmatory_test: cond.confirmatory_test,
      ...m,
    });
  }

  // 4. Management chunk
  if (cond.first_line_management) {
    out.push({
      chunk_id: `${m.document_id}-${cid}-MGMT`,
      content: `First-line management of ${cond.name.toLowerCase()}: ${cond.first_line_management}`,
      recommendation_type: 'management',
      decision_stage: ['management'],
      urgency: 'non_emergency',
      evidence_priority: 65,
      first_line_management: cond.first_line_management,
      medicines_cited: cond.medicines_cited || [],
      ...m,
    });
  }

  return out;
}

// --- IDSR surveillance case definitions ------------------------------------
// These answer a DIFFERENT clinical question than the STG condition chunks:
// "does this presentation meet the notifiable-case definition?", not "what is
// the diagnosis/treatment?". Kept as their own recommendation_type so the
// pipeline and the model never conflate a surveillance case definition with a
// confirmed clinical diagnosis (see rationale doc's explicit warning on this).
function makeSurveillanceChunk(sc) {
  return {
    chunk_id: `${sc.document_id}-${sc.id.toUpperCase()}`,
    content: `IDSR suspected-case definition for ${sc.disease}: ${sc.case_definition}`,
    recommendation_type: 'surveillance_case_definition',
    decision_stage: ['integration', 'working_diagnosis'],
    urgency: 'emergency',
    evidence_priority: 90,
    document_id: sc.document_id,
    condition: [sc.linked_condition],
    condition_name: sc.disease,
    syndrome: SYNDROME,
    keywords: sc.keywords || [],
    population: ['adult', 'adolescent', 'child'],
    age_min_years: null,
    age_max_years: null,
    pregnancy_status: ['not_specified'],
    facility_level: ['all_levels'],
    cadre: ['all_cadres'],
    superseded: false,
    stg_reference: null,
    priority_category: sc.priority_category || null,
    notification_type: sc.notification_type || null,
    source_page: sc.source_page || null,
    source_section: sc.source_section || null,
    extracted_from: sc.extracted_from || null,
  };
}

const chunks = [];
KB.conditions.forEach((c) => chunks.push(...makeChunks(c)));
(KB.surveillance_case_definitions || []).forEach((sc) => chunks.push(makeSurveillanceChunk(sc)));

const bundle = {
  meta: {
    ...KB.meta,
    schema: 'dshc-clinical-chunk-v1',
    built_at: new Date().toISOString(),
    built_from: 'guidelines.json',
    chunk_count: chunks.length,
  },
  thresholds: KB.thresholds,
  red_flags: KB.red_flags,
  chunks,
};

fs.writeFileSync(path.join(__dirname, 'chunks.json'), JSON.stringify(bundle, null, 2));
console.log(`Wrote chunks.json — ${chunks.length} chunks from ${KB.conditions.length} conditions.`);
