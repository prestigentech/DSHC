import React from 'react';
import { 
  DifferentialDiagnosis, 
  CadreRole, 
  ClinicalExpertise, 
  RedFlagAlert,
  DecisionSupportOutput 
} from '../../types';
import { getRoleTheme } from '../../utils/theme';
import { 
  CheckCircle2, 
  ArrowRight, 
  Info,
  AlertOctagon,
  Building2
} from 'lucide-react';

interface DiagnosisStageProps {
  differentials: DifferentialDiagnosis[];
  isSevere: boolean;
  redFlags: RedFlagAlert[];
  cadre: CadreRole;
  expertise: ClinicalExpertise;
  timePressure: boolean;
  decisionSupport?: DecisionSupportOutput | null;
  onNextStage: () => void;
  onPrevStage: () => void;
}

export const DiagnosisStage: React.FC<DiagnosisStageProps> = ({
  differentials,
  isSevere,
  cadre,
  onNextStage,
  onPrevStage,
}) => {
  const roleTheme = getRoleTheme(cadre);

  return (
    <div className="space-y-4">
      {/* CHN-Specific IMNCI Color-Coded Syndromic Classification Banner */}
      {cadre === 'Community Health Nurse' && (
        <div className={`p-4 rounded-xl border shadow-xs ${
          isSevere 
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : differentials.some(d => d.diagnosis.includes('Malaria'))
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2 font-bold text-xs mb-1">
            <span className={`w-3 h-3 rounded-full ${isSevere ? 'bg-rose-500' : differentials.some(d => d.diagnosis.includes('Malaria')) ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="uppercase">
              IMNCI Classification: {isSevere ? 'PINK ROW - VERY SEVERE FEBRILE DISEASE' : differentials.some(d => d.diagnosis.includes('Malaria')) ? 'YELLOW ROW - FEVER / CONFIRMED MALARIA' : 'GREEN ROW - FEVER / NO MALARIA'}
            </span>
          </div>
          <p className="text-xs font-medium">
            {isSevere 
              ? 'ACTION: Give Pre-Referral Treatment (Rectal Artesunate if < 6 yrs, First Dose IM Antibiotic) & REFER URGENTLY to Health Centre/Hospital.'
              : differentials.some(d => d.diagnosis.includes('Malaria'))
              ? 'ACTION: Perform mRDT. If positive, treat with 1st line ACT (Artesunate-Amodiaquine / Artemether-Lumefantrine) & Paracetamol.'
              : 'ACTION: Give supportive home care advice, fluid replacement, and teach mother when to return immediately.'}
          </p>
        </div>
      )}

      {/* Community Pharmacist Syndromic Scope Banner */}
      {cadre === 'Pharmacist' && (
        <div className={`p-3.5 rounded-xl border shadow-xs ${
          isSevere 
            ? 'bg-rose-50 border-rose-300 text-rose-900' 
            : 'bg-blue-50 border-blue-300 text-blue-900'
        }`}>
          <div className="flex items-center gap-2 font-bold text-xs mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>PHARMACY SYNDROMIC DISPENSING SCOPE</span>
          </div>
          <p className="text-xs font-medium">
            {isSevere 
              ? '⚠️ High-Risk / Severe syndrome detected. Outside Community Pharmacy OTC dispensing mandate. Urgent referral required.'
              : '✅ Uncomplicated Febrile Presentation. Check mRDT result before dispensing ACT. Ensure age/weight-band dosing.'}
          </p>
        </div>
      )}

      {/* General Nurse / Physician Escalation Threshold Banner */}
      {cadre === 'General Nurse' && isSevere && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900">
            <h4 className="font-bold text-xs mb-0.5">
              PHYSICIAN / PA ESCALATION REQUIRED
            </h4>
            <p className="text-[11px] font-medium">
              Patient exhibits physiological instability or severe red flags. Initiate nursing stabilization protocol (IV line, oxygen if SpO2 &lt; 92%, fever reduction) and alert attending Medical Officer / PA immediately.
            </p>
          </div>
        </div>
      )}

      {/* Differentials List */}
      <div className="space-y-3">
        {differentials.map((diff, index) => {
          const isTopPriority = index === 0;
          const severityBadgeColor =
            diff.severityLevel === 'LIFE_THREATENING'
              ? 'bg-rose-100 text-rose-800 border-rose-200'
              : diff.severityLevel === 'SEVERE'
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : diff.severityLevel === 'MODERATE'
              ? 'bg-blue-100 text-blue-800 border-blue-200'
              : 'bg-emerald-100 text-emerald-800 border-emerald-200';

          return (
            <div
              key={diff.diagnosis}
              className={`rounded-xl p-4 border transition shadow-xs ${
                isTopPriority
                  ? `bg-white ${roleTheme.primaryLightBorder} ring-1 ${roleTheme.primaryLightBorder}`
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Top Row: Rank, Diagnosis, Severity Badge, Probability */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isTopPriority
                        ? `${roleTheme.primaryBg} text-white`
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {diff.diagnosis}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">
                      ({diff.icdOrGhsCode})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityBadgeColor}`}>
                    {diff.severityLevel}
                  </span>
                  <span className={`text-xs font-bold font-mono ${roleTheme.primaryText}`}>
                    {diff.probability}%
                  </span>
                </div>
              </div>

              {/* Likelihood Meter */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2.5 overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    diff.probability > 75
                      ? 'bg-emerald-500'
                      : diff.probability > 50
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, diff.probability))}%` }}
                />
              </div>

              {/* Clinical Rationale */}
              <p className="text-[11px] text-slate-700 mb-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <strong className="text-slate-900">Rationale:</strong> {diff.clinicalRationale}
              </p>

              {/* Supporting vs Pending Criteria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 shadow-2xs">
                  <div className="text-emerald-700 font-bold flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Matching Findings</span>
                  </div>
                  {diff.matchingCriteria.length > 0 ? (
                    <ul className="space-y-0.5 text-slate-700">
                      {diff.matchingCriteria.map((c, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-emerald-600 font-bold text-[10px]">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-400 text-[10px]">None flagged</span>
                  )}
                </div>

                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 shadow-2xs">
                  <div className="text-amber-800 font-bold flex items-center gap-1 mb-1">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>Confirmatory Focus</span>
                  </div>
                  {diff.missingOrContradictoryCriteria.length > 0 ? (
                    <ul className="space-y-0.5 text-slate-700">
                      {diff.missingOrContradictoryCriteria.map((c, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-amber-600 font-bold text-[10px]">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-400 text-[10px]">Proceed to Stage 5 tests</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <button
          onClick={onPrevStage}
          className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 transition shadow-xs"
        >
          ← Back to Physical Exam
        </button>

        <button
          id="diagnosis-proceed-btn"
          onClick={onNextStage}
          className={`${roleTheme.btnPrimary} text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm`}
        >
          <span>Continue to Diagnostic Testing</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
