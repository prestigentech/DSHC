import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  CadreRole, 
  ClinicalExpertise, 
  FacilityLevel, 
  DshcConsultationStep, 
  MainViewMode,
  PatientProfile, 
  VitalsData, 
  HistoryData, 
  ExaminationData, 
  DiagnosticTestsData, 
  ResourceInventory, 
  DecisionSupportOutput, 
  RedFlagAlert,
  EncounterRecord
} from './types';
import { DEFAULT_FACILITY_RESOURCES } from './data/ghanaMedicalData';
import { CASE_PRESETS } from './data/casePresets';
import { computeGhanaClinicalDecision } from './utils/clinicalEngine';
import { HeaderBar } from './components/HeaderBar';
import { StickyClinicalHeader } from './components/StickyClinicalHeader';
import { PatientBanner } from './components/PatientBanner';
import { DshcSidebar } from './components/DshcSidebar';
import { StageNavigator } from './components/StageNavigator';
import { DashboardView } from './components/DashboardView';
import { PatientRecordsView } from './components/PatientRecordsView';
import { AdminPortalView } from './components/AdminPortalView';
import { AdaptiveArchitectureView } from './components/AdaptiveArchitectureView';

// Stage components
import { PatientDataStage } from './components/stages/PatientDataStage';
import { VitalsStage } from './components/stages/VitalsStage';
import { PlanOfCareStage } from './components/stages/PlanOfCareStage';
import { CounsellingStage } from './components/stages/CounsellingStage';
import { HistoryStage } from './components/stages/HistoryStage';
import { SymptomsVisualStage } from './components/stages/SymptomsVisualStage';
import { ExaminationStage } from './components/stages/ExaminationStage';
import { DiagnosisStage } from './components/stages/DiagnosisStage';
import { TestingDeviceStage } from './components/stages/TestingDeviceStage';
import { TestResultsDshcStage } from './components/stages/TestResultsDshcStage';
import { TreatmentPlanDshcStage } from './components/stages/TreatmentPlanDshcStage';
import { ReferralDshcStage } from './components/stages/ReferralDshcStage';

// Modals
import { GhanaRagDrawer } from './components/GhanaRagDrawer';
import { ResourceInventoryModal } from './components/ResourceInventoryModal';

const INITIAL_PATIENT: PatientProfile = {
  id: 'GH-PT-8392',
  patientId: 'GH-PT-8392',
  name: 'Akosua Mensah',
  fullName: 'Akosua Mensah',
  age: 24,
  ageUnit: 'years',
  gender: 'Female',
  weight: 54.0,
  height: 162,
  muac: 24.5,
  isPregnant: false,
  phone: '0244123456',
  nhisNo: 'NHIS-88294012',
  region: 'Eastern Region',
  district: 'Fanteakwa North',
  community: 'Begoro Central',
};

const INITIAL_VITALS: VitalsData = {
  temp: 38.8,
  pulse: 98,
  rr: 22,
  bpSystolic: 110,
  bpDiastolic: 70,
  spo2: 98,
  avpu: 'Alert',
  capillaryRefillSeconds: 2,
  unconsciousOrLethargic: false,
  vomitingEverything: false,
  unableToDrinkOrBreastfeed: false,
  convulsionsPresent: false,
  stridorInCalmChild: false,
  extremeWeaknessProstration: false,
};

const INITIAL_HISTORY: HistoryData = {
  feverOnsetDays: 2,
  feverPattern: 'Intermittent',
  chillsRigors: true,
  headache: true,
  vomiting: false,
  diarrhea: false,
  abdominalPain: false,
  cough: false,
  shortnessOfBreath: false,
  dysuria: false,
  darkUrineOrHematuria: false,
  jointMusclePain: true,
  earDischargeOrPain: false,
  soreThroat: false,
  yellowEyesOrSkin: false,
  travelHistory: 'Begoro farming community, high mosquito exposure',
  miningOrGalamseyOrForestExposure: false,
  floodOrStagnantWaterContact: true,
  priorAntimalarialTaken: 'None',
  priorAntibioticsTaken: 'None',
  priorAntipyretics: 'Paracetamol 1g taken 4 hours ago',
  immunizationUpToDate: true,
  notes: 'Reports recurrent chills, rigors, and high fever starting 2 days ago.',
};

