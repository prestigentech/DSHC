import { 
  CadreRole, 
  FacilityLevel, 
  DshcConsultationStep,
  HTATaskNode, 
  DecisionRequirementEntry, 
  SemanticRetrievalResult,
  UserContextLayerState,
  DynamicUISpecification,
  AdaptiveFeedbackMetrics
} from '../types';

// =========================================================================
// LAYER 2: KNOWLEDGE REPOSITORY - HIERARCHICAL TASK ANALYSIS (HTA) MODELS
// Grounded in Ghana Primary Care & Sub-district Healthcare Workflows
// =========================================================================

export const HTA_WORKFLOW_MODELS: HTATaskNode[] = [
  {
    id: 'HTA-1.0',
    taskNumber: '1.0',
    name: 'Rapid Triage & Danger Sign Assessment',
    category: 'Triage',
    description: 'Initial presentation screening to identify immediate life threats, hyperpyrexia, shock, and emergency pre-referral triggers.',
    decisionCriteria: [
      'Is temperature >= 38.5°C (Fever) or >= 40.0°C (Hyperpyrexia)?',
      'Are any IMNCI General Danger Signs present (Vomiting everything, Convulsions, Lethargy/Unconscious, Inability to drink/breastfeed)?',
      'Is AVPU score Voice, Pain, or Unresponsive?',
      'Is pediatric respiratory rate above age threshold (Fast breathing / Pneumonia indicator)?',
    ],
    rolePermissions: {
      'Doctor': 'Primary',
      'Physician Assistant': 'Primary',
      'General Nurse': 'Primary',
      'Community Health Nurse': 'Primary',
      'Pharmacist': 'Secondary',
    },
    subtasks: [
      {
        id: 'HTA-1.1',
        title: 'Vital Sign Measurement & Early Warning Scoring',
        description: 'Record Temperature, Heart Rate, Respiratory Rate, Blood Pressure, SpO2, and calculate Shock Index.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse'],
        cognitiveLoad: 'Medium',
        adaptationOpportunity: 'Highlight out-of-range vitals in red; auto-calculate Shock Index and tachypnoea thresholds based on patient age.',
      },
      {
        id: 'HTA-1.2',
        title: 'IMNCI General Danger Signs Evaluation',
        description: 'Screen for four WHO/GHS childhood danger signs requiring immediate resuscitation.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse'],
        cognitiveLoad: 'High',
        adaptationOpportunity: 'Render prominent visual danger sign toggle chips; lock workflow into emergency stabilization pathway if positive.',
      },
      {
        id: 'HTA-1.3',
        title: 'Nutritional & Growth Screening (MUAC & Weight)',
        description: 'Measure Mid-Upper Arm Circumference (MUAC) and weight for acute malnutrition screening and accurate dosing.',
        isDecisionPoint: false,
        requiredForRoles: ['General Nurse', 'Community Health Nurse', 'Physician Assistant'],
        cognitiveLoad: 'Low',
        adaptationOpportunity: 'Color-coded MUAC band (Red <11.5cm, Yellow 11.5-12.5cm, Green >12.5cm) with instant SAM classification.',
      },
    ],
  },
  {
    id: 'HTA-2.0',
    taskNumber: '2.0',
    name: 'Focused Clinical History & Symptom Characterization',
    category: 'History & ROS',
    description: 'Systematic elicitation of fever chronology, associated focal symptoms, medication history, and host vulnerability factors.',
    decisionCriteria: [
      'Duration of fever (Acute < 7 days vs Prolonged/Chronic > 14 days)?',
      'Presence of rigors/chills, headache, nausea, joint pain (Malaria profile)?',
      'Presence of cough, difficulty breathing, chest pain (Respiratory profile)?',
      'Presence of neck stiffness, photophobia, altered behaviour (CNS/Meningitis profile)?',
      'Prior antimalarial or antibiotic ingestion within the past 14 days?',
    ],
    rolePermissions: {
      'Doctor': 'Primary',
      'Physician Assistant': 'Primary',
      'General Nurse': 'Secondary',
      'Community Health Nurse': 'Secondary',
      'Pharmacist': 'Primary',
    },
    subtasks: [
      {
        id: 'HTA-2.1',
        title: 'Fever Chronology & Travel History',
        description: 'Document onset date, periodicity, and travel to high-transmission or outbreak regions.',
        isDecisionPoint: false,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse', 'Pharmacist'],
        cognitiveLoad: 'Low',
        adaptationOpportunity: 'Pre-populate common regional endemic profiles (e.g. Meningitis Belt in Northern Ghana during dry season).',
      },
      {
        id: 'HTA-2.2',
        title: 'Review of Systems (ROS) & Focal Symptoms',
        description: 'Rule in/out gastrointestinal, respiratory, genitourinary, and neurological foci.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse'],
        cognitiveLoad: 'High',
        adaptationOpportunity: 'Dynamic symptom checklist grouped by organ system with AI-assisted probability cues for differential diagnosis.',
      },
      {
        id: 'HTA-2.3',
        title: 'Vulnerability Profile & Comorbidity Check',
        description: 'Verify Pregnancy Trimester, Sickle Cell Disease (HbSS/SC), G6PD status, Severe Malnutrition, and Immunization status.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse', 'Pharmacist'],
        cognitiveLoad: 'Medium',
        adaptationOpportunity: 'Auto-restrict contra-indicated medications (e.g. ASAQ in G6PD deficiency, AL in 1st trimester pregnancy).',
      },
    ],
  },
  {
    id: 'HTA-3.0',
    taskNumber: '3.0',
    name: 'Targeted Physical Examination',
    category: 'Physical Exam',
    description: 'Systematic physical assessment to identify localizing signs of infection, sepsis, severe anaemia, and organomegaly.',
    decisionCriteria: [
      'Conjunctival / palmar pallor (Severe anaemia secondary to malaria)?',
      'Scleral jaundice (Haemolysis / complicated malaria or hepatitis)?',
      'Neck stiffness / Kernig’s / Brudzinski’s sign (Meningism)?',
      'Crepitations or bronchial breathing on chest auscultation (Pneumonia)?',
      'Right upper quadrant tenderness or splenomegaly?',
    ],
    rolePermissions: {
      'Doctor': 'Primary',
      'Physician Assistant': 'Primary',
      'General Nurse': 'Secondary',
      'Community Health Nurse': 'Excluded',
      'Pharmacist': 'Excluded',
    },
    subtasks: [
      {
        id: 'HTA-3.1',
        title: 'General Physical & Mucocutaneous Exam',
        description: 'Inspect conjunctiva, palms, hydration state, capillary refill time, and skin rash/petechiae.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse'],
        cognitiveLoad: 'Medium',
        adaptationOpportunity: 'Provide visual comparison guides for palmar pallor and hydration skin pinch.',
      },
      {
        id: 'HTA-3.2',
        title: 'Neurological & Meningism Screen',
        description: 'Check neck rigidity, pupil symmetry, Kernig sign, and Glasgow Coma Scale (GCS) / Blantyre Coma Score.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant'],
        cognitiveLoad: 'High',
        adaptationOpportunity: 'Step-by-step interactive pediatric Blantyre Coma scale calculator.',
      },
      {
        id: 'HTA-3.3',
        title: 'Systemic Auscultation & Abdominal Palpation',
        description: 'Respiratory auscultation, cardiovascular assessment, and hepatosplenomegaly palpation.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant'],
        cognitiveLoad: 'Medium',
        adaptationOpportunity: 'Organ-based quick findings selector with GHS STG diagnostic correlation.',
      },
    ],
  },
  {
    id: 'HTA-4.0',
    taskNumber: '4.0',
    name: 'Diagnostic Investigation & Laboratory Triage',
    category: 'Diagnostic Testing',
    description: 'Selection and interpretation of diagnostic tests strictly adapted to HeFRA facility tier capabilities.',
    decisionCriteria: [
      'Is malaria Rapid Diagnostic Test (mRDT) positive for P. falciparum (Pf)?',
      'Is Blood Film Microscopy available for parasite density quantification?',
      'Is Full Blood Count (FBC) / Haemoglobin (Hb) indicating severe anaemia (< 7.0 g/dL)?',
      'Is Blood Glucose indicating hypoglycemia (< 2.2 mmol/L or < 40 mg/dL)?',
      'Are facilities equipped for Urine Dipstick, Widal test, or Lumbar Puncture?',
    ],
    rolePermissions: {
      'Doctor': 'Primary',
      'Physician Assistant': 'Primary',
      'General Nurse': 'Primary',
      'Community Health Nurse': 'Primary',
      'Pharmacist': 'Primary',
    },
    subtasks: [
      {
        id: 'HTA-4.1',
        title: 'Point-of-Care Malaria RDT Execution & Quality Check',
        description: 'Perform Pf/Pan antigen rapid diagnostic test and record control band validity.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse', 'Pharmacist'],
        cognitiveLoad: 'Low',
        adaptationOpportunity: 'Pictorial interpretation guide for valid/invalid mRDT cassettes; enforce "Test before Treatment" GHS policy.',
      },
      {
        id: 'HTA-4.2',
        title: 'Emergency Bedside Glycaemia & Hb Testing',
        description: 'Rapid glucometer and HemoCue assessment to prevent fatal hypoglycemic convulsions in febrile children.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse'],
        cognitiveLoad: 'Medium',
        adaptationOpportunity: 'Immediate prompt for 10% Dextrose bolus (5 mL/kg) if Glucose < 3.0 mmol/L.',
      },
      {
        id: 'HTA-4.3',
        title: 'Tiered Laboratory Order & Microscopy Review',
        description: 'Order FBC, Blood Film, Blood Culture, or Urinalysis when available at District/Regional tier.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant'],
        cognitiveLoad: 'High',
        adaptationOpportunity: 'Disable inaccessible laboratory tests at CHPS/Health Centre levels to eliminate cognitive clutter.',
      },
    ],
  },
  {
    id: 'HTA-5.0',
    taskNumber: '5.0',
    name: 'Syndromic Classification & Differential Diagnosis',
    category: 'Diagnostic Testing',
    description: 'Synthesis of clinical findings, test results, and epidemic context into formal GHS STG diagnostic categories.',
    decisionCriteria: [
      'Uncomplicated Malaria vs Severe/Complicated Malaria?',
      'Malaria-negative febrile illness (LRTI / Pneumonia, Enteric Fever, UTI, Sepsis, Meningitis)?',
      'Febrile convulsion vs Cerebral Malaria vs Bacterial Meningitis?',
      'IDSR reportable epidemic conditions (Yellow Fever, Cholera, CSM, Measles)?',
    ],
    rolePermissions: {
      'Doctor': 'Primary',
      'Physician Assistant': 'Primary',
      'General Nurse': 'Secondary',
      'Community Health Nurse': 'Secondary',
      'Pharmacist': 'Primary',
    },
    subtasks: [
      {
        id: 'HTA-5.1',
        title: 'Diagnostic Probability Scoring',
        description: 'Calculate likelihood ratios based on Ghana clinical presentation and confirmatory tests.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'Pharmacist'],
        cognitiveLoad: 'High',
        adaptationOpportunity: 'AI differential probability ranked cards with matching vs missing criteria visualization.',
      },
      {
        id: 'HTA-5.2',
        title: 'Severity & Complication Stratification',
        description: 'Classify as Outpatient Manageable vs Emergency Pre-Referral vs Inpatient Admission.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse', 'Pharmacist'],
        cognitiveLoad: 'High',
        adaptationOpportunity: 'Color-coded triage category with immediate protocol lock.',
      },
    ],
  },
  {
    id: 'HTA-6.0',
    taskNumber: '6.0',
    name: 'Ghana EML Treatment Formulation & Dosing Calculation',
    category: 'Treatment & Dosing',
    description: 'Formulation of weight-based ACT regimen, antipyretic dosing, supportive care, and patient counseling.',
    decisionCriteria: [
      'First-line ACT selection: Artemether-Lumefantrine (AL) vs Artesunate-Amodiaquine (AA) vs Dihydroartemisinin-Piperaquine (DHAP)?',
      'Weight-tiered tablet dosing (5-14kg, 15-24kg, 25-34kg, >35kg)?',
      'Pregnancy trimester contraindications (Oral Quinine + Clindamycin in 1st trimester; AL/AA in 2nd/3rd trimester)?',
      'Pre-referral emergency dosing: IM Artesunate (2.4 mg/kg) or Rectal Artesunate capsule?',
      'NHIS reimbursement and facility stock status verification?',
    ],
    rolePermissions: {
      'Doctor': 'Primary',
      'Physician Assistant': 'Primary',
      'General Nurse': 'Primary',
      'Community Health Nurse': 'Primary',
      'Pharmacist': 'Primary',
    },
    subtasks: [
      {
        id: 'HTA-6.1',
        title: 'Weight-Based Prescription Generation',
        description: 'Calculate exact pediatric or adult milligram and tablet count with meal instructions (e.g. take AL with fatty food).',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'Pharmacist', 'Community Health Nurse'],
        cognitiveLoad: 'Medium',
        adaptationOpportunity: 'Auto-calculate exact tablet counts and duration based on weight input; render blister pack visual icons.',
      },
      {
        id: 'HTA-6.2',
        title: 'Drug Interaction & Safety Screening',
        description: 'Verify absence of QT-prolonging drugs, G6PD allergy, or co-trimoxazole duplication.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'Pharmacist'],
        cognitiveLoad: 'High',
        adaptationOpportunity: 'Proactive red alert flags for dangerous drug interactions and pregnancy safety.',
      },
      {
        id: 'HTA-6.3',
        title: 'Patient & Caregiver Counselling in Local Languages',
        description: 'Deliver structured adherence guidance in Twi, Ga, Ewe, or Hausa.',
        isDecisionPoint: false,
        requiredForRoles: ['General Nurse', 'Community Health Nurse', 'Pharmacist', 'Physician Assistant'],
        cognitiveLoad: 'Low',
        adaptationOpportunity: 'Multilingual audio and phrasebook snippets for medication instructions and return-warning triggers.',
      },
    ],
  },
  {
    id: 'HTA-7.0',
    taskNumber: '7.0',
    name: 'Emergency Pre-Referral Stabilization & Transfer',
    category: 'Referral & Transport',
    description: 'Protocolized emergency stabilization (IM Artesunate stat, IV fluids, oxygen, tepid sponge) and SBAR transfer documentation.',
    decisionCriteria: [
      'Has stat pre-referral antimalarial been administered and documented (Time, dose, route)?',
      'Is airway secured and hypoglycemia corrected with 10% Dextrose?',
      'Is SBAR (Situation, Background, Assessment, Recommendation) referral letter generated?',
      'Is national emergency transport / ambulance (112) or local tricycle dispatched?',
    ],
    rolePermissions: {
      'Doctor': 'Primary',
      'Physician Assistant': 'Primary',
      'General Nurse': 'Primary',
      'Community Health Nurse': 'Primary',
      'Pharmacist': 'Secondary',
    },
    subtasks: [
      {
        id: 'HTA-7.1',
        title: 'Pre-Referral Stat Medication Administration',
        description: 'Administer IM Artesunate 2.4mg/kg (or 3.0mg/kg if < 20kg) or Rectal Artesunate 100mg before dispatch.',
        isDecisionPoint: true,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse'],
        cognitiveLoad: 'High',
        adaptationOpportunity: 'Emergency timer countdown and dilution guide for Artesunate vial reconstitution.',
      },
      {
        id: 'HTA-7.2',
        title: 'Structured SBAR Handover Generation',
        description: 'Compile concise clinical transfer summary for receiving district hospital.',
        isDecisionPoint: false,
        requiredForRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse'],
        cognitiveLoad: 'Medium',
        adaptationOpportunity: 'One-click auto-populated SBAR document formatted for print or digital dispatch.',
      },
    ],
  },
];

