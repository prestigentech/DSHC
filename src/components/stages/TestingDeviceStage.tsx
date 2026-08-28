import React, { useState, useEffect } from 'react';
import { DiagnosticTestsData, PatientProfile, DecisionSupportOutput, CadreRole, FacilityLevel } from '../../types';
import { 
  FlaskConical, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Clock,
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';

interface TestingDeviceStageProps {
  patient: PatientProfile;
  vitals?: any;
  tests?: DiagnosticTestsData;
  setTests?: React.Dispatch<React.SetStateAction<DiagnosticTestsData>>;
  decisionSupport?: DecisionSupportOutput | null;
  facilityLevel?: FacilityLevel;
  cadre?: CadreRole;
  onNextStage: () => void;
  onPrevStage: () => void;
}

const DEFAULT_TESTS: DiagnosticTestsData = {
  mrdtPf: 'Not Done',
  mrdtPan: 'Not Done',
  microscopyParasiteDensity: 'Not Done',
  fbcHb: 9.8,
  fbcPlatelets: 135,
  fbcWbc: 8.9,
  randomBloodGlucose: 5.2,
  urineDipstickLeukocytes: 'Negative',
};

export const TestingDeviceStage: React.FC<TestingDeviceStageProps> = ({
  patient,
  tests = DEFAULT_TESTS,
  setTests,
  onNextStage,
  onPrevStage,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [progressMsg, setProgressMsg] = useState<string>('Ready to initiate diagnostic panel...');
  const [isCompleted, setIsCompleted] = useState<boolean>(tests.mrdtPf !== 'Not Done');

  const messages = [
    'Initializing diagnostic device...',
    'Buffering sample with lysis reagent...',
    'Running Pf HRP-2 and Pan antigen rapid test...',
    'Analyzing hematology and inflammatory indicators...',
    'Verifying control lines...',
    'Test complete! Generating clinical report...',
  ];

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          const msgIdx = Math.min(
            messages.length - 1,
            Math.floor(((15 - next) / 15) * (messages.length - 1))
          );
          setProgressMsg(messages[msgIdx]);
          return next;
        });
      }, 1000);
    } else if (isRunning && timeLeft <= 0) {
      setIsRunning(false);
      setIsCompleted(true);
      setProgressMsg('Diagnostic panel completed successfully!');
      if (setTests && tests.mrdtPf === 'Not Done') {
        setTests((prev) => ({
          ...prev,
          mrdtPf: 'Positive',
          mrdtPan: 'Positive',
          microscopyParasiteDensity: '++ (P. falciparum trophozoites 12,500/uL)',
          fbcHb: 9.8,
          fbcPlatelets: 135,
          fbcWbc: 8.9,
          randomBloodGlucose: 5.2,
          urineDipstickLeukocytes: 'Negative',
        }));
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, setTests, tests]);

  const handleStartTest = () => {
    setTimeLeft(15);
    setIsRunning(true);
    setIsCompleted(false);
    setProgressMsg('Initializing tests...');
  };

  const handleFastComplete = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsCompleted(true);
    setProgressMsg('Test complete! Generating clinical report...');
    if (setTests && tests.mrdtPf === 'Not Done') {
      setTests((prev) => ({
        ...prev,
        mrdtPf: 'Positive',
        mrdtPan: 'Positive',
        microscopyParasiteDensity: '++ (P. falciparum trophozoites 12,500/uL)',
        fbcHb: 9.8,
        fbcPlatelets: 135,
        fbcWbc: 8.9,
        randomBloodGlucose: 5.2,
        urineDipstickLeukocytes: 'Negative',
      }));
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(15);
    setIsCompleted(false);
    setProgressMsg('Ready to initiate diagnostic panel...');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
              <FlaskConical className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Step 7: Diagnostic Testing Device (Point-of-Care)
              </h3>
              <p className="text-xs text-slate-500">
                Run malaria mRDT (Pf/Pan), Hemocue Hb, and blood glucose diagnostics for {patient.fullName || patient.name}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              POC Analyzer GH-2000
            </span>
          </div>
        </div>

        {/* Device Canvas Frame */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl mb-6">
          
          {/* Top Status Bar of Device */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-amber-400 animate-pulse' : isCompleted ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span className="text-white font-semibold">
                {isRunning ? 'RUNNING TEST BATCH' : isCompleted ? 'TEST COMPLETED' : 'STANDBY READY'}
              </span>
            </div>
            <span>DEVICE ID: GHS-POC-0924</span>
          </div>

          {/* Center Graphic */}
          <div className="flex flex-col items-center justify-center py-6 text-center">
            
            {/* Progress Circular Meter */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-5">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-cyan-500 transition-all duration-1000 ease-linear"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={isRunning ? 264 - ((15 - timeLeft) / 15) * 264 : isCompleted ? 0 : 264}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                {isRunning ? (
                  <>
                    <span className="text-3xl font-mono font-bold text-cyan-400">{timeLeft}s</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Remaining</span>
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-0.5" />
                    <span className="text-[10px] font-bold text-emerald-300">100% DONE</span>
                  </>
                ) : (
                  <>
                    <FlaskConical className="w-10 h-10 text-slate-400 mb-0.5" />
                    <span className="text-[10px] font-bold text-slate-400">READY</span>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic Status Message */}
            <p className="text-xs sm:text-sm font-mono text-slate-300 max-w-md mx-auto mb-6 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
              {progressMsg}
            </p>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!isRunning && !isCompleted && (
                <button
                  onClick={handleStartTest}
                  className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start 15s POC Test</span>
                </button>
              )}

              {isRunning && (
                <button
                  onClick={handleFastComplete}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-xl border border-cyan-800 transition"
                >
                  ⚡ Fast Skip Timer
                </button>
              )}

              {isCompleted && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Run Another Strip</span>
                  </button>

                  <button
                    onClick={onNextStage}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2"
                  >
                    <span>View Test Results & Confirmation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Test Strip Indicators Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="block text-slate-400 text-[10px]">mRDT (Pf HRP-2):</span>
              <span className="font-bold text-white">{isCompleted ? 'POSITIVE [||]' : 'Pending'}</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="block text-slate-400 text-[10px]">Hemoglobin (Hb):</span>
              <span className="font-bold text-white">{isCompleted ? '9.8 g/dL' : 'Pending'}</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="block text-slate-400 text-[10px]">Blood Glucose:</span>
              <span className="font-bold text-white">{isCompleted ? '5.2 mmol/L' : 'Pending'}</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <span className="block text-slate-400 text-[10px]">Urine Leukocytes:</span>
              <span className="font-bold text-white">{isCompleted ? 'Negative' : 'Pending'}</span>
            </div>
          </div>

        </div>

        {/* Navigation Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            onClick={onPrevStage}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Differential Diagnosis</span>
          </button>

          <button
            onClick={onNextStage}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <span>Proceed to Step 8: Test Results</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
