export type CadreRole = 
  | 'Doctor' 
  | 'Physician Assistant' 
  | 'General Nurse' 
  | 'Community Health Nurse' 
  | 'Pharmacist';

export type ClinicalExpertise = 'Novice' | 'Experienced';

export type FacilityLevel = 
  | 'CHPS Compound' 
  | 'Health Centre' 
  | 'Clinic' 
  | 'Maternity Home' 
  | 'District Hospital' 
  | 'Regional/Teaching Hospital' 
  | 'Community Pharmacy';

export type FacilityUiProfileType = 
  | 'Full diagnostic profile'
  | 'Basic assessment plus limited laboratory profile'
  | 'Configurable profile based on licensed laboratory capacity'
  | 'Maternal, neonatal and basic infection-testing profile'
  | 'Rapid-test, danger-sign and referral profile'
  | 'Screening, counselling and referral profile';

export interface HeFraEquipmentItem {
  id: string;
  name: string;
  category: 'Vital & Physical Assessment' | 'Point-of-Care & Rapid Tests' | 'Laboratory & Diagnostic Systems' | 'Imaging & Advanced Systems';
  hospitalStatus: string;
  healthCentreStatus: string;
  clinicStatus: string;
  maternityHomeStatus: string;
  chpsStatus: string;
  pharmacyStatus: string;
  clinicalUtility: string;
  referralOrAlternativeNote: string;
}

export type DiagnosticStage = 
  | 'vitals' 
  | 'history' 
  | 'examination' 
  | 'diagnosis' 
  | 'testing' 
  | 'management';

export type AVPU = 'Alert' | 'Voice' | 'Pain' | 'Unresponsive';

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  ageUnit: 'months' | 'years';
  gender: 'Male' | 'Female';
  weight: number; // in kg
  height?: number; // in cm
  muac?: number; // in cm (pediatric)
  isPregnant: boolean;
  pregnancyTrimester?: '1st' | '2nd' | '3rd';
  region: string;
  district: string;
  community: string;
}

export interface VitalsData {
  temp: number; // in °C
  pulse: number; // in bpm
  rr: number; // in bpm
  bpSystolic?: number; // mmHg
  bpDiastolic?: number; // mmHg
  spo2: number; // %
  avpu: AVPU;
  capillaryRefillSeconds: number;
  unconsciousOrLethargic: boolean;
  vomitingEverything: boolean;
  unableToDrinkOrBreastfeed: boolean;
  convulsionsPresent: boolean;
  stridorInCalmChild: boolean;
  extremeWeaknessProstration: boolean;
}

export interface HistoryData {
  feverOnsetDays: number;
  feverPattern: 'Intermittent' | 'Continuous' | 'Step-ladder' | 'Remittent';
  chillsRigors: boolean;
  headache: boolean;
  vomiting: boolean;
  diarrhea: boolean;
  abdominalPain: boolean;
  cough: boolean;
  coughDurationDays?: number;
  shortnessOfBreath: boolean;
  dysuria: boolean;
  darkUrineOrHematuria: boolean;
  jointMusclePain: boolean;
  earDischargeOrPain: boolean;
  soreThroat: boolean;
  yellowEyesOrSkin: boolean;
  travelHistory: string;
  miningOrGalamseyOrForestExposure: boolean;
  floodOrStagnantWaterContact: boolean;
  priorAntimalarialTaken: string; // e.g. "None", "AL 1 dose", "Herbal"
  priorAntibioticsTaken: string;
  priorAntipyretics: string;
  immunizationUpToDate: boolean;
  notes: string;
}

export interface ExaminationData {
  generalCondition: 'Well' | 'Mildly Ill' | 'Moderately Ill' | 'Toxic/Critically Ill';
  hydrationStatus: 'Well Hydrated' | 'Some Dehydration' | 'Severe Dehydration';
  conjunctivalPallor: 'None' | 'Mild' | 'Moderate' | 'Severe';
  palmarPallor: 'None' | 'Moderate' | 'Severe';
  jaundice: boolean;
  neckStiffness: boolean;
  kernigBrudzinskiSign: boolean;
  bulgingFontanelle: boolean;
  chestIndrawing: boolean;
  gruntingOrNasalFlaring: boolean;
  lungCracklesOrWheezes: boolean;
  bronchialBreathing: boolean;
  abdominalTenderness: 'None' | 'Epigastric' | 'Right Upper Quadrant' | 'Right Lower Quadrant' | 'Generalised';
  hepatomegaly: boolean;
  splenomegaly: boolean;
  skinRash: 'None' | 'Petechial/Purpuric' | 'Maculopapular' | 'Vesicular';
  pedalEdema: boolean;
  lymphadenopathy: boolean;
  tonsillarExudates: boolean;
}

