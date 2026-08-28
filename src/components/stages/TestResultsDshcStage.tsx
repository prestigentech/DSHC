import React from 'react';
import { DiagnosticTestsData, PatientProfile } from '../../types';
import { 
  Microchip, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Activity,
  Layers
} from 'lucide-react';

interface TestResultsDshcStageProps {
  tests: DiagnosticTestsData;
  setTests: React.Dispatch<React.SetStateAction<DiagnosticTestsData>>;
  patient: PatientProfile;
  decisionSupport?: any;
  onNextStage: () => void;
  onPrevStage: () => void;
}

export const TestResultsDshcStage: React.FC<TestResultsDshcStageProps> = ({
  tests,
  setTests,
  patient,
  onNextStage,
  onPrevStage,
}) => {
  const isMalariaPos = tests.mrdtPf === 'Positive' || tests.mrdtPan === 'Positive';
  const hbValue = tests.fbcHb ?? 9.8;
  const isAnemic = hbValue < 11.0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
              <Microchip className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Multi-Panel Diagnostic Test Results
              </h3>
              <p className="text-xs text-slate-500">
                Review automated laboratory findings, rapid diagnostics, and clinical interpretation.
              </p>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-extrabold ${
            isMalariaPos ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}>
            {isMalariaPos ? 'POSITIVE FINDINGS DETECTED' : 'ALL RAPID PANELS NEGATIVE'}
          </div>
        </div>

        {/* Multi-Panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Panel 1: Malaria Diagnostics Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                🦟 Malaria Parasitology Panel
              </span>
              <span className="text-[10px] font-mono text-slate-500">GHS NMCP Protocol</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600 font-medium">mRDT P. falciparum (HRP-2):</span>
                <select
                  value={tests.mrdtPf}
                  onChange={(e) => setTests({ ...tests, mrdtPf: e.target.value as any })}
                  className={`font-bold rounded px-2 py-0.5 border text-xs ${
                    tests.mrdtPf === 'Positive' ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  <option value="Not Done">Not Done</option>
                  <option value="Positive">POSITIVE (+)</option>
                  <option value="Negative">NEGATIVE (-)</option>
                  <option value="Invalid">Invalid</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600 font-medium">mRDT Pan-Species (pLDH):</span>
                <select
                  value={tests.mrdtPan}
                  onChange={(e) => setTests({ ...tests, mrdtPan: e.target.value as any })}
                  className={`font-bold rounded px-2 py-0.5 border text-xs ${
                    tests.mrdtPan === 'Positive' ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  <option value="Not Done">Not Done</option>
                  <option value="Positive">POSITIVE (+)</option>
                  <option value="Negative">NEGATIVE (-)</option>
                </select>
              </div>

              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <div className="flex items-center justify-between text-slate-600 font-medium mb-1">
                  <span>Microscopy Density:</span>
                  <span className="text-slate-800 font-bold">{tests.microscopyParasiteDensity || '++ (12,500/uL)'}</span>
                </div>
                <input
                  type="text"
                  value={tests.microscopyParasiteDensity || ''}
                  onChange={(e) => setTests({ ...tests, microscopyParasiteDensity: e.target.value })}
                  placeholder="e.g. ++ (12,500 parasites/uL)"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Panel 2: Hematology & Inflammatory Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                🩸 Hematology & General Panel
              </span>
              <span className="text-[10px] font-mono text-slate-500">Automated / POC</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600 font-medium">Hemoglobin (Hb):</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={tests.fbcHb ?? 9.8}
                    onChange={(e) => setTests({ ...tests, fbcHb: parseFloat(e.target.value) || 0 })}
                    className="w-16 bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-xs text-right font-bold"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">g/dL</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${isAnemic ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {isAnemic ? 'Mild Anemia' : 'Normal'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600 font-medium">Platelet Count:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={tests.fbcPlatelets ?? 135}
                    onChange={(e) => setTests({ ...tests, fbcPlatelets: parseInt(e.target.value) || 0 })}
                    className="w-16 bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-xs text-right font-bold"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">x10³/µL</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600 font-medium">Random Blood Glucose:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={tests.randomBloodGlucose ?? 5.2}
                    onChange={(e) => setTests({ ...tests, randomBloodGlucose: parseFloat(e.target.value) || 0 })}
                    className="w-16 bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-xs text-right font-bold"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">mmol/L</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                    Normal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3: Typhoid & Enteric Fever Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                🧪 Typhoid & Enteric Fever Panel
              </span>
              <span className="text-[10px] font-mono text-slate-500">Serology</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600 font-medium">Widal Test Titers:</span>
                <select
                  value={tests.widalTest || 'Non-reactive'}
                  onChange={(e) => setTests({ ...tests, widalTest: e.target.value as any })}
                  className="font-semibold rounded px-2 py-0.5 border text-xs bg-slate-50 border-slate-300"
                >
                  <option value="Not Done">Not Done</option>
                  <option value="Non-reactive">Non-reactive (&lt; 1:80)</option>
                  <option value="TO >= 1:160, TH >= 1:160">Significant (TO &gt;= 1:160)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600 font-medium">Blood Culture (S. typhi):</span>
                <span className="text-slate-700 font-semibold font-mono text-xs">{tests.bloodCulture || 'No growth / Pending'}</span>
              </div>
            </div>
          </div>

          {/* Panel 4: Urine Dipstick Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                💧 Urine Dipstick Analysis
              </span>
              <span className="text-[10px] font-mono text-slate-500">Urinalysis POC</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600 font-medium">Leukocyte Esterase:</span>
                <select
                  value={tests.urineDipstickLeukocytes || 'Negative'}
                  onChange={(e) => setTests({ ...tests, urineDipstickLeukocytes: e.target.value as any })}
                  className="font-semibold rounded px-2 py-0.5 border text-xs bg-slate-50 border-slate-300"
                >
                  <option value="Negative">Negative</option>
                  <option value="Trace">Trace</option>
                  <option value="+">+ (Mild)</option>
                  <option value="++">++ (Moderate)</option>
                  <option value="+++">+++ (Severe UTI)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-600 font-medium">Nitrites:</span>
                <select
                  value={tests.urineDipstickNitrites || 'Negative'}
                  onChange={(e) => setTests({ ...tests, urineDipstickNitrites: e.target.value as any })}
                  className="font-semibold rounded px-2 py-0.5 border text-xs bg-slate-50 border-slate-300"
                >
                  <option value="Negative">Negative</option>
                  <option value="Positive">Positive (Gram-negative)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Diagnostic Interpretation Box */}
        <div className="bg-blue-50/80 border-2 border-blue-200 rounded-2xl p-4 sm:p-5 mb-6 text-xs sm:text-sm text-blue-950">
          <div className="flex items-center gap-2 font-bold text-blue-900 text-sm mb-1.5">
            <Sparkles className="w-4 h-4 text-blue-700" />
            Clinical Laboratory Interpretation & GHS Protocol:
          </div>
          <p className="text-blue-900/90 leading-relaxed text-xs">
            {isMalariaPos ? (
              <>
                <strong>Confirmed Plasmodium falciparum Infection:</strong> Rapid antigen testing confirms positive HRP-2 / pLDH. In accordance with Ghana STG (7th Edition), initiate weight-based Artemisinin-based Combination Therapy (ACT). First line is <strong>Artemether-Lumefantrine (AL 20/120mg)</strong> taken with fatty food or milk.
              </>
            ) : (
              <>
                <strong>Parasitological Testing Negative for Malaria:</strong> Antimalarials should NOT be administered without parasitological evidence. Assess for respiratory tract infections, viral illness, or urinary tract infection.
              </>
            )}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onPrevStage}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Testing Device</span>
          </button>

          <button
            onClick={onNextStage}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <span>Proceed to Treatment Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
