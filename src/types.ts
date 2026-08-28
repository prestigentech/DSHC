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

export type MainViewMode = 
  | 'consultation' 
  | 'dashboard' 
  | 'records' 
  | 'profile' 
  | 'settings' 
  | 'help' 
  | 'privacy'
  | 'admin'
  | 'adaptiveArchitecture';

export type DshcConsultationStep = 
  | 'patientData' // Step 1
  | 'vitals'      // Step 2
  | 'planOfCare'  // Step 3
  | 'counselling' // Step 3a
  | 'history'     // Step 4
  | 'symptoms'    // Step 4a (ROS)
  | 'examination' // Step 5
  | 'diagnosis'   // Step 6
  | 'testing'     // Step 7
  | 'testResults' // Step 8
  | 'treatmentplan' // Step 9
  | 'referral';   // Step 10

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
  fullName?: string;
  phone?: string;
  nhisNo?: string;
  patientId?: string;
  dateOfBirth?: string;
  age: number;
  ageUnit: 'months' | 'years';
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  weight: number; // in kg
  height?: number; // in cm
  muac?: number; // in cm (pediatric)
  isPregnant: boolean;
  pregnancyTrimester?: '1st' | '2nd' | '3rd';
  region: string;
  district: string;
  community: string;
  address?: string;
  occupation?: string;
  maritalStatus?: string;
  relativeName?: string;
  relativeContact?: string;
}

export interface VitalsData {
  temp: number; // in °C
  pulse: number; // in bpm
  rr: number; // in bpm
  bpSystolic?: number; // mmHg
  bpDiastolic?: number; // mmHg
  bloodPressure?: string;
  spo2: number; // %
  height?: number; // cm
  weight?: number; // kg
  bmi?: number;
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
  priorAntimalarialTaken: string;
  priorAntibioticsTaken: string;
  priorAntipyretics: string;
  immunizationUpToDate: boolean;
  notes: string;
  // DSHC specific narrative fields
  presentingComplaints?: string;
  historyOfComplaints?: string;
  odq?: string;
  pastMedical?: string;
  surgicalHx?: string;
  familyHx?: string;
  allergies?: string;
  socialHx?: string;
  // Visual ROS selected symptoms
  selectedSymptoms?: string[];
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
  generalNotes?: string;
  systematicFindings?: {
    respiratory?: string[];
    cardiovascular?: string[];
    neurological?: string[];
    ent?: string[];
    msk?: string[];
    abdomen?: string[];
  };
}

