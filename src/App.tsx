import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  CadreRole, 
  ClinicalExpertise, 
  FacilityLevel, 
  DiagnosticStage, 
  PatientProfile, 
  VitalsData, 
  HistoryData, 
  ExaminationData, 
  DiagnosticTestsData, 
  ResourceInventory, 
  DecisionSupportOutput, 
  RedFlagAlert 
} from './types';
import { DEFAULT_FACILITY_RESOURCES } from './data/ghanaMedicalData';
import { CASE_PRESETS } from './data/casePresets';
import { computeGhanaClinicalDecision } from './utils/clinicalEngine';
import { getRoleTheme } from './utils/theme';
import { HeaderBar } from './components/HeaderBar';
import { StageNavigator } from './components/StageNavigator';
import { VitalsStage } from './components/stages/VitalsStage';
import { HistoryStage } from './components/stages/HistoryStage';
import { ExaminationStage } from './components/stages/ExaminationStage';
import { DiagnosisStage } from './components/stages/DiagnosisStage';
import { TestingStage } from './components/stages/TestingStage';
import { ManagementStage } from './components/stages/ManagementStage';
import { GhanaRagDrawer } from './components/GhanaRagDrawer';
import { ResourceInventoryModal } from './components/ResourceInventoryModal';
import { Loader2 } from 'lucide-react';

const INITIAL_PATIENT: PatientProfile = {
  id: 'GHS-PT-2026-001',
  name: 'Kwame Mensah',
  age: 4,
  ageUnit: 'years',
  gender: 'Male',
  weight: 16.0,
  height: 102,
  muac: 14.5,
  isPregnant: false,
  region: 'Ashanti Region',
  district: 'Kumasi Metro',
  community: 'Asokwa',
};

const INITIAL_VITALS: VitalsData = {
  temp: 38.9,
  pulse: 130,
  rr: 38,
  bpSystolic: 95,
  bpDiastolic: 60,
  spo2: 97,
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
  vomiting: true,
  diarrhea: false,
  abdominalPain: true,
  cough: false,
  shortnessOfBreath: false,
  dysuria: false,
  darkUrineOrHematuria: false,
  jointMusclePain: true,
  earDischargeOrPain: false,
  soreThroat: false,
  yellowEyesOrSkin: false,
  travelHistory: 'Resident of Kumasi suburb, frequent mosquito bites',
  miningOrGalamseyOrForestExposure: false,
  floodOrStagnantWaterContact: true,
  priorAntimalarialTaken: 'None',
  priorAntibioticsTaken: 'None',
  priorAntipyretics: 'Paracetamol syrup 5mL given by mother this morning',
  immunizationUpToDate: true,
  notes: 'Mother noticed sudden hot body 2 days ago accompanied by chills and reduced appetite.',
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
  splenomegaly: true,
  skinRash: 'None',
  pedalEdema: false,
  lymphadenopathy: false,
  tonsillarExudates: false,
};

