import React from 'react';
import { CadreRole, DshcConsultationStep } from '../types';
import { 
  UserPlus, 
  Activity, 
  ClipboardList, 
  MessageSquare, 
  FileText, 
  Brain, 
  Stethoscope, 
  FlaskConical, 
  Microchip, 
  Pill, 
  Ambulance, 
  GitBranch,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export interface CadreStepItem {
  id: DshcConsultationStep;
  stepNumber: string;
  label: string;
  shortLabel: string;
  subtitle: string;
  icon: React.ElementType;
}

export interface CadreRoleWorkflow {
  role: CadreRole;
  trackName: string;
  badgeLabel: string;
  trackBadgeColor: string;
  trackDescription: string;
  assistanceLevelTitle: string;
  assistanceType: 'technical' | 'simplified' | 'nursing' | 'pharmacological' | 'primaryCare';
  cognitivePillText: string;
  assistanceSummary: string;
  visibleSteps: DshcConsultationStep[];
  stepDetails: Record<DshcConsultationStep, {
    stepNumber: string;
    label: string;
    shortLabel: string;
    subtitle: string;
    icon: React.ElementType;
  }>;
  technicalAssistance: {
    guidanceHeading: string;
    diagnosticAssistance: string;
    treatmentAssistance: string;
    dangerSignApproach: string;
    counselingApproach: string;
    clinicalPearls: string[];
  };
}

export const ALL_CONSULTATION_STEPS_MASTER: Record<DshcConsultationStep, {
  defaultStepNumber: string;
  label: string;
  shortLabel: string;
  subtitle: string;
  icon: React.ElementType;
}> = {
  patientData: {
    defaultStepNumber: '1',
    label: 'Patient Info',
    shortLabel: 'Info',
    subtitle: 'Demographics, weight & NHIS',
    icon: UserPlus,
  },
  vitals: {
    defaultStepNumber: '2',
    label: 'Vitals & Triage',
    shortLabel: 'Vitals',
    subtitle: 'Triage, temp & danger signs',
    icon: Activity,
  },
  planOfCare: {
    defaultStepNumber: '3',
    label: 'Plan of Care',
    shortLabel: 'Care Plan',
    subtitle: 'Immediate pathway & triage care',
    icon: ClipboardList,
  },
  counselling: {
    defaultStepNumber: '3a',
    label: 'Counselling',
    shortLabel: 'Counsel',
    subtitle: 'Caregiver advice & local languages',
    icon: MessageSquare,
  },
  history: {
    defaultStepNumber: '4',
    label: 'History Taking',
    shortLabel: 'History',
    subtitle: 'Onset, symptoms & prior meds',
    icon: FileText,
  },
  symptoms: {
    defaultStepNumber: '4a',
    label: 'Review of Systems',
    shortLabel: 'ROS',
    subtitle: 'Systemic symptom checklist',
    icon: Brain,
  },
  examination: {
    defaultStepNumber: '5',
    label: 'Examination',
    shortLabel: 'Exam',
    subtitle: 'Physical & neurological signs',
    icon: Stethoscope,
  },
  diagnosis: {
    defaultStepNumber: '6',
    label: 'Differential DX',
    shortLabel: 'DX',
    subtitle: 'Probabilistic reasoning & staging',
    icon: GitBranch,
  },
  testing: {
    defaultStepNumber: '7',
    label: 'Testing Device',
    shortLabel: 'Testing',
    subtitle: 'POC rapid tests & lab orders',
    icon: FlaskConical,
  },
  testResults: {
    defaultStepNumber: '8',
    label: 'Test Results',
    shortLabel: 'Results',
    subtitle: 'Parasitology & lab data entry',
    icon: Microchip,
  },
  treatmentplan: {
    defaultStepNumber: '9',
    label: 'Treatment Plan',
    shortLabel: 'Treatment',
    subtitle: 'Prescription, dosing & regimens',
    icon: Pill,
  },
  referral: {
    defaultStepNumber: '10',
    label: 'Referral Form',
    shortLabel: 'Referral',
    subtitle: 'GHS transfer documentation',
    icon: Ambulance,
  },
};

export const CADRE_WORKFLOWS: Record<CadreRole, CadreRoleWorkflow> = {
  'Doctor': {
    role: 'Doctor',
    trackName: 'Specialist Diagnostic & Inpatient Track',
    badgeLabel: 'Doctor Track',
    trackBadgeColor: 'bg-emerald-600 text-white',
    trackDescription: 'Comprehensive 10-stage diagnostic track with advanced laboratory workup, complex pathophysiology, differential ranking, and parenteral/inpatient regimens.',
    assistanceLevelTitle: 'Technical & Pathophysiological Assistance',
    assistanceType: 'technical',
    cognitivePillText: 'Deep Pathophysiology & Evidence-Based Logic',
    assistanceSummary: 'Detailed pathophysiological rationale, WHO severe malaria criteria (parasitemia >100k/μL, base deficit >8, Blantyre score ≤2), antimicrobial resistance markers, and pharmacokinetic dosing formulas.',
    visibleSteps: [
      'patientData',
      'vitals',
      'history',
      'symptoms',
      'examination',
      'diagnosis',
      'testing',
      'testResults',
      'treatmentplan',
      'referral',
    ],
    stepDetails: {
      patientData: { stepNumber: '1', label: 'Patient Profile', shortLabel: 'Profile', subtitle: 'Identifiers, comorbidities & baseline', icon: UserPlus },
      vitals: { stepNumber: '2', label: 'Vitals & Hemodynamics', shortLabel: 'Vitals', subtitle: 'Early warning, shock index & SpO2', icon: Activity },
      history: { stepNumber: '3', label: 'Comprehensive History', shortLabel: 'History', subtitle: 'Detailed clinical timeline & pharmacology', icon: FileText },
      symptoms: { stepNumber: '4', label: 'Review of Systems', shortLabel: 'ROS', subtitle: 'Multi-organ system symptom inquiry', icon: Brain },
      examination: { stepNumber: '5', label: 'Physical Examination', shortLabel: 'Exam', subtitle: 'Meningeal, respiratory & abdominal signs', icon: Stethoscope },
      diagnosis: { stepNumber: '6', label: 'Differential DX', shortLabel: 'Diff DX', subtitle: 'Ranked probabilistic etiologies & ICD codes', icon: GitBranch },
      testing: { stepNumber: '7', label: 'Diagnostic Orders', shortLabel: 'Labs', subtitle: 'FBC, Blood Film, LP, Cultures & X-Ray', icon: FlaskConical },
      testResults: { stepNumber: '8', label: 'Lab Interpretation', shortLabel: 'Results', subtitle: 'Parasite density, Hb & CSF analysis', icon: Microchip },
      treatmentplan: { stepNumber: '9', label: 'Inpatient / Rx Plan', shortLabel: 'Rx Plan', subtitle: 'Parenteral loading, ACT & ICU criteria', icon: Pill },
      referral: { stepNumber: '10', label: 'Tertiary Transfer', shortLabel: 'Referral', subtitle: 'Specialist ICU & tertiary handoff', icon: Ambulance },
      planOfCare: { stepNumber: 'Alt', label: 'Plan of Care', shortLabel: 'Care', subtitle: 'Clinical pathway', icon: ClipboardList },
      counselling: { stepNumber: 'Alt', label: 'Counselling', shortLabel: 'Counsel', subtitle: 'Patient education', icon: MessageSquare },
    },
    technicalAssistance: {
      guidanceHeading: 'Medical Officer Clinical Guidance & Pathophysiology',
      diagnosticAssistance: 'Differential diagnosis engine calculates Bayesian probability weights across P. falciparum hyperparasitemia, Acute Bacterial Meningitis, Severe Sepsis, and Enteric Fever. Flags cognitive biases including Anchoring Bias on Malaria and premature closure.',
      treatmentAssistance: 'Calculates exact weight-adjusted IV Artesunate loading (2.4 mg/kg reconstituted in 5% NaHCO3 at 0h, 12h, 24h then OD) with switch to oral ACT upon tolerance. High-dose IV Ceftriaxone 100 mg/kg/day in suspected meningitis.',
      dangerSignApproach: 'Quantifies physiological markers: Blantyre/Glasgow Coma score, lactic acidosis compensation (Kussmaul breathing), severe anemia (Hb < 5 g/dL), and hypoglycemia threshold (< 2.2 mmol/L in adults, < 3.0 mmol/L in pediatrics).',
      counselingApproach: 'Focus on disease prognosis, inpatient admission rationale, risk of recrudescence, and follow-up lab monitoring schedule.',
      clinicalPearls: [
        'WHO Severe Malaria criteria: Impaired consciousness (BCS ≤ 2 in children), multiple convulsions (>2 in 24h), severe anemia (Hb < 5 g/dL), pulmonary edema, hypoglycemia (< 3.0 mmol/L), or hyperparasitemia (> 10% or > 200,000/μL).',
        'In malaria endemic zones, always check G6PD status before prescribing 8-aminoquinolines (Primaquine).',
        'Co-administration of Artemether-Lumefantrine with CYP3A4 inducers (e.g., Rifampicin, Carbamazepine) drastically reduces lumefantrine AUC by >80%, risking recrudescence.',
      ],
    },
  },

  'Community Health Nurse': {
    role: 'Community Health Nurse',
    trackName: 'Frontline CHPS Simplified Track',
    badgeLabel: 'CHN Frontline',
    trackBadgeColor: 'bg-amber-500 text-amber-950',
    trackDescription: 'Curated 8-stage frontline workflow tailored for CHPS Compounds and community outreach: rapid IMNCI danger sign screening, point-of-care mRDT, color-band ACT dosing, and local language counseling.',
    assistanceLevelTitle: 'Basic & Simplified Step-by-Step Assistance',
    assistanceType: 'simplified',
    cognitivePillText: 'Visual Protocols & Local Language Guidance',
    assistanceSummary: 'Traffic-light color triage (Pink: Refer Urgently; Yellow: Treat Malaria at CHPS; Green: Home Care), color-band ACT packaging charts, pre-referral rectal artesunate charts, and caregiver counseling in Twi, Ga, Ewe, and Dagbani.',
    visibleSteps: [
      'patientData',
      'vitals',
      'history',
      'testing',
      'testResults',
      'treatmentplan',
      'counselling',
      'referral',
    ],
    stepDetails: {
      patientData: { stepNumber: '1', label: 'Patient Info', shortLabel: 'Info', subtitle: 'Name, age, weight & community', icon: UserPlus },
      vitals: { stepNumber: '2', label: 'Danger Signs & Vitals', shortLabel: 'Vitals', subtitle: 'IMNCI traffic-light triage', icon: Activity },
      history: { stepNumber: '3', label: 'Basic History', shortLabel: 'History', subtitle: 'Fever days & danger questions', icon: FileText },
      testing: { stepNumber: '4', label: 'Malaria RDT', shortLabel: 'mRDT', subtitle: 'Fingerprick mRDT & glucose check', icon: FlaskConical },
      testResults: { stepNumber: '5', label: 'Test Results', shortLabel: 'Results', subtitle: 'mRDT Pf strip reading & log', icon: Microchip },
      treatmentplan: { stepNumber: '6', label: 'Color Pack Treatment', shortLabel: 'Treatment', subtitle: 'Yellow/Blue/Brown/Green ACT packs', icon: Pill },
      counselling: { stepNumber: '7', label: 'Caregiver Advice', shortLabel: 'Counsel', subtitle: 'Twi, Ga, Ewe & Dagbani guidance', icon: MessageSquare },
      referral: { stepNumber: '8', label: 'Emergency Referral', shortLabel: 'Referral', subtitle: 'Rectal artesunate & transport slip', icon: Ambulance },
      planOfCare: { stepNumber: 'Alt', label: 'Plan of Care', shortLabel: 'Care', subtitle: 'Care plan', icon: ClipboardList },
      symptoms: { stepNumber: 'Alt', label: 'Review of Systems', shortLabel: 'ROS', subtitle: 'Symptoms', icon: Brain },
      examination: { stepNumber: 'Alt', label: 'Examination', shortLabel: 'Exam', subtitle: 'Physical exam', icon: Stethoscope },
      diagnosis: { stepNumber: 'Alt', label: 'Differential DX', shortLabel: 'DX', subtitle: 'Diagnosis', icon: GitBranch },
    },
    technicalAssistance: {
      guidanceHeading: 'CHN Frontline Decision Support & Protocols',
      diagnosticAssistance: 'Simplified 3-level IMNCI Classification: PINK (Danger sign present → Give pre-referral rectal artesunate and transfer immediately), YELLOW (mRDT Positive → Treat with oral ACT pack), GREEN (mRDT Negative → Supportive care or refer if unwell).',
      treatmentAssistance: 'Visual color-coded ACT blister packs: Yellow Pack (5-14kg, 1 tab BD), Blue Pack (15-24kg, 2 tabs BD), Brown Pack (25-34kg, 3 tabs BD), Green Pack (≥35kg, 4 tabs BD). Directly Observed Therapy (DOT) for Dose 1.',
      dangerSignApproach: 'Everyday Danger Signs: 1. Body very hot (>38.5°C), 2. Fits/Convulsions (Gyan-gyan), 3. Child cannot breastfeed or drink, 4. Child vomits everything, 5. Child is floppy/unresponsive.',
      counselingApproach: 'Plain-language mother counseling scripts in Ghanaian local languages (Twi, Ga, Ewe, Dagbani). Emphasize taking medicine with peanut soup or breastmilk, and repeating dose if vomited within 30 minutes.',
      clinicalPearls: [
        'Pre-referral Rectal Artesunate (100mg suppository): Give 1 capsule if <10 kg (<3 yrs); 2 capsules if 10-19 kg (3-5 yrs); 4 capsules if 20-39 kg (6-12 yrs).',
        'Never delay referral for severe febrile illness; administer rectal artesunate and arrange community emergency transport immediately.',
        'Always instruct the caregiver to finish all 6 doses in 3 days, even if fever goes away on Day 2.',
      ],
    },
  },

  'General Nurse': {
    role: 'General Nurse',
    trackName: 'Clinical Nursing & Triage Track',
    badgeLabel: 'Nurse Track',
    trackBadgeColor: 'bg-cyan-600 text-white',
    trackDescription: '9-stage clinical nursing workflow: 5-tier triage classification, vital signs monitoring, tepid sponging protocol, rapid diagnostic testing, nursing medication administration, and pre-referral stabilization.',
    assistanceLevelTitle: 'Action-Oriented Nursing & Triage Assistance',
    assistanceType: 'nursing',
    cognitivePillText: 'Triage Scoring & Nursing Procedures',
    assistanceSummary: 'Urgency categorization (Red: Resuscitation/Physician Alert; Yellow: Priority Fever Care; Green: Queue), step-by-step tepid sponging instructions, fluid balance charts, and medication administration records (MAR/Kardex).',
    visibleSteps: [
      'patientData',
      'vitals',
      'planOfCare',
      'history',
      'testing',
      'testResults',
      'treatmentplan',
      'counselling',
      'referral',
    ],
    stepDetails: {
      patientData: { stepNumber: '1', label: 'Patient Triage Intake', shortLabel: 'Intake', subtitle: 'Arrival time & vital registration', icon: UserPlus },
      vitals: { stepNumber: '2', label: 'Vitals & Triage Score', shortLabel: 'Vitals', subtitle: 'Red/Yellow/Green triage urgency', icon: Activity },
      planOfCare: { stepNumber: '3', label: 'Nursing Care Plan', shortLabel: 'Care Plan', subtitle: 'Tepid sponge, hydration & fever care', icon: ClipboardList },
      history: { stepNumber: '4', label: 'Clinical History', shortLabel: 'History', subtitle: 'Symptom onset & past admissions', icon: FileText },
      testing: { stepNumber: '5', label: 'POC Tests & Draws', shortLabel: 'Testing', subtitle: 'mRDT, Glucometer & blood samples', icon: FlaskConical },
      testResults: { stepNumber: '6', label: 'Test Entry', shortLabel: 'Results', subtitle: 'Point-of-care log & validation', icon: Microchip },
      treatmentplan: { stepNumber: '7', label: 'Med Administration', shortLabel: 'Med Admin', subtitle: 'DOT administration & timing record', icon: Pill },
      counselling: { stepNumber: '8', label: 'Health Education', shortLabel: 'Counsel', subtitle: 'Family hygiene & ITN guidance', icon: MessageSquare },
      referral: { stepNumber: '9', label: 'Transfer Prep', shortLabel: 'Transfer', subtitle: 'IV line, oxygen & handover note', icon: Ambulance },
      symptoms: { stepNumber: 'Alt', label: 'Review of Systems', shortLabel: 'ROS', subtitle: 'Symptoms', icon: Brain },
      examination: { stepNumber: 'Alt', label: 'Examination', shortLabel: 'Exam', subtitle: 'Physical exam', icon: Stethoscope },
      diagnosis: { stepNumber: 'Alt', label: 'Differential DX', shortLabel: 'DX', subtitle: 'Diagnosis', icon: GitBranch },
    },
    technicalAssistance: {
      guidanceHeading: 'Nursing Clinical Care & Triage Protocols',
      diagnosticAssistance: 'Triage Early Warning Scoring: Emergency Red triggers immediate physician alert, IV access, and airway management. Priority Yellow triggers active antipyretic administration and vital sign reassessment in 30 minutes.',
      treatmentAssistance: 'Standard Nursing Administration: Directly Observed Therapy (DOT) for first dose. Tepid sponging protocol: lukewarm water (30-32°C) applied with wet cloths to forehead, axillae, groin for 15-20 minutes; avoid cold water/ice.',
      dangerSignApproach: 'Continuous vital monitoring for tachypnea (>50 bpm in infants, >40 bpm in toddlers), hypoxemia (SpO2 < 92%), and post-ictal lethargy.',
      counselingApproach: 'Patient and family education on oral hydration (ORS), avoiding cold water baths during chills, and sleeping under LLIN bed nets.',
      clinicalPearls: [
        'Do NOT use cold or ice water for sponging as it causes vasoconstriction and paradoxical core temperature elevation with severe shivering.',
        'For pediatric paracetamol syrup (120mg/5mL), calculate volume: (Weight in kg x 15) ÷ 24 = mL per dose.',
        'In severe malaria, check blood glucose every 4 hours due to high incidence of unheralded hypoglycemia.',
      ],
    },
  },

  'Pharmacist': {
    role: 'Pharmacist',
    trackName: 'Pharmacological & Dispensing Track',
    badgeLabel: 'Pharmacy Track',
    trackBadgeColor: 'bg-purple-600 text-white',
    trackDescription: '8-stage pharmaceutical workflow: OTC triage screening, contraindication review (pregnancy trimester, G6PD, CYP3A4 interactions), mRDT testing prior to dispensing, weight-band dosing verification, and bioavailability counseling.',
    assistanceLevelTitle: 'Pharmacological & Interaction Assistance',
    assistanceType: 'pharmacological',
    cognitivePillText: 'Drug Interactions & Antimicrobial Stewardship',
    assistanceSummary: 'Real-time drug-drug interaction matrix (CYP3A4 inducers, QT prolongation), lumefantrine fatty meal bioavailability rules, GHS prescription auditing, and antimicrobial stewardship warnings (avoiding unindicated OTC antibiotics).',
    visibleSteps: [
      'patientData',
      'vitals',
      'diagnosis',
      'testing',
      'testResults',
      'treatmentplan',
      'counselling',
      'referral',
    ],
    stepDetails: {
      patientData: { stepNumber: '1', label: 'Patient & Allergy Info', shortLabel: 'Patient', subtitle: 'Age, weight, pregnancy & allergies', icon: UserPlus },
      vitals: { stepNumber: '2', label: 'Safety & Danger Screening', shortLabel: 'Screening', subtitle: 'OTC suitability check', icon: Activity },
      diagnosis: { stepNumber: '3', label: 'Pharmacy Triage', shortLabel: 'Triage', subtitle: 'Syndromic evaluation & drug interactions', icon: GitBranch },
      testing: { stepNumber: '4', label: 'POC mRDT Screening', shortLabel: 'mRDT', subtitle: 'Test before dispensing ACTs', icon: FlaskConical },
      testResults: { stepNumber: '5', label: 'Test Confirmation', shortLabel: 'Results', subtitle: 'Parasitological verification', icon: Microchip },
      treatmentplan: { stepNumber: '6', label: 'Dispensing & Dosing Math', shortLabel: 'Dispense', subtitle: 'Weight verification & stock substitution', icon: Pill },
      counselling: { stepNumber: '7', label: 'Medication Counseling', shortLabel: 'Counsel', subtitle: 'Bioavailability, food & compliance', icon: MessageSquare },
      referral: { stepNumber: '8', label: 'Clinic Referral Note', shortLabel: 'Referral', subtitle: 'Escalation for high-risk presentations', icon: Ambulance },
      planOfCare: { stepNumber: 'Alt', label: 'Plan of Care', shortLabel: 'Care', subtitle: 'Care plan', icon: ClipboardList },
      history: { stepNumber: 'Alt', label: 'History Taking', shortLabel: 'History', subtitle: 'History', icon: FileText },
      symptoms: { stepNumber: 'Alt', label: 'Review of Systems', shortLabel: 'ROS', subtitle: 'Symptoms', icon: Brain },
      examination: { stepNumber: 'Alt', label: 'Examination', shortLabel: 'Exam', subtitle: 'Physical exam', icon: Stethoscope },
    },
    technicalAssistance: {
      guidanceHeading: 'Pharmacist Clinical Pharmacology & Stewardship Guidance',
      diagnosticAssistance: 'Pharmacy Triage Protocol: Determines if patient is eligible for Community Pharmacy OTC ACT dispensing vs requiring urgent health facility referral. Strictly enforces Ghana "Test, Treat, Track" policy (No ACT without positive mRDT).',
      treatmentAssistance: 'Weight-based dosage verification. In pregnancy: 1st trimester requires Oral Quinine + Clindamycin for 7 days; 2nd/3rd trimester: Artemether-Lumefantrine. Lumefantrine absorption requires co-ingestion of lipids (milk, soup, fatty meal).',
      dangerSignApproach: 'Screens for OTC contraindications: severe danger signs, pregnancy with complications, infants <5 kg, fever >5 days without diagnosis, or suspected adverse drug reactions (ADR).',
      counselingApproach: 'Detailed counseling on 6-dose schedule (0h, 8h, 24h, 36h, 48h, 60h), repeating dose if vomited within 30 min, and Paracetamol max dosage (60 mg/kg/day).',
      clinicalPearls: [
        'Antimicrobial Stewardship: Do NOT dispense oral Ciprofloxacin or Amoxicillin OTC for unconfirmed febrile illness; contributes to high fluoroquinolone resistance in Ghana.',
        'Lumefantrine is highly lipophilic; bioavailability increases by >400% when taken with food or milk compared to fasting state.',
        'Watch for duplicate paracetamol in multi-symptom cold/cough syrups to prevent accidental acute acetaminophen hepatotoxicity.',
      ],
    },
  },

  'Physician Assistant': {
    role: 'Physician Assistant',
    trackName: 'Primary Care Algorithmic Track',
    badgeLabel: 'PA Track',
    trackBadgeColor: 'bg-blue-600 text-white',
    trackDescription: 'Full 12-stage comprehensive primary care track grounded in Ghana Health Service Standard Treatment Guidelines (7th Edition) with Doctor Escalation Threshold alerts and sub-district observation protocols.',
    assistanceLevelTitle: 'Algorithmic Primary Care & Referral Guidance',
    assistanceType: 'primaryCare',
    cognitivePillText: 'GHS STG Guidelines & Doctor Escalation',
    assistanceSummary: 'Evidence-based clinical decision trees, sub-district resource matching, outpatient vs 24-hour observation decision support, and clear Doctor Escalation thresholds for severe complications.',
    visibleSteps: [
      'patientData',
      'vitals',
      'planOfCare',
      'counselling',
      'history',
      'symptoms',
      'examination',
      'diagnosis',
      'testing',
      'testResults',
      'treatmentplan',
      'referral',
    ],
    stepDetails: {
      patientData: { stepNumber: '1', label: 'Patient Info', shortLabel: 'Info', subtitle: 'Demographics & identification', icon: UserPlus },
      vitals: { stepNumber: '2', label: 'Vitals & Triage', shortLabel: 'Vitals', subtitle: 'IMNCI triage & red flags', icon: Activity },
      planOfCare: { stepNumber: '3', label: 'Plan of Care', shortLabel: 'Care Plan', subtitle: 'Primary care triage pathway', icon: ClipboardList },
      counselling: { stepNumber: '3a', label: 'Counselling', shortLabel: 'Counsel', subtitle: 'Preventative & fever counseling', icon: MessageSquare },
      history: { stepNumber: '4', label: 'History Taking', shortLabel: 'History', subtitle: 'Detailed clinical history', icon: FileText },
      symptoms: { stepNumber: '4a', label: 'Review of Systems', shortLabel: 'ROS', subtitle: 'Systemic symptom checklist', icon: Brain },
      examination: { stepNumber: '5', label: 'Examination', shortLabel: 'Exam', subtitle: 'Targeted physical examination', icon: Stethoscope },
      diagnosis: { stepNumber: '6', label: 'Differential DX', shortLabel: 'Diff DX', subtitle: 'GHS STG differential ranking', icon: GitBranch },
      testing: { stepNumber: '7', label: 'Testing Device', shortLabel: 'Testing', subtitle: 'POC tests & lab workup', icon: FlaskConical },
      testResults: { stepNumber: '8', label: 'Test Results', shortLabel: 'Results', subtitle: 'Parasitology & lab data entry', icon: Microchip },
      treatmentplan: { stepNumber: '9', label: 'Treatment Plan', shortLabel: 'Treatment', subtitle: 'GHS STG prescription & dosing', icon: Pill },
      referral: { stepNumber: '10', label: 'Referral Form', shortLabel: 'Referral', subtitle: 'Doctor escalation & GHS transfer', icon: Ambulance },
    },
    technicalAssistance: {
      guidanceHeading: 'Physician Assistant Primary Care Guidance & GHS STG',
      diagnosticAssistance: 'Grounded in Ghana Standard Treatment Guidelines (7th Edition). Evaluates clinical compatibility for Health Centre outpatient treatment vs 24-hour observation ward admission.',
      treatmentAssistance: 'Weight-calculated first-line ACTs (Artemether-Lumefantrine or Artesunate-Amodiaquine). Stat pre-referral IM Artesunate (2.4 mg/kg) and IM Ceftriaxone/Ampicillin when severe complications arise.',
      dangerSignApproach: 'Monitors for Doctor Escalation Triggers: Suspected meningitis, severe anemia (Hb < 5 g/dL), prolonged fever > 7 days, or respiratory distress refractory to initial stabilization.',
      counselingApproach: 'Counseling on treatment adherence, warning signs for immediate return, ITN net utilization, and environmental mosquito control.',
      clinicalPearls: [
        'Adhere strictly to Ghana NMCP "Test, Treat, Track" policy: all febrile cases must receive parasitological confirmation prior to antimalarial therapy.',
        'If mRDT is negative in a patient with severe symptoms, investigate for alternative bacterial foci (pneumonia, UTI, enteric fever, meningitis).',
        'When referring a severe malaria case, always administer the stat pre-referral dose of IM Artesunate and document the exact time in the GHS referral form.',
      ],
    },
  },
};

export function getCadreWorkflow(cadre: CadreRole): CadreRoleWorkflow {
  return CADRE_WORKFLOWS[cadre] || CADRE_WORKFLOWS['Physician Assistant'];
}