export interface DiagnosticTestsData {
  mrdtPf: 'Not Done' | 'Positive' | 'Negative' | 'Invalid';
  mrdtPan: 'Not Done' | 'Positive' | 'Negative';
  pregnancyTest?: 'Not Done' | 'Positive' | 'Negative';
  microscopyParasiteDensity?: string;
  fbcWbc?: number;
  fbcHb?: number;
  fbcPlatelets?: number;
  randomBloodGlucose?: number;
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
  biasType: string;
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

export interface EncounterRecord {
  id: string;
  createdAt: string;
  completedAt?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'referred';
  doctorName?: string;
  doctorEmail?: string;
  staffId?: string;
  facilityName?: string;
  facilityLevel?: FacilityLevel;
  cadre?: CadreRole;
  pageStates: {
    patient_info?: PatientProfile;
    dshc_patient_info?: PatientProfile;
    vitals?: VitalsData;
    dshc_vitals?: VitalsData;
    history?: HistoryData;
    dshc_symptoms?: HistoryData;
    symptoms?: any;
    examination?: ExaminationData;
    dshc_examination?: ExaminationData;
    diagnosis?: any;
    dshc_diagnosis?: any;
    treatment_plan?: any;
    dshc_treatment_plan?: any;
    counselling?: any;
    referral?: any;
    dshc_referral?: any;
  };
}

// ==========================================
// RAG-BASED ADAPTIVE UI ARCHITECTURE TYPES
// 6-Layer HCI Framework
// ==========================================

// Layer 1: User Context Layer
export interface UserContextLayerState {
  role: CadreRole;
  clinicalExperience: 'Novice' | 'Mid-level' | 'Expert';
  currentTask: DshcConsultationStep | 'triage' | 'differential' | 'testing' | 'dispensing' | 'referral' | 'counselling';
  patientCondition: {
    acuity: 'NORMAL' | 'URGENT' | 'CRITICAL_EMERGENCY';
    ageGroup: 'Neonate' | 'Infant' | 'ChildUnder5' | 'Adolescent' | 'Adult' | 'Elderly';
    isPregnant: boolean;
    hasComorbidities: boolean;
    comorbidityLabels: string[];
    feverState: 'Afebrile' | 'ModerateFever' | 'HighFever' | 'Hyperpyrexia';
    dangerSignsPresent: string[];
  };
  facilityCharacteristics: {
    facilityLevel: FacilityLevel;
    hasElectricity: boolean;
    hasColdChain: boolean;
    hasMicroscopy: boolean;
    hasPocRdt: boolean;
    hasOxygen: boolean;
    hasIvArtesunate: boolean;
    referralDistanceKm: number;
    resourceTier: 'CHPS' | 'PrimaryHealthCentre' | 'DistrictHospital' | 'Tertiary';
  };
}

// Layer 2: Knowledge Repository Models (HTA & DRM)
export interface HTASubtask {
  id: string;
  title: string;
  description: string;
  isDecisionPoint: boolean;
  requiredForRoles: CadreRole[];
  cognitiveLoad: 'Low' | 'Medium' | 'High';
  adaptationOpportunity: string;
}

export interface HTATaskNode {
  id: string;
  taskNumber: string;
  name: string;
  category: 'Triage' | 'History & ROS' | 'Physical Exam' | 'Diagnostic Testing' | 'Treatment & Dosing' | 'Referral & Transport';
  description: string;
  parentTaskId?: string;
  subtasks: HTASubtask[];
  decisionCriteria: string[];
  rolePermissions: Record<CadreRole, 'Primary' | 'Secondary' | 'Excluded'>;
}

// Cadre-Specific HTA Diagram Structures (Doctor, General Nurse, CHN, Pharmacist, PA)
export interface CadreHTANode {
  code: string;
  name: string;
  plan?: string;
  condition?: string;
  isDecisionBranch?: boolean;
  type?: 'task' | 'decision' | 'triage' | 'leaf' | 'input_artifact' | 'action';
  annotations?: string[];
  cognitiveLoad?: 'Low' | 'Medium' | 'High';
  clinicalRationale?: string;
  stgGuidelineLink?: string;
  children?: CadreHTANode[];
}

export interface CadreHTABranch {
  stepNumber: string;
  name: string;
  planDescription: string;
  conditionNotes?: string;
  isDecisionBranch?: boolean;
  inputArtifacts?: string[];
  nodes: CadreHTANode[];
}

export interface CadreHTATree {
  role: CadreRole;
  cadreKey: 'doctor' | 'general_nurse' | 'chn' | 'pharmacist' | 'physician_assistant';
  title: string;
  goal: string;
  rootPlan: string;
  contextSummary: string;
  practiceSetting: string;
  decisionAutonomy: 'Independent Specialist' | 'Primary Clinical Provider' | 'Protocolized Triage & Care' | 'Community Screening' | 'Medication Therapy Expert';
  branches: CadreHTABranch[];
  keyDifferences: string[];
}

export interface DecisionRequirementEntry {
  id: string;
  clinicalTask: string;
  informationNeeds: string[];
  userRoles: CadreRole[];
  contextualFactors: string[];
  adaptationTriggers: string[];
  cognitiveSupportMechanisms: string[];
  uiOutputStrategy: string;
}

// Layer 3: Retrieval Layer
export interface VectorRetrievalQuery {
  role: CadreRole;
  task: string;
  workflowStep: DshcConsultationStep;
  acuity: string;
  facilityLevel: FacilityLevel;
  keywords: string[];
}

export interface SemanticRetrievalResult {
  chunkId: string;
  title: string;
  category: 'HTA_WORKFLOW' | 'DECISION_REQUIREMENT' | 'CLINICAL_GUIDELINE' | 'ADAPTATION_RULE';
  similarityScore: number; // 0.00 to 1.00
  matchedTokens: string[];
  relevanceRationale: string;
  content: string;
}

// Layer 4 & 5: Generation & Adaptive Interface Layer
export interface AdaptiveComponentSpec {
  componentId: string;
  componentType: 'Dashboard' | 'DiagnosticPanel' | 'AlertBanner' | 'RecommendationCard' | 'DataVisualization' | 'NavigationElement' | 'DosageCalculator';
  title: string;
  priorityOrder: number; // 1 = top priority
  isExpandedByDefault: boolean;
  visibilityRule: 'SHOW_ALWAYS' | 'SHOW_IF_URGENT' | 'ROLE_RESTRICTED' | 'NOVICE_ONLY' | 'COLLAPSED_FOR_EXPERT';
  targetRole: CadreRole[];
  layoutGridSpan: 'col-span-12' | 'col-span-8' | 'col-span-6' | 'col-span-4';
  visualWeight: 'CRITICAL_ALARM' | 'HIGHLIGHT' | 'STANDARD' | 'MINIMAL_SECONDARY';
  dynamicContent: {
    headline: string;
    actionableDirectives: string[];
    guidelineCitations: string[];
    metricsOrValues?: Record<string, any>;
    customBadge?: string;
  };
}

export interface DynamicUISpecification {
  generatedAt: string;
  generatorEngine: 'Claude-3.7-Sonnet' | 'Gemini-3.7-Flash' | 'Deterministic-Ghana-STG-Engine';
  targetRole: CadreRole;
  experienceMode: 'Guided-Novice' | 'HighDensity-Expert';
  layoutArchetype: 'Triage-First-Emergency' | 'Prescription-Dispensing-Focus' | 'Community-Pictorial-Screening' | 'Comprehensive-Differential-Tree';
  cognitiveLoadTarget: 'Streamlined' | 'Balanced' | 'Comprehensive';
  activeAlerts: {
    id: string;
    level: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
    actionLabel: string;
  }[];
  components: AdaptiveComponentSpec[];
  workflowSequence: {
    step: DshcConsultationStep;
    label: string;
    isPriority: boolean;
    badgeNote?: string;
  }[];
}

// Layer 6: Feedback & Learning Layer
export interface InteractionFeedbackLog {
  id: string;
  timestamp: string;
  role: CadreRole;
  task: DshcConsultationStep;
  interactionType: 'LAYOUT_OVERRIDE' | 'COMPONENT_EXPAND' | 'RECOMMENDATION_ACCEPTED' | 'RECOMMENDATION_OVERRIDDEN' | 'TIME_ON_STEP_RECORDED' | 'GUIDELINE_ACCESSED';
  timeSpentSeconds: number;
  acceptedGuideline: boolean;
  clinicianRating?: number; // 1 to 5
  overrideReason?: string;
  adaptedLayoutId: string;
}

export interface AdaptiveFeedbackMetrics {
  totalInteractionsLogged: number;
  guidelineAcceptanceRate: number; // Percentage 0-100
  averageTimeReductionPercent: number; // e.g. 34%
  roleAcceptanceRates: Record<CadreRole, number>;
  mostOverriddenComponents: string[];
  cognitiveLoadRatingAverage: number; // 1-5
}