const INITIAL_TESTS: DiagnosticTestsData = {
  mrdtPf: 'Positive',
  mrdtPan: 'Not Done',
  microscopyParasiteDensity: '++ (P. falciparum trophozoites)',
  fbcWbc: 8.9,
  fbcHb: 9.8,
  fbcPlatelets: 135,
  randomBloodGlucose: 4.8,
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
  // Contextual Adaptation States
  const [cadre, setCadre] = useState<CadreRole>('Physician Assistant');
  const [facilityLevel, setFacilityLevel] = useState<FacilityLevel>('Health Centre');
  const [expertise, setExpertise] = useState<ClinicalExpertise>('Experienced');
  const [timePressure, setTimePressure] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<DiagnosticStage>('vitals');

  // Clinical Case Data States
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [vitals, setVitals] = useState<VitalsData>(INITIAL_VITALS);
  const [history, setHistory] = useState<HistoryData>(INITIAL_HISTORY);
  const [examination, setExamination] = useState<ExaminationData>(INITIAL_EXAMINATION);
  const [tests, setTests] = useState<DiagnosticTestsData>(INITIAL_TESTS);
  const [resources, setResources] = useState<ResourceInventory>(
    DEFAULT_FACILITY_RESOURCES['Health Centre']
  );

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
          currentStage,
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
        // Silent recovery - local engine is already active
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
    currentStage,
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
    setCurrentStage('vitals');
  };

  // Reset Case to Blank Consultation
  const handleResetCase = () => {
    setPatient({
      id: `GHS-PT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      age: 5,
      ageUnit: 'years',
      gender: 'Male',
      weight: 18.0,
      isPregnant: false,
      region: 'Greater Accra',
      district: 'Accra Metro',
      community: '',
    });
    setVitals({
      temp: 38.0,
      pulse: 90,
      rr: 22,
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
    setCurrentStage('vitals');
  };

  // Stage progress metadata
  const stageProgress = useMemo(() => {
    const hasVitalsAlert = (decisionSupport?.redFlags?.length || 0) > 0;
    return {
      vitals: {
        isCompleted: vitals.temp > 0,
        count: 7,
        hasWarning: hasVitalsAlert,
      },
      history: {
        isCompleted: history.feverOnsetDays > 0,
        count: Object.values(history).filter(Boolean).length,
      },
      examination: {
        isCompleted: !!examination.generalCondition,
        count: Object.values(examination).filter(Boolean).length,
      },
      diagnosis: {
        isCompleted: (decisionSupport?.differentials?.length || 0) > 0,
        count: decisionSupport?.differentials?.length || 0,
      },
      testing: {
        isCompleted: tests.mrdtPf !== 'Not Done',
        count: Object.values(tests).filter((v) => v && v !== 'Not Done').length,
      },
      management: {
        isCompleted: (decisionSupport?.managementPlan?.primaryTreatment?.length || 0) > 0,
        count: decisionSupport?.managementPlan?.primaryTreatment?.length || 0,
      },
    };
  }, [vitals, history, examination, tests, decisionSupport]);

  const redFlags: RedFlagAlert[] = decisionSupport?.redFlags || [];
  const isSevere = decisionSupport?.isSevere || false;
  const roleTheme = getRoleTheme(cadre);

  return (
    <div 
      data-cadre={cadre} 
      className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-slate-300 selection:text-slate-900 overflow-x-hidden w-full transition-colors duration-300"
    >
      {/* Top Controls & Adaptation Context Bar */}
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
      />

      {/* 6-Stage Diagnostic Tracker Bar */}
      <StageNavigator
        currentStage={currentStage}
        setStage={setCurrentStage}
        stageProgress={stageProgress}
        isSevere={isSevere}
        cadre={cadre}
      />

      {/* Main Clinical Stage Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {/* Cognitive Summary Banner (Concise or Novice Adaptive) */}
        {decisionSupport?.cognitiveSummaryText && (
          <div className={`mb-5 bg-white border ${roleTheme.primaryLightBorder} rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs transition-colors`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${roleTheme.primaryBg} animate-ping`} />
              <span className="text-slate-700 font-medium">
                {decisionSupport.cognitiveSummaryText}
              </span>
            </div>

            {isAnalyzing ? (
              <div className={`flex items-center gap-1.5 ${roleTheme.primaryText} text-[11px] font-medium`}>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Enriching with GHS Guidelines...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${roleTheme.primaryBadge}`}>
                  {roleTheme.title} Protocol
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  Ghana STG 7th Ed Active
                </span>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Stage Views */}
        {currentStage === 'vitals' && (
          <VitalsStage
            patient={patient}
            setPatient={setPatient}
            vitals={vitals}
            setVitals={setVitals}
            cadre={cadre}
            expertise={expertise}
            timePressure={timePressure}
            redFlags={redFlags}
            onNextStage={() => setCurrentStage('history')}
          />
        )}

        {currentStage === 'history' && (
          <HistoryStage
            history={history}
            setHistory={setHistory}
            cadre={cadre}
            expertise={expertise}
            timePressure={timePressure}
            suggestedQuestions={decisionSupport?.suggestedNextQuestions || []}
            onNextStage={() => setCurrentStage('examination')}
            onPrevStage={() => setCurrentStage('vitals')}
          />
        )}

        {currentStage === 'examination' && (
          <ExaminationStage
            examination={examination}
            setExamination={setExamination}
            cadre={cadre}
            expertise={expertise}
            timePressure={timePressure}
            suggestedExaminations={decisionSupport?.suggestedExaminations || []}
            onNextStage={() => setCurrentStage('diagnosis')}
            onPrevStage={() => setCurrentStage('history')}
          />
        )}

        {currentStage === 'diagnosis' && (
          <DiagnosisStage
            differentials={decisionSupport?.differentials || []}
            isSevere={isSevere}
            redFlags={redFlags}
            cadre={cadre}
            expertise={expertise}
            timePressure={timePressure}
            decisionSupport={decisionSupport}
            onNextStage={() => setCurrentStage('testing')}
            onPrevStage={() => setCurrentStage('examination')}
          />
        )}

        {currentStage === 'testing' && (
          <TestingStage
            tests={tests}
            setTests={setTests}
            testPlan={decisionSupport?.testingPlan || []}
            facilityLevel={facilityLevel}
            cadre={cadre}
            expertise={expertise}
            timePressure={timePressure}
            decisionSupport={decisionSupport}
            onNextStage={() => setCurrentStage('management')}
            onPrevStage={() => setCurrentStage('diagnosis')}
          />
        )}

        {currentStage === 'management' && decisionSupport?.managementPlan && (
          <ManagementStage
            managementPlan={decisionSupport.managementPlan}
            patient={patient}
            vitals={vitals}
            facilityLevel={facilityLevel}
            cadre={cadre}
            expertise={expertise}
            timePressure={timePressure}
            decisionSupport={decisionSupport}
            onPrevStage={() => setCurrentStage('testing')}
          />
        )}
      </main>

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