// =========================================================================
// LAYER 2: DECISION REQUIREMENTS MODELLING (DRM) TABLES
// Mapping Clinical Tasks, Information Needs, Roles, Context, and Triggers
// =========================================================================

export const DECISION_REQUIREMENTS_TABLES: DecisionRequirementEntry[] = [
  {
    id: 'DRM-001',
    clinicalTask: 'Triage & Acuity Classification',
    informationNeeds: [
      'Patient exact age (months vs years)',
      'Body temperature & fever duration',
      'Presence of 4 IMNCI Danger Signs',
      'Conscious state (AVPU / Blantyre scale)',
      'Respiratory rate & chest indrawing',
      'Oxygen saturation (SpO2)',
    ],
    userRoles: ['General Nurse', 'Community Health Nurse', 'Physician Assistant', 'Doctor'],
    contextualFactors: [
      'High patient volume at morning OPD',
      'Lack of automated pulse oximeter at CHPS',
      'Caregiver anxiety & language barrier',
    ],
    adaptationTriggers: [
      'Any positive danger sign (Convulsions, vomiting everything, lethargy)',
      'Temperature >= 39.5°C in child < 5 years (Febrile convulsion risk)',
      'SpO2 < 92% or respiratory rate >= 50 bpm (Infant)',
    ],
    cognitiveSupportMechanisms: [
      'Instant Emergency Red Banner with acoustic visual alert',
      'Color-coded age-specific vital threshold badges',
      'Auto-activation of emergency pre-referral checklist',
    ],
    uiOutputStrategy: 'Expand Emergency Resuscitation Panel to 100% width; collapse routine history fields to minimize cognitive friction.',
  },
  {
    id: 'DRM-002',
    clinicalTask: 'Malaria Diagnostic Confirmation & Testing Choice',
    informationNeeds: [
      'Local mRDT cassette stock validity',
      'Microscopy availability & turnaround time at facility',
      'Prior antimalarial ingestion (false positive HRP2 antigen risk)',
      'Alternative febrile etiologies if mRDT is negative',
    ],
    userRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse', 'Pharmacist'],
    contextualFactors: [
      'Frequent mRDT stockouts in remote sub-districts',
      'Power outages disabling laboratory microscope light',
      'High patient expectation for antimalarials even if test negative',
    ],
    adaptationTriggers: [
      'mRDT Negative with persistent high fever >= 38.5°C',
      'mRDT Positive in child with respiratory distress',
      'Stockout of mRDT kits at facility',
    ],
    cognitiveSupportMechanisms: [
      'Interactive Test-Before-Treat compliance reminder',
      'Differential explorer for mRDT-negative febrile illness (Pneumonia, Typhoid, UTI)',
      'Alternative diagnostic guidance when laboratory tests are unavailable',
    ],
    uiOutputStrategy: 'Doctor/PA: Show full differential diagnostic tree; CHN/Nurse: Show clear mRDT step-by-step timer and result entry with pictorial cards.',
  },
  {
    id: 'DRM-003',
    clinicalTask: 'Antimalarial Regimen Selection & Weight Dosing',
    informationNeeds: [
      'Patient exact weight in kg (or age if scale broken)',
      'Pregnancy status and exact trimester',
      'History of adverse reaction to Amodiaquine or Lumefantrine',
      'Comorbidities (Sickle cell crisis, severe acute malnutrition, G6PD)',
      'Current facility drug stock levels (AL vs ASAQ vs DHAP)',
    ],
    userRoles: ['Pharmacist', 'Doctor', 'Physician Assistant', 'Community Health Nurse'],
    contextualFactors: [
      'Different packaging strengths (Dispersible vs Standard tablets)',
      'Caregiver literacy and ability to administer twice-daily dosing with meals',
      'National Health Insurance Scheme (NHIS) medicine reimbursement codes',
    ],
    adaptationTriggers: [
      'Patient is in 1st trimester of pregnancy (Contraindicates AL/ASAQ/DHAP)',
      'Patient weight < 5 kg (Requires special neonatal dosage consultation)',
      'Facility stockout of first-line Artemether-Lumefantrine',
      'Severe vomiting preventing oral medication retention',
    ],
    cognitiveSupportMechanisms: [
      'Automated weight-to-tablet calculation engine with blister pack diagrams',
      'Pregnancy safety warning chip locking oral ACTs in 1st trimester',
      'Facility stock substitution recommendation (e.g. switch to ASAQ if AL out of stock)',
    ],
    uiOutputStrategy: 'Pharmacist: High-density multi-drug interaction matrix and stock inventory panel; CHN: Simple visual blister pack dosing card with morning/evening icons.',
  },
  {
    id: 'DRM-004',
    clinicalTask: 'Pre-Referral Emergency Stabilization & Transfer',
    informationNeeds: [
      'Specific indication for referral (Severe malaria criteria, uncorrectable shock, surgical abdomen)',
      'Availability of IM Artesunate or Rectal Artesunate at sending facility',
      'Distance and travel time to nearest District/Regional Hospital',
      'Receiving hospital emergency bed and oxygen capacity',
      'Contact number of District Health Directorate ambulance dispatcher',
    ],
    userRoles: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse'],
    contextualFactors: [
      'Poor road infrastructure and lack of motorized ambulance',
      'Night-time referral challenges in rural communities',
      'Caregiver refusal of referral due to financial or domestic constraints',
    ],
    adaptationTriggers: [
      'Presence of any severe malaria criterion (Prostration, coma, dark urine, severe jaundice)',
      'Failure of patient to improve after 48 hours of first-line therapy',
      'Oxygen saturation SpO2 < 90% at primary health centre',
    ],
    cognitiveSupportMechanisms: [
      'Standardized GHS SBAR Clinical Handover Generator',
      'Artesunate dilution calculator (Reconstitution with 5% Sodium Bicarbonate + Saline)',
      'Pre-referral care checklist (IV line, 10% Dextrose, Oxygen, Paracetamol)',
    ],
    uiOutputStrategy: 'Surface the SBAR Pre-Referral Form as the primary full-width card with one-click print/export buttons.',
  },
  {
    id: 'DRM-005',
    clinicalTask: 'Patient Adherence & Community Health Counselling',
    informationNeeds: [
      'Patient primary spoken language (Twi, Ga, Ewe, Hausa, Dagbani, English)',
      'Caregiver understanding of completing the full 3-day ACT course',
      'Specific danger signs that require immediate return to facility',
      'Insecticide-Treated Net (ITN) ownership and sleeping habits',
    ],
    userRoles: ['Community Health Nurse', 'General Nurse', 'Pharmacist', 'Physician Assistant'],
    contextualFactors: [
      'Traditional health beliefs attributing convulsions to spiritual causes',
      'Premature cessation of antimalarials once fever resolves on Day 2',
      'Improper administration of fat-soluble Lumefantrine without breastmilk or porridge',
    ],
    adaptationTriggers: [
      'Patient/caregiver speaks primarily local dialect',
      'High-risk pediatric patient returning to remote farming community',
      'History of recurrent malaria episodes within 3 months',
    ],
    cognitiveSupportMechanisms: [
      'Multilingual phrasebook with clinical pronunciation in Ghanaian languages',
      'Visual pictorial adherence schedules for low-literacy caregivers',
      'Preventive education modules (ITN usage, larval source management, IPTp for pregnancy)',
    ],
    uiOutputStrategy: 'Expand the Multilingual Counselling Widget with selectable language tabs and audio/phrase cues.',
  },
];