export interface DiagnosticTestsData {
  mrdtPf: 'Not Done' | 'Positive' | 'Negative' | 'Invalid';
  mrdtPan: 'Not Done' | 'Positive' | 'Negative';
  pregnancyTest?: 'Not Done' | 'Positive' | 'Negative';
  microscopyParasiteDensity?: string; // e.g. "25,000 parasites/uL" or "Negative"
  fbcWbc?: number; // x 10^9 / L
  fbcHb?: number; // g/dL
  fbcPlatelets?: number; // x 10^9 / L
  randomBloodGlucose?: number; // mmol/L
  urineDipstickLeukocytes?: 'Negative' | 'Trace' | '+' | '++' | '+++';
  urineDipstickNitrites?: 'Negative' | 'Positive';
  bloodCulture?: 'Not Done' | 'Pending' | 'Salmonella typhi' | 'Staph aureus' | 'Streptococcus pneumoniae' | 'No growth';
  widalTest?: 'Not Done' | 'Non-reactive' | 'TO >= 1:160, TH >= 1:160';
  stoolRoutine?: 'Not Done' | 'Normal' | 'Ova & Parasites' | 'Occult Blood';
  chestXray?: 'Not Done' | 'Normal' | 'Lobar Consolidation' | 'Bronchopneumonia' | 'Pleural Effusion';
  csfAnalysis?: 'Not Done' | 'Clear / Normal' | 'Turbid, Elevated WBC & Protein (Bacterial)';
  dengueRdt?: 'Not Done' | 'NS1 Positive' | 'IgM/IgG Positive' | 'Negative';
  ultrasoundFinding?: 'Not Done' | 'Normal' | 'Hepatosplenomegaly' | 'Early Intrauterine Pregnancy' | 'Abdominal Lymphadenopathy';
}

export interface ResourceInventory {
  isClinicLabEquipped?: boolean;
  isPharmacyAuthorisedMrdt?: boolean;
  equipment?: {
    digitalThermometer: boolean;
    bpMonitor: boolean;
    stethoscope: boolean;
    pulseOximeter: boolean;
    weighingScale: boolean;
    infantScale: boolean;
    heightBoard: boolean;
    muacTape: boolean;
    glucometer: boolean;
    examLight: boolean;
    fetalDoppler?: boolean;
    centrifuge?: boolean;
    labRefrigerator?: boolean;
    ultrasound?: boolean;
    xray?: boolean;
    chemistryAnalyser?: boolean;
    molecularPlatform?: boolean;
  };
  diagnostics: {
    mrdt: boolean;
    pregnancyTest?: boolean;
    microscopy: boolean;
    fbc: boolean;
    hemocueHb: boolean;
    glucometer: boolean;
    urineDipstick: boolean;
    bloodCulture: boolean;
    chestXray: boolean;
    lumbarPunctureKit: boolean;
    widalTest: boolean;
    dengueRdt: boolean;
    ultrasound?: boolean;
    chemistryPanel?: boolean;
  };
  medications: {
    artemetherLumefantrine: boolean;
    artesunateAmodiaquine: boolean;
    artesunateIVorIM: boolean;
    rectalArtesunate: boolean;
    quinineOral: boolean;
    amoxicillinDispersible: boolean;
    ceftriaxoneIV: boolean;
    ciprofloxacin: boolean;
    azithromycin: boolean;
    paracetamolOral: boolean;
    paracetamolIVorSupp: boolean;
    ivFluidsRingersNormalSaline: boolean;
    oxygenTherapy: boolean;
    bloodTransfusion: boolean;
  };
}

export interface RedFlagAlert {
  sign: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  rationale: string;
  immediateAction: string;
}

export interface CognitiveBiasAlert {
  biasType: string; // e.g. "Anchoring Bias", "Premature Closure", "Availability Bias", "Confirmation Bias"
  warningText: string;
  clinicalEvidence: string;
  mitigationTip: string;
}

export interface DrugInteractionAlert {
  drug: string;
  interactingWith: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  clinicalRecommendation: string;
}