const INITIAL_EXAMINATION: ExaminationData = {
  generalCondition: 'Moderately Ill',
  hydrationStatus: 'Well Hydrated',
  conjunctivalPallor: 'Mild',
  palmarPallor: 'None',
  jaundice: false,
  neckStiffness: false,
  kernigBrudzinskiSign: false,
  bulgingFontanelle: false,
  chestIndrawing: false,
  gruntingOrNasalFlaring: false,
  lungCracklesOrWheezes: false,
  bronchialBreathing: false,
  abdominalTenderness: 'Epigastric',
  hepatomegaly: false,
  splenomegaly: false,
  skinRash: 'None',
  pedalEdema: false,
  lymphadenopathy: false,
  tonsillarExudates: false,
};

const INITIAL_TESTS: DiagnosticTestsData = {
  mrdtPf: 'Positive',
  mrdtPan: 'Negative',
  microscopyParasiteDensity: '++ (P. falciparum trophozoites seen)',
  fbcWbc: 6.8,
  fbcHb: 11.2,
  fbcPlatelets: 165,
  randomBloodGlucose: 5.4,
  urineDipstickLeukocytes: 'Negative',
  urineDipstickNitrites: 'Negative',
  bloodCulture: 'Not Done',
  widalTest: 'Not Done',
  stoolRoutine: 'Not Done',
  chestXray: 'Not Done',
  csfAnalysis: 'Not Done',
  dengueRdt: 'Not Done',
};