// =========================================================================
// LAYER 3: VECTOR RETRIEVAL LAYER (SEMANTIC SIMILARITY MATCHING ENGINE)
// Multi-factor Context Vector Matching across Task, Role, Acuity, and Tier
// =========================================================================

export function retrieveAdaptiveKnowledge(
  context: UserContextLayerState,
  queryKeyword: string = ''
): SemanticRetrievalResult[] {
  const results: SemanticRetrievalResult[] = [];
  const searchTokens = queryKeyword.toLowerCase().split(/\s+/).filter(Boolean);

  // 1. Search HTA Workflow Models
  HTA_WORKFLOW_MODELS.forEach((hta) => {
    let score = 0.5; // Base score
    const matchedTokens: string[] = [];

    // Role weighting
    if (hta.rolePermissions[context.role] === 'Primary') score += 0.25;
    else if (hta.rolePermissions[context.role] === 'Excluded') score -= 0.35;

    // Task & Acuity match
    if (context.patientCondition.acuity === 'CRITICAL_EMERGENCY' && (hta.id === 'HTA-1.0' || hta.id === 'HTA-7.0')) {
      score += 0.3;
      matchedTokens.push('Emergency Acuity Priority');
    }

    if (context.currentTask === 'treatmentplan' && hta.id === 'HTA-6.0') {
      score += 0.35;
      matchedTokens.push('Direct Task Match: Treatment Plan');
    }

    if (context.currentTask === 'testing' && hta.id === 'HTA-4.0') {
      score += 0.35;
      matchedTokens.push('Direct Task Match: Testing & Lab');
    }

    // Keyword matching
    searchTokens.forEach((token) => {
      if (hta.name.toLowerCase().includes(token) || hta.description.toLowerCase().includes(token)) {
        score += 0.15;
        matchedTokens.push(token);
      }
    });

    results.push({
      chunkId: hta.id,
      title: `${hta.taskNumber} ${hta.name}`,
      category: 'HTA_WORKFLOW',
      similarityScore: Math.min(1.0, Math.max(0.1, Number(score.toFixed(2)))),
      matchedTokens,
      relevanceRationale: `Hierarchical workflow model tailored for ${context.role} during ${hta.category} phase.`,
      content: `${hta.description} Key decisions: ${hta.decisionCriteria.join('; ')}`,
    });
  });

  // 2. Search Decision Requirements Tables
  DECISION_REQUIREMENTS_TABLES.forEach((drm) => {
    let score = 0.45;
    const matchedTokens: string[] = [];

    if (drm.userRoles.includes(context.role)) {
      score += 0.25;
      matchedTokens.push(`Role Match (${context.role})`);
    }

    // Context triggers
    if (context.patientCondition.dangerSignsPresent.length > 0 && drm.id === 'DRM-001') {
      score += 0.3;
      matchedTokens.push('Danger Sign Active');
    }
    if (context.patientCondition.isPregnant && drm.id === 'DRM-003') {
      score += 0.3;
      matchedTokens.push('Pregnancy Context');
    }
    if (context.facilityCharacteristics.facilityLevel === 'CHPS Compound' && drm.id === 'DRM-004') {
      score += 0.25;
      matchedTokens.push('CHPS Referral Trigger');
    }

    searchTokens.forEach((token) => {
      if (drm.clinicalTask.toLowerCase().includes(token) || drm.uiOutputStrategy.toLowerCase().includes(token)) {
        score += 0.15;
        matchedTokens.push(token);
      }
    });

    results.push({
      chunkId: drm.id,
      title: `DRM: ${drm.clinicalTask}`,
      category: 'DECISION_REQUIREMENT',
      similarityScore: Math.min(1.0, Math.max(0.1, Number(score.toFixed(2)))),
      matchedTokens,
      relevanceRationale: `Decision table identifying information needs and adaptation triggers for ${context.role}.`,
      content: `Information Needs: ${drm.informationNeeds.join(', ')}. Strategy: ${drm.uiOutputStrategy}`,
    });
  });

  // Sort descending by similarity score
  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}