export interface PharmacyTriageAssessment {
  triageStatus: 'COMMUNITY_PHARMACY_OTC_MANAGEABLE' | 'REQUIRES_URGENT_HEALTH_FACILITY_REFERRAL';
  reason: string;
  redFlagsPresent: string[];
  antimicrobialStewardshipWarning?: string;
  drugInteractions: DrugInteractionAlert[];
  patientCounselingPrompts: string[];
}

export interface NurseTriageStatus {
  category: 'EMERGENCY_RED' | 'PRIORITY_YELLOW' | 'NON_URGENT_GREEN';
  categoryLabel: string;
  summary: string;
  immediateNursingActions: string[];
}

export interface LocalLanguageTerm {
  concept: string;
  english: string;
  twi: string;
  ga: string;
  ewe: string;
  dagbani: string;
  description: string;
}

export interface ChnGuidanceData {
  dangerSignsLocalTerms: LocalLanguageTerm[];
  preReferralRectalArtesunateDose: {
    ageRange: string;
    weightRange: string;
    capsulesCount: number;
    mgTotal: number;
  };
  actColorBand: {
    colorName: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    weightRange: string;
    tabsPerDose: string;
  };
  caregiverCounseling: {
    topic: string;
    english: string;
    localPrompt: string;
  }[];
}

export interface DoctorEscalationThreshold {
  indicated: boolean;
  triggers: string[];
  recommendedSpecialty: string;
  reasonForConsult: string;
}

export interface SuggestedQuestion {
  question: string;
  purpose: string;
  targetCondition: string;
  importance: 'HIGH' | 'MEDIUM';
}

export interface SuggestedExamination {
  procedure: string;
  clinicalSignToLookFor: string;
  rationale: string;
}

export interface DifferentialDiagnosis {
  diagnosis: string;
  probability: number;
  matchingCriteria: string[];
  missingOrContradictoryCriteria: string[];
  icdOrGhsCode: string;
  severityLevel: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  clinicalRationale: string;
}

export interface TestPlanItem {
  testName: string;
  priority: 'IMMEDIATE' | 'RECOMMENDED' | 'OPTIONAL';
  isAvailableLocally: boolean;
  requiresReferralOrSendout: boolean;
  expectedUtility: string;
  localAlternativeIfUnavailable: string;
  diagnosticYield?: 'HIGH' | 'MODERATE' | 'LOW';
  turnaroundTime?: string;
  estimatedCostGhs?: string;
}

export interface MedicationItem {
  medication: string;
  dosage: string;
  route: 'Oral' | 'IV' | 'IM' | 'Rectal' | 'Topical' | 'Inhaled';
  frequency: string;
  duration: string;
  isAvailableInFacility: boolean;
  alternativeIfStockout: string;
  counselingNotes: string;
  isPharmacyOtcAllowed?: boolean;
}

export interface ReferralGuidance {
  isReferralNeeded: boolean;
  referralUrgency: 'NONE' | 'IMMEDIATE_EMERGENCY' | 'SAME_DAY' | 'ROUTINE';
  targetFacilityLevel: 'Health Centre' | 'District Hospital' | 'Regional Hospital' | 'Teaching Hospital';
  preReferralStabilization: string[];
  sbarSummary: {
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
  };
}

export interface ManagementPlan {
  primaryTreatment: MedicationItem[];
  supportiveCare: string[];
  monitoringParameters: string[];
  referralGuidance: ReferralGuidance;
}

export interface DecisionSupportOutput {
  redFlags: RedFlagAlert[];
  isSevere: boolean;
  requiresImmediateReferral: boolean;
  suggestedNextQuestions: SuggestedQuestion[];
  suggestedExaminations: SuggestedExamination[];
  differentials: DifferentialDiagnosis[];
  testingPlan: TestPlanItem[];
  managementPlan: ManagementPlan;
  cadreSpecificAdvice: string;
  cognitiveSummaryText: string;
  // DRM Cadre-Specific Adaptive Intelligence
  cognitiveBiases?: CognitiveBiasAlert[];
  pharmacyTriage?: PharmacyTriageAssessment;
  nurseTriage?: NurseTriageStatus;
  chnGuidance?: ChnGuidanceData;
  doctorEscalation?: DoctorEscalationThreshold;
}

export interface ClinicalCasePreset {
  id: string;
  title: string;
  tagline: string;
  demographicsBadge: string;
  cadreContext: CadreRole;
  facilityLevel: FacilityLevel;
  patient: PatientProfile;
  vitals: VitalsData;
  history: HistoryData;
  examination: ExaminationData;
  tests: DiagnosticTestsData;
  learningFocus: string;
}
