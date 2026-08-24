import React from 'react';
import { 
  DiagnosticTestsData, 
  TestPlanItem, 
  FacilityLevel, 
  CadreRole, 
  ClinicalExpertise, 
  DecisionSupportOutput 
} from '../../types';
import { getRoleTheme } from '../../utils/theme';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight,
  TestTube,
  FileCheck2,
  AlertOctagon
} from 'lucide-react';

interface TestingStageProps {
  tests: DiagnosticTestsData;
  setTests: React.Dispatch<React.SetStateAction<DiagnosticTestsData>>;
  testPlan: TestPlanItem[];
  facilityLevel: FacilityLevel;
  cadre: CadreRole;
  expertise: ClinicalExpertise;
  timePressure: boolean;
  decisionSupport?: DecisionSupportOutput | null;
  onNextStage: () => void;
  onPrevStage: () => void;
}

export const TestingStage: React.FC<TestingStageProps> = ({
  tests,
  setTests,
  testPlan,
  facilityLevel,
  cadre,
  onNextStage,
  onPrevStage,
}) => {
  const roleTheme = getRoleTheme(cadre);

  return (
    <div className="space-y-4">
      {/* Cadre-Adaptive Banner: CHN / Pharmacist - Point-of-Care & "Test Before Treat" */}
      {(cadre === 'Community Health Nurse' || cadre === 'Pharmacist') && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-900">GHANA NATIONAL MALARIA CONTROL PROGRAM (NMCP): </span>
              <span className="text-emerald-800 font-medium">Enforce "Test, Treat, and Track" — Every suspected fever must receive mRDT / Microscopy before antimalarial administration.</span>
            </div>
          </div>
        </div>
      )}

      {/* Critical POC Lab Values Warning (General Nurse / Doctor / PA) */}
      {(tests.bloodGlucoseValue && tests.bloodGlucoseValue < 3.0) && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 flex items-center gap-3 text-xs text-rose-900 shadow-xs">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <strong className="text-rose-900">CRITICAL VALUE — PROFOUND HYPOGLYCEMIA ({tests.bloodGlucoseValue} mmol/L):</strong>
            <div className="text-[11px] text-rose-700">Administer 10% Dextrose 5 mL/kg IV stat. Re-check in 30 minutes.</div>
          </div>
        </div>
      )}

      {(tests.hemoglobinValue && tests.hemoglobinValue < 5.0) && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 flex items-center gap-3 text-xs text-rose-900 shadow-xs">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <strong className="text-rose-900">CRITICAL VALUE — SEVERE ANEMIA (Hb {tests.hemoglobinValue} g/dL):</strong>
            <div className="text-[11px] text-rose-700">Urgent blood transfusion and crossmatch required. Group O-negative / emergency packed cells.</div>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Recommended Tests Plan */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${roleTheme.primaryIconBg}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Targeted Test Recommendations
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">At {facilityLevel}</span>
          </div>

          <div className="space-y-2.5">
            {testPlan.map((tp, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tp.priority === 'IMMEDIATE' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                    />
                    <span className="font-bold text-slate-900">{tp.testName}</span>
                  </div>
                  {tp.isAvailableLocally ? (
                    <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> On-site
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-900 font-semibold flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      <ArrowUpRight className="w-3 h-3" /> Send-out
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-700">
                  <span className="text-slate-500 font-semibold">Utility:</span> {tp.expectedUtility}
                </div>

                {!tp.isAvailableLocally && (
                  <div className="bg-amber-50 p-2 rounded border border-amber-200 text-[11px] text-amber-900 font-medium">
                    <strong>Alternative:</strong> {tp.localAlternativeIfUnavailable}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Enter Laboratory / Point-of-Care Results */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1 rounded bg-cyan-100 text-cyan-700">
              <TestTube className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Record Patient Test Results
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Malaria RDT */}
            <div>
              <label className="block text-slate-600 text-[11px] font-medium mb-1">
                Malaria RDT (mRDT Pf HRP2)
              </label>
              <select
                id="test-mrdt-pf-select"
                value={tests.mrdtPf}
                onChange={(e) => setTests({ ...tests, mrdtPf: e.target.value as any })}
                className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              >
                <option value="Not Done">Not Done</option>
                <option value="Positive">POSITIVE (Pf antigen detected)</option>
                <option value="Negative">NEGATIVE (No Pf antigen)</option>
                <option value="Invalid">Invalid (Repeat)</option>
              </select>
            </div>

            {/* Blood Film Microscopy & Blood Glucose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 text-[11px] font-medium mb-1">Microscopy Density</label>
                <input
                  id="test-microscopy-input"
                  type="text"
                  value={tests.microscopyParasiteDensity || ''}
                  onChange={(e) => setTests({ ...tests, microscopyParasiteDensity: e.target.value })}
                  placeholder="e.g. +++ or Negative"
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                />
              </div>
              <div>
                <label className="block text-slate-600 text-[11px] font-medium mb-1">Blood Glucose (mmol/L)</label>
                <input
                  id="test-rbg-input"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 4.8"
                  value={tests.randomBloodGlucose || ''}
                  onChange={(e) => setTests({ ...tests, randomBloodGlucose: Number(e.target.value) || undefined })}
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                />
              </div>
            </div>

            {/* FBC: Hb, WBC, Platelets */}
            <div>
              <label className="block text-slate-600 text-[11px] font-medium mb-1">Full Blood Count (FBC)</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    id="test-fbc-hb-input"
                    type="number"
                    step="0.1"
                    placeholder="Hb (g/dL)"
                    value={tests.fbcHb || ''}
                    onChange={(e) => setTests({ ...tests, fbcHb: Number(e.target.value) || undefined })}
                    className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                  />
                </div>
                <div>
                  <input
                    id="test-fbc-wbc-input"
                    type="number"
                    step="0.1"
                    placeholder="WBC (10⁹/L)"
                    value={tests.fbcWbc || ''}
                    onChange={(e) => setTests({ ...tests, fbcWbc: Number(e.target.value) || undefined })}
                    className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                  />
                </div>
                <div>
                  <input
                    id="test-fbc-plt-input"
                    type="number"
                    placeholder="Plt (10⁹)"
                    value={tests.fbcPlatelets || ''}
                    onChange={(e) => setTests({ ...tests, fbcPlatelets: Number(e.target.value) || undefined })}
                    className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                  />
                </div>
              </div>
            </div>

            {/* Specialized: Widal & Chest X-Ray */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 text-[11px] font-medium mb-1">Widal Test</label>
                <select
                  id="test-widal-select"
                  value={tests.widalTest || 'Not Done'}
                  onChange={(e) => setTests({ ...tests, widalTest: e.target.value as any })}
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                >
                  <option value="Not Done">Not Done</option>
                  <option value="Non-reactive">Non-reactive</option>
                  <option value="TO >= 1:160, TH >= 1:160">Elevated (≥ 1:160)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 text-[11px] font-medium mb-1">Chest X-Ray</label>
                <select
                  id="test-cxr-select"
                  value={tests.chestXray || 'Not Done'}
                  onChange={(e) => setTests({ ...tests, chestXray: e.target.value as any })}
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                >
                  <option value="Not Done">Not Done</option>
                  <option value="Normal">Normal</option>
                  <option value="Lobar Consolidation">Lobar Consolidation</option>
                  <option value="Bronchopneumonia">Bronchopneumonia</option>
                </select>
              </div>
            </div>

            {/* Blood Culture & CSF */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 text-[11px] font-medium mb-1">Blood Culture</label>
                <select
                  id="test-blood-culture-select"
                  value={tests.bloodCulture || 'Not Done'}
                  onChange={(e) => setTests({ ...tests, bloodCulture: e.target.value as any })}
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                >
                  <option value="Not Done">Not Done</option>
                  <option value="Pending">Pending</option>
                  <option value="Salmonella typhi">Salmonella typhi</option>
                  <option value="Streptococcus pneumoniae">S. pneumoniae</option>
                  <option value="No growth">No growth</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 text-[11px] font-medium mb-1">CSF Analysis</label>
                <select
                  id="test-csf-select"
                  value={tests.csfAnalysis || 'Not Done'}
                  onChange={(e) => setTests({ ...tests, csfAnalysis: e.target.value as any })}
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                >
                  <option value="Not Done">Not Done</option>
                  <option value="Clear / Normal">Clear / Normal</option>
                  <option value="Turbid, Elevated WBC & Protein (Bacterial)">Turbid (Bacterial Meningitis)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <button
          onClick={onPrevStage}
          className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 transition shadow-xs"
        >
          ← Back to Differentials
        </button>

        <button
          id="testing-proceed-btn"
          onClick={onNextStage}
          className={`${roleTheme.btnPrimary} text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm`}
        >
          <span>Continue to Treatment Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