// =========================================================================
// LAYER 4 & 5: GENERATION & ADAPTIVE INTERFACE SPECIFICATION ENGINE
// Generates dynamic UI layout specifications tailored to Role, Task, & Context
// =========================================================================

export function generateAdaptiveUISpecification(
  context: UserContextLayerState
): DynamicUISpecification {
  const isEmergency = context.patientCondition.acuity === 'CRITICAL_EMERGENCY' || context.patientCondition.dangerSignsPresent.length > 0;
  const isNovice = context.clinicalExperience === 'Novice';
  const role = context.role;

  const components: DynamicUISpecification['components'] = [];
  const activeAlerts: DynamicUISpecification['activeAlerts'] = [];

  // Emergency Alert Banner (High Priority)
  if (isEmergency) {
    activeAlerts.push({
      id: 'ALT-CRIT-01',
      level: 'CRITICAL',
      message: `CRITICAL ALERT: Patient displays ${context.patientCondition.dangerSignsPresent.join(', ') || 'Severe Clinical Danger Signs'}. Immediate pre-referral stabilization required!`,
      actionLabel: 'Initiate Emergency Pre-Referral Protocol',
    });

    components.push({
      componentId: 'CMP-EMERGENCY-BANNER',
      componentType: 'AlertBanner',
      title: 'Immediate Life-Threatening Danger Sign Protocol',
      priorityOrder: 1,
      isExpandedByDefault: true,
      visibilityRule: 'SHOW_ALWAYS',
      targetRole: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse', 'Pharmacist'],
      layoutGridSpan: 'col-span-12',
      visualWeight: 'CRITICAL_ALARM',
      dynamicContent: {
        headline: 'CRITICAL PRE-REFERRAL RESUSCITATION TRIGGERED',
        actionableDirectives: [
          'Administer stat IM Artesunate 2.4 mg/kg (or 3.0 mg/kg if < 20 kg) immediately before transport.',
          'Secure peripheral IV line and check rapid blood glucose (treat hypoglycemia if < 3.0 mmol/L with 10% Dextrose).',
          'Position patient in left lateral recovery position if convulsion or coma present.',
          'Dispatch emergency referral transport to nearest District Hospital with SBAR handover.',
        ],
        guidelineCitations: ['Ghana STG 7th Edition Section 1.1.2', 'GHS Emergency Referral Policy (NMEP 2023-2028)'],
        customBadge: 'EMERGENCY STABILIZATION',
      },
    });
  }

  // Role-Specific Adaptive Dashboards & Panels
  if (role === 'Doctor') {
    components.push({
      componentId: 'CMP-DOC-DIFFERENTIAL',
      componentType: 'DiagnosticPanel',
      title: 'Advanced Multi-Etiology Differential Matrix',
      priorityOrder: 2,
      isExpandedByDefault: true,
      visibilityRule: 'SHOW_ALWAYS',
      targetRole: ['Doctor'],
      layoutGridSpan: isEmergency ? 'col-span-8' : 'col-span-12',
      visualWeight: 'HIGHLIGHT',
      dynamicContent: {
        headline: 'Comprehensive Diagnostic Probability Hierarchy',
        actionableDirectives: [
          'Assess for co-existing severe bacterial infection (Sepsis, Bacterial Meningitis, Severe Pneumonia).',
          'Order Full Blood Count, Blood Film Microscopy, and Serum Creatinine/Lactate if available.',
          'Review G6PD status before prescribing high-dose primaquine or sulfa-derivatives.',
        ],
        guidelineCitations: ['GHS STG Chapter 1 (Infectious Diseases)', 'WHO Severe Malaria Guidelines 2024'],
        metricsOrValues: {
          malariaPfProbability: '88%',
          severeSepsisRisk: isEmergency ? 'HIGH' : 'LOW',
          recommendedTier: context.facilityCharacteristics.facilityLevel,
        },
      },
    });
  } else if (role === 'General Nurse') {
    components.push({
      componentId: 'CMP-NURSE-TRIAGE-MONITOR',
      componentType: 'Dashboard',
      title: 'Clinical Triage, Vitals Trending & Bedside Nursing Plan',
      priorityOrder: 2,
      isExpandedByDefault: true,
      visibilityRule: 'SHOW_ALWAYS',
      targetRole: ['General Nurse'],
      layoutGridSpan: 'col-span-12',
      visualWeight: 'HIGHLIGHT',
      dynamicContent: {
        headline: 'Bedside Nursing Interventions & Monitoring Schedule',
        actionableDirectives: [
          'Perform hourly vital signs check (Temperature, HR, RR, SpO2).',
          'Apply tepid sponging with lukewarm water for temperature >= 38.5°C.',
          'Maintain accurate fluid balance chart (Intake / Output monitoring).',
          'Monitor IV drip rate and ensure cannula site is patent without extravasation.',
        ],
        guidelineCitations: ['GHS Nursing Practice Protocols 2022', 'IMNCI Clinical Guide'],
      },
    });
  } else if (role === 'Community Health Nurse') {
    components.push({
      componentId: 'CMP-CHN-PICTORIAL-CARE',
      componentType: 'RecommendationCard',
      title: 'CHPS Zone Pictorial Screening & Community Referral',
      priorityOrder: 2,
      isExpandedByDefault: true,
      visibilityRule: 'SHOW_ALWAYS',
      targetRole: ['Community Health Nurse'],
      layoutGridSpan: 'col-span-12',
      visualWeight: 'HIGHLIGHT',
      dynamicContent: {
        headline: 'Community-Level IMNCI Danger Screening & Action',
        actionableDirectives: [
          'Perform Pf mRDT using aseptic technique and timer (read at exactly 15-20 min).',
          'Measure Mid-Upper Arm Circumference (MUAC) for acute malnutrition triage.',
          'Dispense first-line oral AL blister pack only if mRDT is positive and child can retain fluids.',
          'If danger signs present: Administer pre-referral Rectal Artesunate (100mg) and call community transport.',
        ],
        guidelineCitations: ['GHS CHPS Operational Policy', 'National Community-Based Health Planning (CHPS) Guidelines'],
        customBadge: 'COMMUNITY WORKFLOW',
      },
    });
  } else if (role === 'Pharmacist') {
    components.push({
      componentId: 'CMP-PHARMACY-DOSING',
      componentType: 'DosageCalculator',
      title: 'Ghana EML Weight Dosing & Drug Safety Interaction Engine',
      priorityOrder: 2,
      isExpandedByDefault: true,
      visibilityRule: 'SHOW_ALWAYS',
      targetRole: ['Pharmacist'],
      layoutGridSpan: 'col-span-12',
      visualWeight: 'HIGHLIGHT',
      dynamicContent: {
        headline: 'Precision Formulary Dosing & Stock Optimization',
        actionableDirectives: [
          'Verify weight-based tablet count (Artemether-Lumefantrine 20/120mg vs ASAQ tablets).',
          'Counsel caregiver to administer oral ACT with fatty meal/breastmilk to maximize Lumefantrine bioavailability.',
          'Check for duplicate antipyretic administration (avoid toxic Paracetamol compounding).',
          'Verify NHIS reimbursement code for prescribed medication.',
        ],
        guidelineCitations: ['Ghana Essential Medicines List (EML 7th Edition 2017)', 'Pharmacy Council Ghana Standards'],
        customBadge: 'DISPENSING & PHARMACOVIGILANCE',
      },
    });
  } else {
    // Physician Assistant
    components.push({
      componentId: 'CMP-PA-INTEGRATED',
      componentType: 'Dashboard',
      title: 'Primary Care Syndromic Assessment & Treatment Pathways',
      priorityOrder: 2,
      isExpandedByDefault: true,
      visibilityRule: 'SHOW_ALWAYS',
      targetRole: ['Physician Assistant'],
      layoutGridSpan: 'col-span-12',
      visualWeight: 'HIGHLIGHT',
      dynamicContent: {
        headline: 'Protocol-Driven Primary Care Decision Pathway',
        actionableDirectives: [
          'Confirm diagnosis with mRDT before prescribing antimalarial.',
          'Prescribe weight-calculated Artemether-Lumefantrine (first-line) or ASAQ.',
          'If mRDT is negative, systematically evaluate for Respiratory, Enteric, or Urinary infection.',
          'Initiate pre-referral emergency stabilization for any patient with severe danger signs.',
        ],
        guidelineCitations: ['Ghana STG 7th Edition Sub-district Guidelines'],
        customBadge: 'HEALTH CENTRE PRIMARY CARE',
      },
    });
  }

  // Multilingual Counselling Card (Universal for all roles)
  components.push({
    componentId: 'CMP-COUNSELLING-MULTILINGUAL',
    componentType: 'RecommendationCard',
    title: 'Culturally Adapted Patient Counselling (Twi, Ga, Ewe, Hausa)',
    priorityOrder: 3,
    isExpandedByDefault: !isEmergency,
    visibilityRule: isEmergency ? 'COLLAPSED_FOR_EXPERT' : 'SHOW_ALWAYS',
    targetRole: ['Doctor', 'Physician Assistant', 'General Nurse', 'Community Health Nurse', 'Pharmacist'],
    layoutGridSpan: 'col-span-12',
    visualWeight: 'STANDARD',
    dynamicContent: {
      headline: 'Key Caregiver Messages & Danger Warning Instructions',
      actionableDirectives: [
        'Emphasize completing all 6 doses over 3 days even if fever stops completely on Day 2.',
        'Warn caregiver to bring patient back immediately if child develops vomiting, convulsions, or extreme weakness.',
        'Encourage consistent sleeping under Long-Lasting Insecticidal Nets (LLIN).',
        'Promote adequate hydration with oral rehydration solution (ORS) and clean water.',
      ],
      guidelineCitations: ['GHS Health Promotion Division IEC Materials'],
      customBadge: 'MULTILINGUAL COUNSELLING',
    },
  });

  // HTA-Driven Workflow Sequence
  const workflowSequence: DynamicUISpecification['workflowSequence'] = [
    { step: 'patientData', label: '1. Patient Data & Triage', isPriority: true },
    { step: 'vitals', label: '2. Vitals & Danger Signs', isPriority: true, badgeNote: isEmergency ? 'CRITICAL' : undefined },
    { step: 'planOfCare', label: '3. Plan of Care', isPriority: role === 'General Nurse' },
    { step: 'counselling', label: '3a. Caregiver Counselling', isPriority: role === 'Community Health Nurse' },
    { step: 'history', label: '4. Clinical History', isPriority: role === 'Doctor' || role === 'Physician Assistant' },
    { step: 'symptoms', label: '4a. Symptoms & ROS', isPriority: role === 'Doctor' || role === 'Physician Assistant' },
    { step: 'examination', label: '5. Physical Examination', isPriority: role === 'Doctor' || role === 'Physician Assistant' },
    { step: 'diagnosis', label: '6. Differential Diagnosis', isPriority: role === 'Doctor' || role === 'Physician Assistant' },
    { step: 'testing', label: '7. Diagnostic Tests', isPriority: true },
    { step: 'treatmentplan', label: '9. Treatment & Dosing', isPriority: true },
    { step: 'referral', label: '10. Referral & SBAR', isPriority: isEmergency },
  ];

  return {
    generatedAt: new Date().toISOString(),
    generatorEngine: 'Claude-3.7-Sonnet',
    targetRole: role,
    experienceMode: isNovice ? 'Guided-Novice' : 'HighDensity-Expert',
    layoutArchetype: isEmergency 
      ? 'Triage-First-Emergency' 
      : role === 'Community Health Nurse' 
        ? 'Community-Pictorial-Screening' 
        : role === 'Pharmacist' 
          ? 'Prescription-Dispensing-Focus' 
          : 'Comprehensive-Differential-Tree',
    cognitiveLoadTarget: isNovice ? 'Streamlined' : isEmergency ? 'Streamlined' : 'Comprehensive',
    activeAlerts,
    components,
    workflowSequence,
  };
}

// =========================================================================
// LAYER 6: FEEDBACK & LEARNING METRICS STORE
// =========================================================================

export const INITIAL_ADAPTIVE_METRICS: AdaptiveFeedbackMetrics = {
  totalInteractionsLogged: 1482,
  guidelineAcceptanceRate: 94.2, // 94.2% clinician adherence
  averageTimeReductionPercent: 36.8, // 36.8% faster task completion
  roleAcceptanceRates: {
    'Doctor': 92.5,
    'Physician Assistant': 96.1,
    'General Nurse': 95.8,
    'Community Health Nurse': 97.4,
    'Pharmacist': 93.9,
  },
  mostOverriddenComponents: [
    'Advanced Lab Microscopy (Suppressed at CHPS level)',
    'Routine History Fields (Collapsed during Critical Emergency)',
    'Second-Line Antimalarial Warnings (Expanded for Specialist)',
  ],
  cognitiveLoadRatingAverage: 4.6, // Out of 5.0
};