export default function App() {
  // Navigation & View States
  const [activeView, setActiveView] = useState<MainViewMode>('consultation');
  const [currentStep, setCurrentStep] = useState<DshcConsultationStep>('patientData');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Contextual Adaptation States
  const [cadre, setCadre] = useState<CadreRole>('Physician Assistant');
  const [facilityLevel, setFacilityLevel] = useState<FacilityLevel>('Health Centre');
  const [facilityName, setFacilityName] = useState<string>('Begoro Health Centre');
  const [expertise, setExpertise] = useState<ClinicalExpertise>('Experienced');
  const [timePressure, setTimePressure] = useState<boolean>(false);

  // Clinical Case Data States
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [vitals, setVitals] = useState<VitalsData>(INITIAL_VITALS);
  const [history, setHistory] = useState<HistoryData>(INITIAL_HISTORY);
  const [examination, setExamination] = useState<ExaminationData>(INITIAL_EXAMINATION);
  const [tests, setTests] = useState<DiagnosticTestsData>(INITIAL_TESTS);
  const [resources, setResources] = useState<ResourceInventory>(
    DEFAULT_FACILITY_RESOURCES['Health Centre']
  );

  // Encounters list
  const [encounters, setEncounters] = useState<EncounterRecord[]>([
    {
      id: 'ENC-2026-0891',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'completed',
      facilityName: 'Begoro Health Centre',
      facilityLevel: 'Health Centre',
      cadre: 'Physician Assistant',
      pageStates: {
        patient_info: INITIAL_PATIENT,
        vitals: INITIAL_VITALS,
      },
    },
    {
      id: 'ENC-2026-0890',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'referred',
      facilityName: 'Begoro Health Centre',
      facilityLevel: 'Health Centre',
      cadre: 'Physician Assistant',
      pageStates: {
        patient_info: {
          id: 'GH-PT-4421',
          name: 'Kwabena Osei',
          age: 3,
          gender: 'Male',
          weight: 12.5,
          phone: '0209876543',
        },
        vitals: {
          temp: 39.8,
          pulse: 145,
          rr: 48,
          spo2: 91,
          avpu: 'Voice',
          convulsionsPresent: true,
          unconsciousOrLethargic: true,
        },
      },
    },
    {
      id: 'ENC-2026-0889',
      createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      status: 'in-progress',
      facilityName: 'Begoro Health Centre',
      facilityLevel: 'Health Centre',
      cadre: 'General Nurse',
      pageStates: {
        patient_info: {
          id: 'GH-PT-1102',
          name: 'Ama Serwaa',
          age: 18,
          gender: 'Female',
          weight: 50,
          phone: '0245678901',
        },
        vitals: {
          temp: 38.2,
          pulse: 88,
          rr: 20,
          spo2: 99,
        },
      },
    },
  ]);

  // UI Modal / Drawer States
  const [isRagOpen, setIsRagOpen] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Initial computed decision support
  const [decisionSupport, setDecisionSupport] = useState<DecisionSupportOutput>(() =>
    computeGhanaClinicalDecision({
      patient: INITIAL_PATIENT,
      vitals: INITIAL_VITALS,
      history: INITIAL_HISTORY,
      examination: INITIAL_EXAMINATION,
      tests: INITIAL_TESTS,
      facilityLevel: 'Health Centre',
      cadre: 'Physician Assistant',
      availableResources: DEFAULT_FACILITY_RESOURCES['Health Centre'],
    })
  );

  const abortControllerRef = useRef<AbortController | null>(null);

  // Synchronize facility resource defaults when facility tier changes
  useEffect(() => {
    setResources(DEFAULT_FACILITY_RESOURCES[facilityLevel]);
  }, [facilityLevel]);

  // Immediately compute baseline clinical rules whenever inputs change
  useEffect(() => {
    const immediateResult = computeGhanaClinicalDecision({
      patient,
      vitals,
      history,
      examination,
      tests,
      facilityLevel,
      cadre,
      availableResources: resources,
    });
    setDecisionSupport(immediateResult);
  }, [patient, vitals, history, examination, tests, facilityLevel, cadre, resources]);

  // Optional background AI enrichment with debounce & cancellation
  const runAiClinicalAnalysis = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          patient,
          vitals,
          history,
          examination,
          tests,
          cadre,
          facilityLevel,
          expertise,
          timePressure,
          availableResources: resources,
          currentStage: currentStep,
        }),
      });

      if (!response.ok) {
        return;
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setDecisionSupport(resData.data);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        // Local engine already safe
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    patient,
    vitals,
    history,
    examination,
    tests,
    cadre,
    facilityLevel,
    expertise,
    timePressure,
    resources,
    currentStep,
  ]);

  // Trigger background enrichment after user stops editing for 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      runAiClinicalAnalysis();
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [runAiClinicalAnalysis]);

  // Handle Preset Case Load
  const handleLoadPreset = (presetId: string) => {
    const preset = CASE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setPatient(preset.patient);
    setVitals(preset.vitals);
    setHistory(preset.history);
    setExamination(preset.examination);
    setTests(preset.tests);
    setCadre(preset.cadreContext);
    setFacilityLevel(preset.facilityLevel);
    setResources(DEFAULT_FACILITY_RESOURCES[preset.facilityLevel]);
    setCurrentStep('vitals');
    setActiveView('consultation');
  };

  // Reset Case to Blank Consultation
  const handleResetCase = () => {
    const newId = `GH-PT-${Math.floor(1000 + Math.random() * 9000)}`;
    setPatient({
      id: newId,
      patientId: newId,
      name: '',
      fullName: '',
      age: 20,
      ageUnit: 'years',
      gender: 'Female',
      weight: 55.0,
      isPregnant: false,
      region: 'Eastern Region',
      district: 'Fanteakwa North',
      community: 'Begoro',
    });
    setVitals({
      temp: 38.0,
      pulse: 84,
      rr: 20,
      spo2: 98,
      avpu: 'Alert',
      capillaryRefillSeconds: 2,
      unconsciousOrLethargic: false,
      vomitingEverything: false,
      unableToDrinkOrBreastfeed: false,
      convulsionsPresent: false,
      stridorInCalmChild: false,
      extremeWeaknessProstration: false,
    });
    setHistory({
      feverOnsetDays: 1,
      feverPattern: 'Continuous',
      chillsRigors: false,
      headache: false,
      vomiting: false,
      diarrhea: false,
      abdominalPain: false,
      cough: false,
      shortnessOfBreath: false,
      dysuria: false,
      darkUrineOrHematuria: false,
      jointMusclePain: false,
      earDischargeOrPain: false,
      soreThroat: false,
      yellowEyesOrSkin: false,
      travelHistory: '',
      miningOrGalamseyOrForestExposure: false,
      floodOrStagnantWaterContact: false,
      priorAntimalarialTaken: 'None',
      priorAntibioticsTaken: 'None',
      priorAntipyretics: 'None',
      immunizationUpToDate: true,
      notes: '',
    });
    setExamination({
      generalCondition: 'Mildly Ill',
      hydrationStatus: 'Well Hydrated',
      conjunctivalPallor: 'None',
      palmarPallor: 'None',
      jaundice: false,
      neckStiffness: false,
      kernigBrudzinskiSign: false,
      bulgingFontanelle: false,
      chestIndrawing: false,
      gruntingOrNasalFlaring: false,
      lungCracklesOrWheezes: false,
      bronchialBreathing: false,
      abdominalTenderness: 'None',
      hepatomegaly: false,
      splenomegaly: false,
      skinRash: 'None',
      pedalEdema: false,
      lymphadenopathy: false,
      tonsillarExudates: false,
    });
    setTests({
      mrdtPf: 'Not Done',
      mrdtPan: 'Not Done',
    });
    setCurrentStep('patientData');
    setActiveView('consultation');
  };

  // Start new consultation from anywhere
  const handleStartNewConsultation = () => {
    handleResetCase();
    setActiveView('consultation');
    setCurrentStep('patientData');
  };

  // Resume encounter
  const handleResumeEncounter = (enc: EncounterRecord) => {
    if (enc.pageStates?.patient_info) {
      setPatient(enc.pageStates.patient_info);
    }
    if (enc.pageStates?.vitals) {
      setVitals(enc.pageStates.vitals);
    }
    setActiveView('consultation');
    setCurrentStep('vitals');
  };

  // Delete encounter
  const handleDeleteEncounter = (id: string) => {
    setEncounters((prev) => prev.filter((e) => e.id !== id));
  };

  const redFlags: RedFlagAlert[] = decisionSupport?.redFlags || [];
  const isSevere = decisionSupport?.isSevere || false;

  return (
    <div 
      data-cadre={cadre} 
      className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-slate-300 selection:text-slate-900 overflow-x-clip w-full transition-colors duration-300"
      style={{ fontSize: `${100 + fontSizeOffset * 10}%` }}
    >
      {/* Top Controls Bar */}
      <HeaderBar
        cadre={cadre}
        setCadre={setCadre}
        facilityLevel={facilityLevel}
        setFacilityLevel={setFacilityLevel}
        expertise={expertise}
        setExpertise={setExpertise}
        timePressure={timePressure}
        setTimePressure={setTimePressure}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenRagSearch={() => setIsRagOpen(true)}
        onLoadPreset={handleLoadPreset}
        onResetCase={handleResetCase}
        hasRedFlags={redFlags.length > 0}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          if (view === 'consultation') {
            setCurrentStep('patientData');
          }
        }}
        onIncreaseFontSize={() => setFontSizeOffset((prev) => Math.min(prev + 1, 3))}
        onDecreaseFontSize={() => setFontSizeOffset((prev) => Math.max(prev - 1, -2))}
        onResetFontSize={() => setFontSizeOffset(0)}
      />

      {/* Slide-in Navigation Sidebar */}
      <DshcSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          setSidebarOpen(false);
        }}
        currentStep={currentStep}
        onSelectStep={(step) => {
          setCurrentStep(step);
          setActiveView('consultation');
          setSidebarOpen(false);
        }}
        cadre={cadre}
        facilityName={facilityName}
        facilityLevel={facilityLevel}
        hasEmergencyFlags={redFlags.length > 0}
        onStartNewConsultation={handleStartNewConsultation}
      />

      {/* VIEW 1: DASHBOARD */}
      {activeView === 'dashboard' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
          <DashboardView
            cadre={cadre}
            facilityLevel={facilityLevel}
            facilityName={facilityName}
            onStartNewConsultation={handleStartNewConsultation}
            onNavigateToRecords={() => setActiveView('records')}
            onNavigateToView={(v) => setActiveView(v)}
            encounters={encounters}
            onSelectEncounter={handleResumeEncounter}
          />
        </main>
      )}

      {/* VIEW 2: ENCOUNTER RECORDS */}
      {activeView === 'records' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
          <PatientRecordsView
            encounters={encounters}
            onStartNewConsultation={handleStartNewConsultation}
            onResumeEncounter={handleResumeEncounter}
            onDeleteEncounter={handleDeleteEncounter}
          />
        </main>
      )}

      {/* VIEW 3: ADMIN & KNOWLEDGE BASE SUITE */}
      {activeView === 'admin' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
          <AdminPortalView
            onReturnToConsultation={() => setActiveView('consultation')}
            isAdminAuthenticated={isAdminAuthenticated}
            setIsAdminAuthenticated={setIsAdminAuthenticated}
          />
        </main>
      )}

      {/* VIEW 4: PROPOSED RAG-BASED ADAPTIVE UI ARCHITECTURE */}
      {activeView === 'adaptiveArchitecture' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
          <AdaptiveArchitectureView
            onReturnToConsultation={() => setActiveView('consultation')}
            activeRole={cadre}
            setActiveRole={setCadre}
            facilityLevel={facilityLevel}
            setFacilityLevel={setFacilityLevel}
          />
        </main>
      )}

      {/* VIEW 5: ACTIVE CONSULTATION FLOW */}
      {activeView === 'consultation' && (
        <>
          {/* USER REQUESTED: STICKY CLINICAL HEADER FLOWING THROUGHOUT CONSULTATION PAGES */}
          <StickyClinicalHeader
            decisionSupport={decisionSupport}
            cadre={cadre}
            facilityLevel={facilityLevel}
            isAnalyzing={isAnalyzing}
            patient={patient}
            onOpenGuidelines={() => setIsRagOpen(true)}
            onOpenReferral={() => setCurrentStep('referral')}
          />

          {/* Consultation Step Navigator */}
          <StageNavigator
            currentStage={currentStep}
            setStage={setCurrentStep}
            isSevere={isSevere}
            cadre={cadre}
          />

          {/* Main Stage Workspace */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4">
            
            {/* Patient Demographics Avatar Banner */}
            <PatientBanner
              patient={patient}
              encounterId={patient.id || 'GH-PT-8392'}
              onEditPatient={() => setCurrentStep('patientData')}
              onOpenRecords={() => setActiveView('records')}
            />

            {/* STAGE 1: PATIENT DATA */}
            {currentStep === 'patientData' && (
              <PatientDataStage
                patient={patient}
                setPatient={setPatient}
                cadre={cadre}
                facilityLevel={facilityLevel}
                onNextStage={() => setCurrentStep('vitals')}
              />
            )}

            {/* STAGE 2: VITALS & TRIAGE */}
            {currentStep === 'vitals' && (
              <VitalsStage
                patient={patient}
                setPatient={setPatient}
                vitals={vitals}
                setVitals={setVitals}
                cadre={cadre}
                expertise={expertise}
                timePressure={timePressure}
                redFlags={redFlags}
                decisionSupport={decisionSupport}
                onNextStage={() => setCurrentStep('planOfCare')}
              />
            )}

            {/* STAGE 3: PLAN OF CARE */}
            {currentStep === 'planOfCare' && (
              <PlanOfCareStage
                patient={patient}
                vitals={vitals}
                decisionSupport={decisionSupport}
                cadre={cadre}
                facilityLevel={facilityLevel}
                onProceedCounselling={() => setCurrentStep('counselling')}
                onProceedFullConsultation={() => setCurrentStep('history')}
                onProceedTesting={() => setCurrentStep('testing')}
                onProceedReferral={() => setCurrentStep('referral')}
              />
            )}

            {/* STAGE 3A: COUNSELLING */}
            {currentStep === 'counselling' && (
              <CounsellingStage
                patient={patient}
                vitals={vitals}
                decisionSupport={decisionSupport}
                cadre={cadre}
                onNextStage={() => setCurrentStep('history')}
                onPrevStage={() => setCurrentStep('planOfCare')}
              />
            )}

            {/* STAGE 4: HISTORY TAKING */}
            {currentStep === 'history' && (
              <HistoryStage
                history={history}
                setHistory={setHistory}
                cadre={cadre}
                expertise={expertise}
                timePressure={timePressure}
                suggestedQuestions={decisionSupport?.suggestedNextQuestions || []}
                onNextStage={() => setCurrentStep('symptoms')}
                onPrevStage={() => setCurrentStep('vitals')}
              />
            )}

            {/* STAGE 4A: VISUAL REVIEW OF SYSTEMS */}
            {currentStep === 'symptoms' && (
              <SymptomsVisualStage
                patient={patient}
                vitals={vitals}
                history={history}
                onNextStage={() => setCurrentStep('examination')}
                onPrevStage={() => setCurrentStep('history')}
              />
            )}

            {/* STAGE 5: PHYSICAL EXAMINATION */}
            {currentStep === 'examination' && (
              <ExaminationStage
                examination={examination}
                setExamination={setExamination}
                cadre={cadre}
                expertise={expertise}
                timePressure={timePressure}
                suggestedExaminations={decisionSupport?.suggestedExaminations || []}
                onNextStage={() => setCurrentStep('diagnosis')}
                onPrevStage={() => setCurrentStep('symptoms')}
              />
            )}

            {/* STAGE 6: DIFFERENTIAL DIAGNOSIS */}
            {currentStep === 'diagnosis' && (
              <DiagnosisStage
                differentials={decisionSupport?.differentials || []}
                isSevere={isSevere}
                redFlags={redFlags}
                cadre={cadre}
                expertise={expertise}
                timePressure={timePressure}
                decisionSupport={decisionSupport}
                onNextStage={() => setCurrentStep('testing')}
                onPrevStage={() => setCurrentStep('examination')}
              />
            )}

            {/* STAGE 7: TESTING DEVICE SIMULATOR */}
            {currentStep === 'testing' && (
              <TestingDeviceStage
                patient={patient}
                vitals={vitals}
                facilityLevel={facilityLevel}
                cadre={cadre}
                onNextStage={() => setCurrentStep('testResults')}
                onPrevStage={() => setCurrentStep('diagnosis')}
              />
            )}

            {/* STAGE 8: TEST RESULTS & CONFIRMATION */}
            {currentStep === 'testResults' && (
              <TestResultsDshcStage
                patient={patient}
                tests={tests}
                setTests={setTests}
                decisionSupport={decisionSupport}
                onNextStage={() => setCurrentStep('treatmentplan')}
                onPrevStage={() => setCurrentStep('testing')}
              />
            )}

            {/* STAGE 9: TREATMENT PLAN */}
            {currentStep === 'treatmentplan' && (
              <TreatmentPlanDshcStage
                patient={patient}
                vitals={vitals}
                tests={tests}
                decisionSupport={decisionSupport}
                cadre={cadre}
                facilityLevel={facilityLevel}
                onProceedReferral={() => setCurrentStep('referral')}
                onCompleteEncounter={() => {
                  setActiveView('records');
                }}
              />
            )}

            {/* STAGE 10: REFERRAL FORM */}
            {currentStep === 'referral' && (
              <ReferralDshcStage
                patient={patient}
                vitals={vitals}
                decisionSupport={decisionSupport}
                cadre={cadre}
                facilityLevel={facilityLevel}
                facilityName={facilityName}
                onPrevStage={() => setCurrentStep('treatmentplan')}
                onCompleteReferral={() => {
                  setActiveView('records');
                }}
              />
            )}

          </main>
        </>
      )}

      {/* RAG Guidelines Search Drawer */}
      <GhanaRagDrawer
        isOpen={isRagOpen}
        onClose={() => setIsRagOpen(false)}
        cadre={cadre}
      />

      {/* Facility Resource Configuration Modal */}
      <ResourceInventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        facilityLevel={facilityLevel}
        setFacilityLevel={setFacilityLevel}
        resources={resources}
        setResources={setResources}
      />
    </div>
  );
}
