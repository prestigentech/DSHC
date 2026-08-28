import { CadreHTATree, CadreRole } from '../types';

/**
 * Cadre-Specific Hierarchical Task Analysis (HTA) Models for Diagnosing Febrile Illnesses
 * Derived directly from Clinical Human-Computer Interaction (HCI) workflow studies in Ghanaian healthcare facilities.
 * 
 * Modeled verbatim from the 4 primary HTA tree diagrams:
 * 1. HTA for Doctors
 * 2. HTA for General Nurse
 * 3. HTA for Community Health Nurse (CHN)
 * 4. HTA for Pharmacist
 * + Comprehensive Physician Assistant Bridge Model
 */

export const CADRE_HTA_TREES: Record<string, CadreHTATree> = {
  // =========================================================================
  // 1. HTA FOR DOCTORS
  // =========================================================================
  doctor: {
    role: 'Doctor',
    cadreKey: 'doctor',
    title: 'HTA for Doctors',
    goal: '0 : Diagnosing Febrile Illnesses',
    rootPlan: 'Step 0: do 1, 2, 3, 4, & 5 in order',
    contextSummary: 'Full-spectrum clinical reasoning in hospital Outpatient Departments (OPD), Emergency Units, and Medical/Pediatric Wards. Emphasizes comprehensive history, systemic physical exam, tiered laboratory ordering, differential synthesis, and tri-modal disposition (In-patient, Outpatient, Specialist referral).',
    practiceSetting: 'District, Regional, and Teaching Hospitals (OPD & Inpatient Wards)',
    decisionAutonomy: 'Independent Specialist',
    keyDifferences: [
      'Begins directly with History Taking as vitals & age are pre-recorded by nursing triage.',
      'Comprehensive 6-domain Past Medical History (DHx, SHx, FHx, Travel, Chronic conditions, Allergies).',
      'Systematic 6-system physical examination based on history outcomes.',
      'Formulates initial diagnostic impression (InP) and differential diagnosis before lab requests.',
      'Two-tiered laboratory investigations: Routine tests followed by specialized/further tests if indicated.',
      'Decides between 3 disposition pathways: In-patient admission, Outpatient prescription, or Specialist referral.',
    ],
    branches: [
      {
        stepNumber: '1',
        name: 'History Taking',
        planDescription: 'Step 1: do 1.1, 1.2, 1.3',
        inputArtifacts: ['Vital signs and age presented (from Nursing Triage)'],
        nodes: [
          {
            code: '1.1',
            name: 'Presenting Complain (PC)',
            plan: 'Step 1.1: do 1.1.1',
            children: [
              {
                code: '1.1.1',
                name: 'History of presenting Complain (HPC)',
                type: 'task',
                clinicalRationale: 'Elicit fever onset, duration, pattern (intermittent/continuous), chills, rigors, and diurnal variations.',
                cognitiveLoad: 'Medium',
              },
            ],
          },
          {
            code: '1.2',
            name: 'On Direct Questioning (ODQ)',
            plan: 'Step 1.2: do 1.2.1',
            children: [
              {
                code: '1.2.1',
                name: 'Ask specific focused questions about symptoms',
                type: 'task',
                clinicalRationale: 'Rule in/out specific organ foci: CNS (headache, neck pain), Respiratory (cough, dyspnea), GI (vomiting, diarrhea), Renal (dysuria).',
                cognitiveLoad: 'High',
              },
            ],
          },
          {
            code: '1.3',
            name: 'Past Medical History (PMHX)',
            plan: 'Step 1.3: do 1.3.1 to 1.3.6 in any order',
            children: [
              {
                code: '1.3.1',
                name: 'Drug History (DHx)',
                type: 'task',
                clinicalRationale: 'Document prior antimalarials, antibiotics, OTC antipyretics, and herbal remedies taken in past 14 days.',
                cognitiveLoad: 'Low',
              },
              {
                code: '1.3.2',
                name: 'Social History (SHx)',
                type: 'task',
                clinicalRationale: 'Assess living environment, mosquito net usage, occupation, water sources, and sanitation.',
                cognitiveLoad: 'Low',
              },
              {
                code: '1.3.3',
                name: 'Family History (FHx)',
                type: 'task',
                clinicalRationale: 'Screen for sickle cell trait/disease, G6PD deficiency, and familial febrile syndromes.',
                cognitiveLoad: 'Low',
              },
              {
                code: '1.3.4',
                name: 'Travel History',
                type: 'task',
                clinicalRationale: 'Assess travel to high-transmission malaria regions or meningitis belt (Northern Ghana).',
                cognitiveLoad: 'Low',
              },
              {
                code: '1.3.5',
                name: 'Chronic Conditions',
                type: 'task',
                clinicalRationale: 'Identify comorbidities: Sickle Cell Disease (HbSS), HIV/AIDS, Diabetes Mellitus, Chronic Kidney Disease.',
                cognitiveLoad: 'Medium',
              },
              {
                code: '1.3.6',
                name: 'Allergies',
                type: 'task',
                clinicalRationale: 'Verify drug allergies (Sulfa drugs, Penicillins, Artemisinins) to prevent adverse reactions.',
                cognitiveLoad: 'Low',
              },
            ],
          },
        ],
      },
      {
        stepNumber: '2',
        name: 'Physical Examination',
        planDescription: 'Step 2: do 2.1 to 2.3.1',
        nodes: [
          {
            code: '2.1',
            name: 'General Condition (G/C)',
            plan: 'Step 2.1: do 2.1.1 to 2.1.4',
            children: [
              {
                code: '2.1.1',
                name: 'Appearance',
                type: 'task',
                clinicalRationale: 'Assess acute vs chronic illness appearance, toxic look, pallor, jaundice, cyanosis, and distress.',
                cognitiveLoad: 'Medium',
              },
              {
                code: '2.1.2a',
                name: 'Vital Signs',
                plan: 'Step 2.1.2: Recheck vital signs if necessary',
                type: 'task',
                clinicalRationale: 'Verify critical vitals (Temp, HR, BP, RR, SpO2) if clinical picture suggests rapid deterioration.',
                cognitiveLoad: 'Low',
              },
              {
                code: '2.1.2b',
                name: 'Level of Consciousness',
                type: 'task',
                clinicalRationale: 'Score Glasgow Coma Scale (GCS) or Blantyre Coma Scale (pediatric) and AVPU scale.',
                cognitiveLoad: 'Medium',
              },
              {
                code: '2.1.3',
                name: 'Mobility',
                type: 'task',
                clinicalRationale: 'Evaluate gait, ability to stand/walk without assistance, prostration, or extreme weakness.',
                cognitiveLoad: 'Low',
              },
              {
                code: '2.1.4',
                name: 'Mood and affect',
                type: 'task',
                clinicalRationale: 'Observe irritability, lethargy, anxiety, confusion, or delirium.',
                cognitiveLoad: 'Low',
              },
            ],
          },
          {
            code: '2.2',
            name: 'On Examination (O/E)',
            plan: 'Step 2.2: do 2.2.1 to 2.2.6 based on outcome of step 1',
            children: [
              {
                code: '2.2.1',
                name: 'Head and neck examination',
                type: 'task',
                clinicalRationale: 'Inspect throat/tonsils, tympanic membranes, conjunctivae, sclera, and check for neck stiffness & Kernig/Brudzinski signs.',
                cognitiveLoad: 'Medium',
              },
              {
                code: '2.2.2',
                name: 'Chest examination',
                type: 'task',
                clinicalRationale: 'Auscultate for crackles, wheezing, bronchial breathing; inspect for subcostal/intercostal indrawing.',
                cognitiveLoad: 'Medium',
              },
              {
                code: '2.2.3',
                name: 'Abdominal examination',
                type: 'task',
                clinicalRationale: 'Palpate for hepatosplenomegaly, epigastric/RUQ/RLQ tenderness, guarding, and ascites.',
                cognitiveLoad: 'Medium',
              },
              {
                code: '2.2.4',
                name: 'Cardiovascular examination',
                type: 'task',
                clinicalRationale: 'Auscultate heart sounds, murmurs, assess pulse volume, peripheral perfusion, and capillary refill time.',
                cognitiveLoad: 'Medium',
              },
              {
                code: '2.2.5',
                name: 'Musculoskeletal examination',
                type: 'task',
                clinicalRationale: 'Examine joints for swelling, warmth, tenderness (reactive arthritis, sickle cell crisis, osteomyelitis).',
                cognitiveLoad: 'Low',
              },
              {
                code: '2.2.6',
                name: 'Neurological examination',
                type: 'task',
                clinicalRationale: 'Focal neurological deficits, cranial nerves, reflexes, tone, and signs of raised intracranial pressure.',
                cognitiveLoad: 'High',
              },
            ],
          },
          {
            code: '2.3',
            name: 'Impression (InP)',
            plan: 'Step 2.3: do 2.3.1',
            children: [
              {
                code: '2.3.1',
                name: 'Differential diagnosis',
                type: 'decision',
                clinicalRationale: 'Rank diagnostic hypotheses (e.g. Severe Malaria vs Sepsis vs Pneumonia vs Typhoid vs Meningitis).',
                cognitiveLoad: 'High',
              },
            ],
          },
        ],
      },
      {
        stepNumber: '3',
        name: 'Laboratory Investigations',
        planDescription: 'Step 3: do 3.1 to 3.3',
        nodes: [
          {
            code: '3.1',
            name: 'Fill lab request form',
            type: 'task',
            clinicalRationale: 'Document clinical summary and specific investigation requests on hospital LIMS/paper requisition.',
            cognitiveLoad: 'Low',
          },
          {
            code: '3.2',
            name: 'Routine tests',
            type: 'task',
            clinicalRationale: 'Order Malaria RDT / Blood Film Microscopy, Full Blood Count (FBC/CBC), Urinalysis, and Random Blood Glucose.',
            cognitiveLoad: 'Medium',
          },
          {
            code: '3.3',
            name: 'Further tests',
            plan: 'Step 3.3: do if necessary',
            condition: 'Indicated for severe, atypical, or unconfirmed febrile illness',
            type: 'task',
            clinicalRationale: 'Order Blood/Urine/CSF cultures, Chest X-ray, Lumbar Puncture, Liver Function Tests (LFTs), Renal Function (BUE/Cr), Widal/Typhidot.',
            cognitiveLoad: 'High',
          },
        ],
      },
      {
        stepNumber: '4',
        name: 'Diagnosis',
        planDescription: 'Step 4: do 4.1 to 4.1.2',
        inputArtifacts: ['Laboratory results report'],
        nodes: [
          {
            code: '4.1',
            name: 'Interpretation of lab results',
            plan: 'Step 4.1: do 4.1.1 to 4.1.2',
            children: [
              {
                code: '4.1.1',
                name: 'Cross check results against normal ranges',
                type: 'task',
                clinicalRationale: 'Evaluate Hb/WBC, parasite density/high power field, proteinuria/pyuria, CSF chemistry & microbiology.',
                cognitiveLoad: 'Medium',
              },
              {
                code: '4.1.2',
                name: 'Final Diagnosis',
                type: 'decision',
                clinicalRationale: 'Synthesize confirmed primary diagnosis and secondary complications according to ICD-11 / Ghana STG.',
                cognitiveLoad: 'High',
              },
            ],
          },
        ],
      },
      {
        stepNumber: '5',
        name: 'Treatment Plan',
        planDescription: 'Step 5: decide on 5.1, 5.2 or 5.3',
        isDecisionBranch: true,
        nodes: [
          {
            code: '5.1',
            name: 'In-patient treatment',
            plan: 'Step 5.1: do 5.1.1 to 5.1.2',
            condition: 'Severe malaria, shock, meningitis, respiratory distress, oral failure, or extreme age/vulnerability',
            type: 'decision',
            children: [
              {
                code: '5.1.1',
                name: 'Fill admission form',
                type: 'action',
                clinicalRationale: 'Complete hospital admission chart, assign ward bed, specify nursing care & monitoring frequency.',
                cognitiveLoad: 'Low',
              },
              {
                code: '5.1.2',
                name: 'Prescription (RX)',
                type: 'action',
                clinicalRationale: 'Prescribe parenteral therapy: IV Artesunate (2.4mg/kg at 0, 12, 24h), IV broad-spectrum antibiotics, IV fluids, antipyretics.',
                cognitiveLoad: 'High',
              },
            ],
          },
          {
            code: '5.2',
            name: 'Outpatient treatment',
            plan: 'Step 5.2: do 5.2.1',
            condition: 'Uncomplicated malaria, mild URTI, simple UTI with full oral tolerance',
            type: 'decision',
            children: [
              {
                code: '5.2.1',
                name: 'Prescription (RX)',
                type: 'action',
                clinicalRationale: 'Prescribe first-line oral ACT (Artemether-Lumefantrine / Artesunate-Amodiaquine), oral paracetamol, oral rehydration.',
                cognitiveLoad: 'Medium',
              },
            ],
          },
          {
            code: '5.3',
            name: 'Referral to specialist',
            plan: 'Step 5.3: do 5.3.1 to 5.3.2',
            condition: 'Diagnostic uncertainty, organ failure, neurosurgical emergency, or tertiary-level ICU requirement',
            type: 'decision',
            children: [
              {
                code: '5.3.1',
                name: 'Identify referral facility',
                type: 'task',
                clinicalRationale: 'Select tertiary/teaching center with relevant specialist unit (Pediatric ICU, Nephrology, Infectious Disease).',
                cognitiveLoad: 'Medium',
              },
              {
                code: '5.3.2',
                name: 'Fill referral form',
                type: 'action',
                clinicalRationale: 'Document full clinical notes, lab results, pre-transport stabilization, and ongoing IV medications.',
                cognitiveLoad: 'Medium',
              },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 2. HTA FOR GENERAL NURSE
  // =========================================================================
  general_nurse: {
    role: 'General Nurse',
    cadreKey: 'general_nurse',
    title: 'HTA for General Nurse',
    goal: '0 : Diagnosing Febrile Illnesses',
    rootPlan: 'Step 0: do 1 only if doctor/physician assistant is available; do 1, 2, 3, 4, 5 & 6 if doctor/physician assistant is not available',
    contextSummary: 'Triage, fever mitigation, and autonomous protocol-driven assessment in OPD and inpatient wards. In staffed settings, the nurse triages and routes patients to Doctors/PAs; in task-shifting scenarios without clinicians, the nurse carries out the full diagnostic, testing, and treatment workflow.',
    practiceSetting: 'District Hospitals, Polyclinics, and Sub-district Health Centres',
    decisionAutonomy: 'Protocolized Triage & Care',
    keyDifferences: [
      'Crucial Step 0 branch: If Doctor/PA available, executes Step 1 (Triage & Vitals) and hands off; if unavailable, proceeds through full steps 1-6.',
      'Mandatory immediate fever management (Tepid Sponging & antipyretics) whenever temperature > 37.8°C.',
      'Formal 5-tier color-coded triage classification (Red: Immediate, Orange: <10m, Yellow: <60m, Green: <240m, Blue: Dead).',
      'Direct execution of Rapid Diagnostic Tests (RDT) with fallback to laboratory request forms.',
      'Standardized inpatient care, outpatient prescription, and formal referral workflows.',
    ],
    branches: [
      {
        stepNumber: '1',
        name: 'Initial Patient Assessment',
        planDescription: 'Step 1: do 1.1 to 1.3.1 in order',
        nodes: [
          {
            code: '1.1',
            name: 'Take Vitals',
            plan: 'Step 1.1: do 1.1.1 to 1.1.5 based on availability of devices',
            children: [
              {
                code: '1.1.1',
                name: 'Measure and record temperature',
                type: 'task',
                clinicalRationale: 'Digital or tympanic thermometer check for fever threshold (>37.8°C) and hyperpyrexia (>40.0°C).',
                cognitiveLoad: 'Low',
              },
              {
                code: '1.1.2',
                name: 'Measure and record blood pressure',
                type: 'task',
                clinicalRationale: 'Sphygmomanometer check for hypotension/shock or hypertension.',
                cognitiveLoad: 'Low',
              },
              {
                code: '1.1.3',
                name: 'Measure and record weight',
                type: 'task',
                clinicalRationale: 'Calibrated scale measurement essential for pediatric dosing calculations.',
                cognitiveLoad: 'Low',
              },
              {
                code: '1.1.4',
                name: 'Measure and record pulse',
                type: 'task',
                clinicalRationale: 'Radial/apical pulse rate for tachycardia, bradycardia, or bounding septic pulse.',
                cognitiveLoad: 'Low',
              },
              {
                code: '1.1.5',
                name: 'Measure and record oxygen saturation',
                type: 'task',
                clinicalRationale: 'Pulse oximetry to screen for hypoxemia (SpO2 < 92%) requiring supplemental oxygen.',
                cognitiveLoad: 'Low',
              },
            ],
          },
          {
            code: '1.2',
            name: 'Fever management',
            plan: 'Step 1.2: do if body temperature is above 37.8 degrees celsius',
            condition: 'Body temperature > 37.8°C',
            type: 'action',
            annotations: ['Tepid Sponging / antipyretics (Paracetamol 15mg/kg)'],
            clinicalRationale: 'Initiate non-pharmacologic cooling with lukewarm water on axillae/groin and administer oral paracetamol.',
            cognitiveLoad: 'Low',
          },
          {
            code: '1.3',
            name: 'Triage patients',
            plan: 'Step 1.3: do 1.3.1 and/or 1.3.2',
            children: [
              {
                code: '1.3.1',
                name: 'Sort patients based on triage colours',
                type: 'triage',
                annotations: [
                  'Red: Immediate (0 min)',
                  'Orange: Less than 10 mins',
                  'Yellow: Less than 60 mins',
                  'Green: Less than 240 mins',
                  'Blue: Dead',
                ],
                clinicalRationale: 'Apply South African Triage Scale (SATS) / GHS Emergency Triage Assessment and Treatment (ETAT).',
                cognitiveLoad: 'High',
              },
              {
                code: '1.3.2',
                name: 'Send patient for consultation with doctor/physician assistant',
                plan: 'Step 1.3.2: do if doctor/physician assistant is available',
                condition: 'Doctor / Physician Assistant present at facility',
                type: 'action',
                clinicalRationale: 'Transfer patient chart and triage category to consulting clinician.',
                cognitiveLoad: 'Low',
              },
            ],
          },
        ],
      },
      {
        stepNumber: '2',
        name: 'History Taking',
        planDescription: 'Step 2: do 2.1 to 2.3.5 (Executed when Doctor/PA is unavailable)',
        conditionNotes: 'Active under task-shifting protocols when physician is absent',
        nodes: [
          {
            code: '2.1',
            name: 'Presenting Complain (PC)',
            plan: 'Step 2.1: do 2.1.1',
            children: [
              {
                code: '2.1.1',
                name: 'History of presenting Complain (HPC)',
                type: 'task',
                clinicalRationale: 'Record primary symptom timeline, associated chills, rigors, and vomiting frequency.',
                cognitiveLoad: 'Medium',
              },
            ],
          },
          {
            code: '2.2',
            name: 'On Direct Questioning (ODQ)',
            plan: 'Step 2.2: do 2.2.1',
            children: [
              {
                code: '2.2.1',
                name: 'Ask specific focused questions about symptoms',
                type: 'task',
                clinicalRationale: 'Targeted organ review for cough, diarrhea, convulsions, dysuria, and headache.',
                cognitiveLoad: 'Medium',
              },
            ],
          },
          {
            code: '2.3',
            name: 'Past Medical History (PMHX)',
            plan: 'Step 2.3: do 2.3.1 to 2.3.5',
            children: [
              {
                code: '2.3.1',
                name: 'Drug History (DHx)',
                type: 'task',
                clinicalRationale: 'Document medications taken before arrival (antimalarials, paracetamol, antibiotics).',
                cognitiveLoad: 'Low',
              },
              {
                code: '2.3.2',
                name: 'Social History (SHx) & Family History (FHx)',
                type: 'task',
                clinicalRationale: 'Living conditions, household illness, sickle cell trait, G6PD status.',
                cognitiveLoad: 'Low',
              },
              {
                code: '2.3.3',
                name: 'Travel History',
                type: 'task',
                clinicalRationale: 'Recent travel history outside district or to high transmission regions.',
                cognitiveLoad: 'Low',
              },
              {
                code: '2.3.4',
                name: 'Chronic Conditions',
                type: 'task',
                clinicalRationale: 'Hypertension, Diabetes, Sickle Cell Disease, Asthma, HIV.',
                cognitiveLoad: 'Low',
              },
              {
                code: '2.3.5',
                name: 'Allergies',
                type: 'task',
                clinicalRationale: 'Document drug, food, and environmental allergies.',
                cognitiveLoad: 'Low',
              },
            ],
          },
        ],
      },
      {
        stepNumber: '3',
        name: 'Physical Examination',
        planDescription: 'Step 3: do 3.1 to 3.3.1',
        nodes: [
          {
            code: '3.1',
            name: 'General Condition (G/C)',
            plan: 'Step 3.1: do 3.1.1 to 3.1.4',
            children: [
              { code: '3.1.1', name: 'Appearance (Ill-looking, pale, jaundiced)', type: 'task', cognitiveLoad: 'Low' },
              { code: '3.1.2', name: 'Level of Consciousness (AVPU / Alertness)', type: 'task', cognitiveLoad: 'Medium' },
              { code: '3.1.3', name: 'Mobility (Walking independently vs Prostration)', type: 'task', cognitiveLoad: 'Low' },
              { code: '3.1.4', name: 'Mood and affect (Irritable, lethargic, calm)', type: 'task', cognitiveLoad: 'Low' },
            ],
          },
          {
            code: '3.2',
            name: 'On Examination (O/E)',
            plan: 'Step 3.2: do 3.2.1 to 3.2.6 based on outcome of step 2',
            children: [
              { code: '3.2.1', name: 'Head and neck examination (Tonsils, ears, neck stiffness)', type: 'task', cognitiveLoad: 'Medium' },
              { code: '3.2.2', name: 'Chest examination (Respiratory rate, chest indrawing, breath sounds)', type: 'task', cognitiveLoad: 'Medium' },
              { code: '3.2.3', name: 'Abdominal examination (Tenderness, distension, organomegaly)', type: 'task', cognitiveLoad: 'Medium' },
              { code: '3.2.4', name: 'Cardiovascular examination (Heart sounds, pulse volume, CRT)', type: 'task', cognitiveLoad: 'Low' },
              { code: '3.2.5', name: 'Musculoskeletal examination (Joint swelling, tenderness)', type: 'task', cognitiveLoad: 'Low' },
              { code: '3.2.6', name: 'Neurological examination (Reflexes, abnormal posture, tone)', type: 'task', cognitiveLoad: 'Medium' },
            ],
          },
          {
            code: '3.3',
            name: 'Impression (InP)',
            plan: 'Step 3.3: do 3.3.1',
            children: [
              {
                code: '3.3.1',
                name: 'Differential diagnosis',
                type: 'decision',
                clinicalRationale: 'Syndromic impression based on nursing assessment (Suspected Malaria, RTI, UTI, Sepsis).',
                cognitiveLoad: 'Medium',
              },
            ],
          },
        ],
      },
      {
        stepNumber: '4',
        name: 'Testing',
        planDescription: 'Step 4: do 4.1 and/or 4.2',
        nodes: [
          {
            code: '4.1',
            name: 'Perform Rapid Diagnostic Test (RDT)',
            plan: 'Step 4.1: do if RDT is available',
            condition: 'Point-of-care RDT cassette available at nursing station',
            type: 'action',
            clinicalRationale: 'Perform finger-prick blood sampling for Pf-HRP2/pLDH malaria antigen detection (read at 15-20 mins).',
            cognitiveLoad: 'Low',
          },
          {
            code: '4.2',
            name: 'Fill lab request form',
            plan: 'Step 4.2: do 4.2.1 and/or 4.2.2',
            children: [
              { code: '4.2.1', name: 'Routine tests (FBC, Blood film, Urinalysis)', type: 'task', cognitiveLoad: 'Low' },
              { code: '4.2.2', name: 'Further tests (Blood culture, Widal, CSF if ordered)', type: 'task', cognitiveLoad: 'Medium' },
            ],
          },
        ],
      },
      {
        stepNumber: '5',
        name: 'Diagnosis',
        planDescription: 'Step 5: do 5.1 to 5.3',
        inputArtifacts: ['Laboratory results report', 'RDT cassette reading'],
        nodes: [
          {
            code: '5.1',
            name: 'Interpretation of lab and RDT results',
            type: 'task',
            clinicalRationale: 'Verify positive/negative control bands and review laboratory hematology/microbiology values.',
            cognitiveLoad: 'Low',
          },
          {
            code: '5.2',
            name: 'Cross check results against normal ranges',
            type: 'task',
            clinicalRationale: 'Identify severe anemia (Hb < 7 g/dL in children, < 8 g/dL in pregnancy), leukocytosis, hypoglycemia.',
            cognitiveLoad: 'Medium',
          },
          {
            code: '5.3',
            name: 'Confirmed Diagnosis',
            type: 'decision',
            clinicalRationale: 'Establish protocol-defined nursing diagnosis and determine disposition.',
            cognitiveLoad: 'Medium',
          },
        ],
      },
      {
        stepNumber: '6',
        name: 'Treatment Plan',
        planDescription: 'Step 6: do 6.1 or 6.2 or 6.3',
        isDecisionBranch: true,
        nodes: [
          {
            code: '6.1',
            name: 'In-patient treatment',
            plan: 'Step 6.1: do 6.1.1 and 6.1.2',
            condition: 'Patient admitted to observation ward',
            type: 'decision',
            children: [
              { code: '6.1.1', name: 'Fill admission form & nursing kardex', type: 'action', cognitiveLoad: 'Low' },
              { code: '6.1.2', name: 'Prescription (RX) / Administer standing orders', type: 'action', cognitiveLoad: 'Medium' },
            ],
          },
          {
            code: '6.2',
            name: 'Outpatient treatment',
            plan: 'Step 6.2: do 6.2.1',
            condition: 'Uncomplicated illness suitable for home management',
            type: 'decision',
            children: [
              { code: '6.2.1', name: 'Prescription (RX) & First dose directly observed (DOT)', type: 'action', cognitiveLoad: 'Low' },
            ],
          },
          {
            code: '6.3',
            name: 'Referral',
            plan: 'Step 6.3: do 6.3.1 and 6.3.2',
            condition: 'Red/Orange triage, danger signs, or beyond nursing standing orders',
            type: 'decision',
            children: [
              { code: '6.3.1', name: 'Identify referral facility', type: 'task', cognitiveLoad: 'Low' },
              { code: '6.3.2', name: 'Fill referral form & arrange safe transport', type: 'action', cognitiveLoad: 'Medium' },
            ],
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 3. HTA FOR COMMUNITY HEALTH NURSE (CHN)
  // =========================================================================
  chn: {
    role: 'Community Health Nurse',
    cadreKey: 'chn',
    title: 'HTA for CHN (Community Health Nurse)',
    goal: '0 : Diagnosing Febrile Illnesses',
    rootPlan: 'Step 0: do 1 only if case cannot be managed; do 1, 2, 3, 4 & 5 if case can be managed',
    contextSummary: 'Community outreach, home visits, and CHPS (Community-based Health Planning and Services) compound clinical delivery. Focuses heavily on rapid danger sign screening, pre-referral stabilization (rectal artesunate), point-of-care RDT testing, and community-level treatment vs urgent referral.',
    practiceSetting: 'CHPS Compounds, Community Outreach Zones, and Rural Health Posts',
    decisionAutonomy: 'Community Screening',
    keyDifferences: [
      'Step 0 Manageability filter: Triage immediately bifurcates into "Attend to cases that can be managed" vs "Refer patient for cases that cannot be managed".',
      'Focuses on device-available vitals and clinical signs without advanced laboratory infrastructure.',
      'Basic History taking streamlined into 5 essential domains (PC, HPC, PMHX, DHx, Travel).',
      'Step 4 Differential Diagnosis branches strictly into: 4.1 Rapid Diagnostic Test (RDT) vs 4.2 Identify red flags for referral.',
      'Treatment plan combines Symptomatic Treatment (5.1) and Specific Treatment (5.2) into a focused CHPS-level prescription (5.3).',
    ],
    branches: [
      {
        stepNumber: '1',
        name: 'Initial Patient Assessment',
        planDescription: 'Step 1: do 1.1 to 1.3.2 in order',
        nodes: [
          {
            code: '1.1',
            name: 'Take Vitals',
            plan: 'Step 1.1: do 1.1.1 to 1.1.5 based on availability of devices',
            children: [
              { code: '1.1.1', name: 'Measure and record temperature', type: 'task', cognitiveLoad: 'Low' },
              { code: '1.1.2', name: 'Measure and record blood pressure (if cuff available)', type: 'task', cognitiveLoad: 'Low' },
              { code: '1.1.3', name: 'Measure and record weight (Salter scale / infant scale)', type: 'task', cognitiveLoad: 'Low' },
              { code: '1.1.4', name: 'Measure and record pulse (Radial/apical count)', type: 'task', cognitiveLoad: 'Low' },
              { code: '1.1.5', name: 'Measure and record oxygen saturation (if handheld oximeter present)', type: 'task', cognitiveLoad: 'Low' },
            ],
          },
          {
            code: '1.2',
            name: 'Fever management',
            plan: 'Step 1.2: do if body temperature is above 37.8 degrees celsius',
            condition: 'Body temperature > 37.8°C',
            type: 'action',
            annotations: ['Tepid Sponging / antipyretics (Oral Paracetamol syrup/tablets)'],
            clinicalRationale: 'Teach mother/caregiver proper tepid sponging technique; avoid cold water shivering.',
            cognitiveLoad: 'Low',
          },
          {
            code: '1.3',
            name: 'Triage',
            plan: 'Step 1.3: do 1.3.1 or 1.3.2',
            isDecisionBranch: true,
            annotations: [
              'Red: Immediate danger signs',
              'Orange: Severe pain / High fever <10m',
              'Yellow: Moderate fever <60m',
              'Green: Mild / stable <240m',
              'Blue: Dead',
            ],
            children: [
              {
                code: '1.3.1',
                name: 'Attend to cases that can be managed',
                condition: 'Patient stable, alert, able to take oral fluids, no IMNCI general danger signs',
                type: 'action',
                clinicalRationale: 'Proceed to Step 2 for community-level diagnostic and therapeutic care.',
                cognitiveLoad: 'Low',
              },
              {
                code: '1.3.2',
                name: 'Refer patient for cases that cannot be managed',
                condition: 'Convulsions, vomiting everything, prostration, inability to drink, severe respiratory distress',
                type: 'action',
                clinicalRationale: 'Administer pre-referral Rectal Artesunate (100mg suppository <3 yrs, 200mg 3-5 yrs) and arrange emergency transport.',
                cognitiveLoad: 'High',
              },
            ],
          },
        ],
      },
      {
        stepNumber: '2',
        name: 'Basic History Taking',
        planDescription: 'Step 2: do 2.1 to 2.5',
        nodes: [
          { code: '2.1', name: 'Presenting Complain (PC)', type: 'task', cognitiveLoad: 'Low' },
          { code: '2.2', name: 'History of Presenting Complain (HPC)', type: 'task', cognitiveLoad: 'Low' },
          { code: '2.3', name: 'Past Medical History (PMHX)', type: 'task', cognitiveLoad: 'Low' },
          { code: '2.4', name: 'Drug History (DHx)', type: 'task', cognitiveLoad: 'Low' },
          { code: '2.5', name: 'Travel History', type: 'task', cognitiveLoad: 'Low' },
        ],
      },
      {
        stepNumber: '3',
        name: 'Physical Examination',
        planDescription: 'Step 3: do 3.1 to 3.2.6',
        nodes: [
          {
            code: '3.1',
            name: 'General Condition (G/C)',
            plan: 'Step 3.1: do 3.1.1 to 3.1.4',
            children: [
              { code: '3.1.1', name: 'Appearance (Alert, playful vs Dull, lethargic)', type: 'task', cognitiveLoad: 'Low' },
              { code: '3.1.2', name: 'Level of Consciousness (AVPU scale)', type: 'task', cognitiveLoad: 'Medium' },
              { code: '3.1.3', name: 'Mobility (Sitting unsupported vs Limp/prostrated)', type: 'task', cognitiveLoad: 'Low' },
              { code: '3.1.4', name: 'Mood and affect (Consolable vs Inconsolable crying)', type: 'task', cognitiveLoad: 'Low' },
            ],
          },
          {
            code: '3.2',
            name: 'On Examination (O/E)',
            plan: 'Step 3.2: do 3.2.1 to 3.2.6 based on outcome of step 2',
            children: [
              { code: '3.2.1', name: 'Head and neck examination (Fontanelle tension, neck stiffness)', type: 'task', cognitiveLoad: 'Low' },
              { code: '3.2.2', name: 'Chest examination (Count breaths in 60s, look for chest indrawing)', type: 'task', cognitiveLoad: 'Medium' },
              { code: '3.2.3', name: 'Abdominal examination (Abdominal softness, distension, pain)', type: 'task', cognitiveLoad: 'Low' },
              { code: '3.2.4', name: 'Cardiovascular examination (Palpate peripheral pulse, check warmth)', type: 'task', cognitiveLoad: 'Low' },
              { code: '3.2.5', name: 'Musculoskeletal examination (MUAC tape measurement, pedal edema)', type: 'task', cognitiveLoad: 'Low' },
              { code: '3.2.6', name: 'Neurological examination (Suck reflex, limb tone, spasms)', type: 'task', cognitiveLoad: 'Low' },
            ],
          },
        ],
      },
      {
        stepNumber: '4',
        name: 'Differential Diagnosis & Referral',
        planDescription: 'Step 4: do 4.1 or 4.2',
        isDecisionBranch: true,
        nodes: [
          {
            code: '4.1',
            name: 'Rapid Diagnostic Test (RDT)',
            plan: 'Step 4.1: do 4.1.1 and 4.1.2',
            children: [
              { code: '4.1.1', name: 'Interpretation RDT results (Pf-HRP2 positive/negative)', type: 'task', cognitiveLoad: 'Low' },
              { code: '4.1.2', name: 'Confirmed Diagnosis (Uncomplicated Malaria vs Non-malarial fever)', type: 'decision', cognitiveLoad: 'Medium' },
            ],
          },
          {
            code: '4.2',
            name: 'Identify red flags for referral',
            plan: 'Step 4.2: do 4.2.1 and 4.2.2',
            children: [
              { code: '4.2.1', name: 'Identify referral facility (Nearest Health Centre / District Hospital)', type: 'task', cognitiveLoad: 'Low' },
              { code: '4.2.2', name: 'Fill referral form & initiate GHS referral protocol', type: 'action', cognitiveLoad: 'Medium' },
            ],
          },
        ],
      },
      {
        stepNumber: '5',
        name: 'Treatment Plan',
        planDescription: 'Step 5: do 5.1 and/or 5.2 and 5.3',
        nodes: [
          {
            code: '5.1',
            name: 'Symptomatic treatment',
            type: 'action',
            clinicalRationale: 'Paracetamol syrup/tablets for fever relief, oral rehydration salts (ORS) for hydration.',
            cognitiveLoad: 'Low',
          },
          {
            code: '5.2',
            name: 'Specific treatment',
            type: 'action',
            clinicalRationale: 'Weight-based oral Artemether-Lumefantrine (AL) or Artesunate-Amodiaquine (AA) for confirmed malaria; Amoxicillin dispersible for fast-breathing pneumonia.',
            cognitiveLoad: 'Medium',
          },
          {
            code: '5.3',
            name: 'Prescription & DOT Dispensing',
            type: 'action',
            clinicalRationale: 'Administer dose 1 under observation; counsel mother on completing full 3-day course.',
            cognitiveLoad: 'Low',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 4. HTA FOR PHARMACIST
  // =========================================================================
  pharmacist: {
    role: 'Pharmacist',
    cadreKey: 'pharmacist',
    title: 'HTA for Pharmacist',
    goal: '0 : Diagnosing Febrile Illnesses',
    rootPlan: 'Step 0: do 1, 2, 3, 4 & 5 if case can be managed',
    contextSummary: 'Community and hospital pharmacy settings. Focuses on patient assessment, history & device-based vitals, rapid point-of-care RDT testing, red-flag screening for medical referral, rational dispensing of OTC antipyretics and prescription ACTs, comprehensive patient counseling, and follow-up advice.',
    practiceSetting: 'Community Pharmacies and Hospital Outpatient Dispensaries',
    decisionAutonomy: 'Medication Therapy Expert',
    keyDifferences: [
      'Executes Step 0 manageability check to identify walk-in patients safe for pharmacy management vs immediate referral.',
      'Step 1 combines targeted History Taking with device-based vitals (Temp, BP, Pulse/RR).',
      'Step 2 Differential Diagnosis & Referral uses RDT testing when available to confirm malaria vs red-flag screening.',
      'Step 3 Treatment & Medication Recommendation specifies Symptomatic (3.1) and Specific RDT-grounded treatment (3.2) leading to Prescription/Dispensing (3.3).',
      'Step 4 is dedicated to Patient Counseling: 4.1 Explain cause of fever, 4.2 Educate on medication use, 4.3 Preventive measures (LLIN nets).',
      'Step 5 enforces proactive Follow-up advice (return if fever persists >48-72h).',
    ],
    branches: [
      {
        stepNumber: '1',
        name: 'Patient Assessment',
        planDescription: 'Step 1: do 1.1 and 1.2',
        nodes: [
          {
            code: '1.1',
            name: 'History Taking',
            plan: 'Step 1.1: do 1.1.1 and 1.1.2',
            children: [
              { code: '1.1.1', name: 'Presenting Complain (PC)', type: 'task', cognitiveLoad: 'Low' },
              { code: '1.1.2', name: 'History of presenting Complain (HPC)', type: 'task', cognitiveLoad: 'Low' },
              {
                code: '1.2_pmhx',
                name: 'Past Medical History (PMHX)',
                type: 'task',
                children: [
                  { code: '1.2.1', name: 'Drug History (DHx)', type: 'task', clinicalRationale: 'Prior medications taken in last 14 days; check drug-drug interactions.', cognitiveLoad: 'Medium' },
                  { code: '1.2.2', name: 'Travel History', type: 'task', clinicalRationale: 'Travel to high malaria endemic zones.', cognitiveLoad: 'Low' },
                  { code: '1.2.3', name: 'Allergies', type: 'task', clinicalRationale: 'Screen for Sulfa / NSAID / Penicillin / Artemisinin hypersensitivity.', cognitiveLoad: 'Low' },
                  { code: '1.2.4', name: 'Chronic Conditions', type: 'task', clinicalRationale: 'Hypertension, Diabetes, Renal/Hepatic impairment, G6PD deficiency, Pregnancy.', cognitiveLoad: 'Medium' },
                ],
              },
            ],
          },
          {
            code: '1.2',
            name: 'Measuring vitals',
            plan: 'Step 1.2: do 1.2.1 to 1.2.3 based on availability of devices',
            children: [
              { code: '1.2.1', name: 'Measure Temperature (Digital / Infrared thermometer)', type: 'task', cognitiveLoad: 'Low' },
              { code: '1.2.2', name: 'Measure blood pressure (Automated / Manual cuff)', type: 'task', cognitiveLoad: 'Low' },
              { code: '1.2.3', name: 'Measure pulse and respiration rate', type: 'task', cognitiveLoad: 'Low' },
            ],
          },
        ],
      },
      {
        stepNumber: '2',
        name: 'Differential Diagnosis & Referral',
        planDescription: 'Step 2: do 2.1 or 2.2',
        isDecisionBranch: true,
        nodes: [
          {
            code: '2.1',
            name: 'Identify possible causes of fever',
            plan: 'Step 2.1: do 2.1.1 to 2.1.3 if RDT is available',
            children: [
              { code: '2.1.1', name: 'Perform rapid diagnostic tests (RDT)', type: 'action', clinicalRationale: 'Conduct mRDT in private pharmacy consultation booth.', cognitiveLoad: 'Low' },
              { code: '2.1.2', name: 'Interpret test result on RDT', type: 'task', clinicalRationale: 'Read line intensity at 15 minutes; check control band validity.', cognitiveLoad: 'Low' },
              { code: '2.1.3', name: 'Confirm diagnosis', type: 'decision', clinicalRationale: 'Uncomplicated malaria vs Non-malarial viral/bacterial febrile syndrome.', cognitiveLoad: 'Medium' },
            ],
          },
          {
            code: '2.2',
            name: 'Identify red flags for referral',
            plan: 'Step 2.2: do 2.2.1 to 2.2.2',
            condition: 'Presence of red flags: persistent vomiting, jaundice, dark urine, severe breathlessness, altered mentation, pregnancy 1st trimester',
            type: 'decision',
            children: [
              { code: '2.2.1', name: 'Identify referral facility (Nearest Hospital/Clinic)', type: 'task', cognitiveLoad: 'Low' },
              { code: '2.2.2', name: 'Refer patient (Provide written referral note and advice)', type: 'action', cognitiveLoad: 'Medium' },
            ],
          },
        ],
      },
      {
        stepNumber: '3',
        name: 'Treatment & Medication recommendation',
        planDescription: 'Step 3: do 3.1 and/or 3.2',
        nodes: [
          {
            code: '3.1',
            name: 'Symptomatic treatment',
            type: 'action',
            clinicalRationale: 'Recommend Paracetamol (10-15 mg/kg Q6H) or Ibuprofen (if child >6mo and well hydrated). Avoid NSAIDs if dengue/viral fever suspected.',
            cognitiveLoad: 'Low',
          },
          {
            code: '3.2',
            name: 'Specific treatment RDT test result',
            type: 'action',
            clinicalRationale: 'If RDT Positive: Dispense first-line Artemisinin Combination Therapy (Artemether-Lumefantrine or Artesunate-Amodiaquine) based on weight tier.',
            cognitiveLoad: 'Medium',
          },
          {
            code: '3.3',
            name: 'Prescription & Dispensing',
            type: 'action',
            clinicalRationale: 'Package medications with clear dosage labels, auxiliary warnings (take AL with fatty food/milk), and verify patient comprehension.',
            cognitiveLoad: 'Medium',
          },
        ],
      },
      {
        stepNumber: '4',
        name: 'Patient Counseling',
        planDescription: 'Step 4: do 4.1 to 4.3',
        nodes: [
          {
            code: '4.1',
            name: 'Explain cause of fever',
            type: 'task',
            clinicalRationale: 'Educate patient that fever is a physiologic immune response; explain test results clearly.',
            cognitiveLoad: 'Low',
          },
          {
            code: '4.2',
            name: 'Educate on medication use',
            type: 'task',
            clinicalRationale: 'Emphasize completing full 3-day antimalarial course even if feeling better; explain what to do if vomiting occurs within 30 minutes.',
            cognitiveLoad: 'Medium',
          },
          {
            code: '4.3',
            name: 'Preventive measures',
            type: 'task',
            clinicalRationale: 'Counsel on sleeping under Long-Lasting Insecticidal Nets (LLINs), indoor residual spraying, and eliminating standing water.',
            cognitiveLoad: 'Low',
          },
        ],
      },
      {
        stepNumber: '5',
        name: 'Follow up',
        planDescription: 'Step 5: do 5.1',
        nodes: [
          {
            code: '5.1',
            name: 'Offer follow up advice',
            type: 'action',
            clinicalRationale: 'Instruct patient to return to pharmacy or report to hospital immediately if fever persists beyond 3 days, worsens, or danger signs develop.',
            cognitiveLoad: 'Low',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 5. HTA FOR PHYSICIAN ASSISTANT (PA)
  // =========================================================================
  physician_assistant: {
    role: 'Physician Assistant',
    cadreKey: 'physician_assistant',
    title: 'HTA for Physician Assistant',
    goal: '0 : Diagnosing Febrile Illnesses',
    rootPlan: 'Step 0: do 1, 2, 3, 4, & 5 in order (Primary Health Centre Lead)',
    contextSummary: 'Primary clinical lead at Sub-district Health Centres and Polyclinics in Ghana. Exercises high clinical autonomy in diagnosing, managing, and prescribing according to Ghana STG level C/B facilities, with seamless referral links to District Hospitals.',
    practiceSetting: 'Sub-district Health Centres, Polyclinics, and District Hospital OPDs',
    decisionAutonomy: 'Primary Clinical Provider',
    keyDifferences: [
      'Executes full diagnostic consultation similar to medical officer with special focus on Primary Health Centre resource availability.',
      'Performs syndromic differential diagnosis using available point-of-care RDTs, basic microscopy, and urine dipstick.',
      'Initiates initial parenteral therapy (IV Artesunate) for severe cases prior to ambulance referral.',
      'Manages uncomplicated admissions at Health Centre observation wards and outpatient prescription.',
    ],
    branches: [
      {
        stepNumber: '1',
        name: 'History Taking',
        planDescription: 'Step 1: do 1.1, 1.2, 1.3',
        inputArtifacts: ['Nursing Triage vital signs and age profile'],
        nodes: [
          {
            code: '1.1',
            name: 'Presenting Complain & HPC',
            type: 'task',
            clinicalRationale: 'Document fever duration, pattern, chills, headache, nausea, and vomiting.',
            cognitiveLoad: 'Medium',
          },
          {
            code: '1.2',
            name: 'On Direct Questioning (ODQ)',
            type: 'task',
            clinicalRationale: 'Focused systemic review: respiratory, gastrointestinal, urinary, central nervous system.',
            cognitiveLoad: 'Medium',
          },
          {
            code: '1.3',
            name: 'Past Medical & Medication History',
            type: 'task',
            clinicalRationale: 'Screen for previous antimalarials, drug allergies, sickle cell disease, and pregnancy status.',
            cognitiveLoad: 'Low',
          },
        ],
      },
      {
        stepNumber: '2',
        name: 'Physical Examination',
        planDescription: 'Step 2: do 2.1 to 2.3',
        nodes: [
          { code: '2.1', name: 'General Condition (Consciousness, pallor, jaundice, hydration)', type: 'task', cognitiveLoad: 'Medium' },
          { code: '2.2', name: 'Systemic Examination (ENT, Chest, Abdomen, CNS, Signs of meningism)', type: 'task', cognitiveLoad: 'Medium' },
          { code: '2.3', name: 'Diagnostic Impression & Differential Ranking', type: 'decision', cognitiveLoad: 'High' },
        ],
      },
      {
        stepNumber: '3',
        name: 'Laboratory Investigations',
        planDescription: 'Step 3: do 3.1 & 3.2',
        nodes: [
          { code: '3.1', name: 'Point-of-care Malaria RDT / Health Centre Microscopy', type: 'action', cognitiveLoad: 'Low' },
          { code: '3.2', name: 'Urine Dipstick, Blood Glucose & Hemoglobin estimation (Hemocue)', type: 'task', cognitiveLoad: 'Low' },
        ],
      },
      {
        stepNumber: '4',
        name: 'Diagnosis & Severity Classification',
        planDescription: 'Step 4: do 4.1 to 4.2',
        inputArtifacts: ['POC RDT and laboratory results'],
        nodes: [
          { code: '4.1', name: 'Correlate clinical presentation with test results', type: 'task', cognitiveLoad: 'Medium' },
          { code: '4.2', name: 'Classify as Uncomplicated Febrile Illness vs Severe / Complicated Illness', type: 'decision', cognitiveLoad: 'High' },
        ],
      },
      {
        stepNumber: '5',
        name: 'Treatment & Disposition Plan',
        planDescription: 'Step 5: decide on 5.1, 5.2 or 5.3',
        isDecisionBranch: true,
        nodes: [
          { code: '5.1', name: 'Outpatient Management: First-line oral ACT + Antipyretic', type: 'action', cognitiveLoad: 'Low' },
          { code: '5.2', name: 'Health Centre Observation Ward: Short-term IV fluids & monitoring', type: 'action', cognitiveLoad: 'Medium' },
          { code: '5.3', name: 'Severe Case Pre-referral: Give IV Artesunate (1st dose) + Emergency Referral', type: 'decision', cognitiveLoad: 'High' },
        ],
      },
    ],
  },
};

/**
 * Cross-Cadre Comparative Analysis Matrix
 * Highlights differences in clinical scope, triage responsibility, lab investigation depth, 
 * decision autonomy, and disposition pathways.
 */
export const HTA_CADRE_COMPARISON_MATRIX = [
  {
    dimension: 'Starting Trigger / Step 0',
    doctor: 'Step 0: do 1,2,3,4,5 in order (assumes triage vitals pre-recorded)',
    generalNurse: 'Step 0: Step 1 only if Dr/PA available; do 1-6 if Dr/PA unavailable',
    chn: 'Step 0: Step 1 only if cannot manage; do 1-5 if can manage',
    pharmacist: 'Step 0: do 1-5 if case can be managed at community pharmacy',
    physicianAssistant: 'Step 0: do 1-5 in order (Primary clinical provider at Health Centre)',
  },
  {
    dimension: 'Initial Triage & Vitals',
    doctor: 'Reviews presented vitals; rechecks only if unstable or deteriorating',
    generalNurse: 'Mandatory primary vitals, tepid sponging >37.8°C, 5-color triage (Red/Orange/Yellow/Green/Blue)',
    chn: 'Takes vitals based on device availability, tepid sponging >37.8°C, binary triage (Manage vs Refer)',
    pharmacist: 'Measures vitals (Temp, BP, Pulse/RR) in pharmacy consultation booth',
    physicianAssistant: 'Reviews nursing vitals, calculates shock index, reassesses high-risk vitals',
  },
  {
    dimension: 'History Taking Depth',
    doctor: 'Full 6-domain PMHX (DHx, SHx, FHx, Travel, Chronic, Allergies) + ODQ',
    generalNurse: '5-domain PMHX + focused symptom questioning (ODQ)',
    chn: 'Streamlined basic history (PC, HPC, PMHX, DHx, Travel)',
    pharmacist: 'Medication-focused history (DHx, Travel, Allergies, Chronic conditions)',
    physicianAssistant: 'Targeted clinical history with syndromic review of systems',
  },
  {
    dimension: 'Physical Examination',
    doctor: 'Comprehensive 6-system exam (Head/Neck, Chest, Abdomen, CVS, MSK, CNS)',
    generalNurse: 'Targeted 6-system exam based on history findings',
    chn: 'Basic physical assessment (MUAC, fontanelle, chest indrawing, signs of dehydration)',
    pharmacist: 'Visual inspection for severe danger signs / jaundice / dehydration',
    physicianAssistant: 'Focused organ-system exam & signs of meningism / respiratory distress',
  },
  {
    dimension: 'Diagnostic Testing',
    doctor: 'Two-tier: Routine (RDT/BF, FBC, Urinalysis) + Further (Cultures, LP, CXR, LFT/RFT)',
    generalNurse: 'Point-of-care RDT + Lab request forms for routine/further tests',
    chn: 'Finger-prick Malaria RDT only; no advanced lab facilities',
    pharmacist: 'Point-of-care Malaria RDT performed in pharmacy',
    physicianAssistant: 'Malaria RDT / microscopy + Urine dipstick + Blood glucose + Hemocue Hb',
  },
  {
    dimension: 'Treatment & Disposition',
    doctor: 'Tri-modal: In-patient admission, Outpatient prescription, Specialist referral',
    generalNurse: 'In-patient ward care, Outpatient prescription with DOT, or Referral to Dr/PA',
    chn: 'Symptomatic + Specific ACT dispensing (DOT) or Pre-referral Rectal Artesunate + transport',
    pharmacist: 'OTC symptomatic recommendation + Weight-based ACT dispensing + Mandatory counseling',
    physicianAssistant: 'Outpatient ACT, HC Observation ward admission, or Pre-referral IV Artesunate + Transfer',
  },
  {
    dimension: 'Counseling & Follow-up',
    doctor: 'Discharge instructions, red flag education, scheduled review clinic',
    generalNurse: 'Medication adherence counseling, first-dose DOT observation',
    chn: 'Community caregiver education, LLIN bednet counseling, home visit follow-up',
    pharmacist: 'Explicit Step 4 Counseling (fever cause, medication use, prevention) + Step 5 Follow-up advice',
    physicianAssistant: 'Caregiver counseling on completing 3-day ACT course, fever recurrence warning',
  },
];
