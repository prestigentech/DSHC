import React, { useState } from 'react';
import { 
  HistoryData, 
  CadreRole, 
  ClinicalExpertise, 
  SuggestedQuestion, 
  DecisionSupportOutput 
} from '../../types';
import { getRoleTheme } from '../../utils/theme';
import { 
  HelpCircle, 
  Sparkles, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Plus, 
  Check, 
  Languages, 
  AlertCircle 
} from 'lucide-react';

interface HistoryStageProps {
  history: HistoryData;
  setHistory: React.Dispatch<React.SetStateAction<HistoryData>>;
  cadre: CadreRole;
  expertise: ClinicalExpertise;
  timePressure: boolean;
  suggestedQuestions: SuggestedQuestion[];
  decisionSupport?: DecisionSupportOutput | null;
  onNextStage: () => void;
  onPrevStage: () => void;
}

export const HistoryStage: React.FC<HistoryStageProps> = ({
  history,
  setHistory,
  cadre,
  suggestedQuestions,
  decisionSupport,
  onNextStage,
  onPrevStage,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'twi' | 'ga' | 'ewe' | 'dagbani'>('twi');
  const roleTheme = getRoleTheme(cadre);

  const symptomList = [
    { key: 'chillsRigors' as const, label: 'Chills & Rigors', twi: 'Wɔwɔ / Ahotutuo', ga: 'Kplokplo kɛ fɛi', ewe: 'Avuviwɔwɔ', dagbani: 'Wari mini gbibsi' },
    { key: 'headache' as const, label: 'Headache', twi: 'Tipae', ga: 'Yitsoŋgbee', ewe: 'Tagbamedɔ', dagbani: 'Zuɣu yurilim' },
    { key: 'vomiting' as const, label: 'Vomiting', twi: 'Feɛ', ga: 'Feemɔ', ewe: 'Tutu', dagbani: 'Tiri' },
    { key: 'diarrhea' as const, label: 'Diarrhea', twi: 'Ayamtuo', ga: 'Musuŋdɔle', ewe: 'Dɔmenyenye', dagbani: 'Binyara' },
    { key: 'abdominalPain' as const, label: 'Abdominal Pain', twi: 'Yafunu yaw', ga: 'Musuŋyeli', ewe: 'Dɔmeveve', dagbani: 'Pua yurilim' },
    { key: 'cough' as const, label: 'Cough', twi: 'Waɛ', ga: 'Kpohimɔ', ewe: 'Kpekpe', dagbani: 'Kpiŋ' },
    { key: 'shortnessOfBreath' as const, label: 'Shortness of Breath', twi: 'Ahomegyeɛ mu den', ga: 'Mumutsɛmɔ', ewe: 'Gbɔgbɔ sesẽ', dagbani: 'Vuhim toli' },
    { key: 'dysuria' as const, label: 'Painful Urination', twi: 'Dwonsɔ yaw', ga: 'Nudɔmɔ kɛ yeli', ewe: 'Dɔdɔveve', dagbani: 'Salim yurilim' },
    { key: 'darkUrineOrHematuria' as const, label: 'Dark / Red Urine', twi: 'Dwonsɔ tuntum', ga: 'Nudɔmɔ tsuru', ewe: 'Dɔdɔ dzĩ', dagbani: 'Salim ʒee' },
    { key: 'jointMusclePain' as const, label: 'Joint & Muscle Pain', twi: 'Nnompe mu yaw', ga: 'Wuiadɔmɔ', ewe: 'Fudodomeveve', dagbani: 'Koba yurilim' },
    { key: 'soreThroat' as const, label: 'Sore Throat', twi: 'Menemu yaw', ga: 'Flɔliŋyeli', ewe: 'Vegbemveve', dagbani: 'Toli yurilim' },
    { key: 'earDischargeOrPain' as const, label: 'Ear Discharge', twi: 'Aso mu gya', ga: 'Toigbɔ', ewe: 'Tometutu', dagbani: 'Tibili yurilim' },
    { key: 'yellowEyesOrSkin' as const, label: 'Yellow Eyes (Jaundice)', twi: 'Ani kɔkɔɔ', ga: 'Hiŋmɛi tsuru', ewe: 'Ŋkudodro', dagbani: 'Nini dozim' },
  ];

  const cognitiveBiases = decisionSupport?.cognitiveBiases || [];
  const missingCriticalQuestions = suggestedQuestions.filter(q => q.isMissingCritical);

  return (
    <div className="space-y-5">
      {/* Cadre-Specific Alert: Missing Critical Info Alert for Doctor/PA */}
      {(cadre === 'Doctor' || cadre === 'Physician Assistant') && missingCriticalQuestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>CRITICAL CLINICAL INFORMATION REQUIRED</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {missingCriticalQuestions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-lg p-2.5 border border-amber-200 text-[11px] text-slate-800 shadow-2xs">
                <div className="font-bold text-amber-900">"{q.question}"</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Target Condition: {q.targetCondition}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cadre-Specific Alert: Cognitive Bias Mitigation for Doctor */}
      {cadre === 'Doctor' && cognitiveBiases.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-800 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>COGNITIVE DEBIASING ALERT</span>
          </div>
          {cognitiveBiases.map((bias, i) => (
            <div key={i} className="text-[11px] text-slate-700">
              <strong className="text-blue-900">{bias.biasType}:</strong> {bias.description}. <span className="text-blue-700 italic font-medium">{bias.mitigationAdvice}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Fever timeline, Review of Symptoms, and Exposures (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Fever Characteristics */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
              <div className="p-1 rounded bg-amber-100 text-amber-700">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Fever Timeline & Pattern
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 text-xs font-medium mb-1">
                  Duration of Fever (Days)
                </label>
                <input
                  id="history-fever-days-input"
                  type="number"
                  min="1"
                  max="60"
                  value={history.feverOnsetDays}
                  onChange={(e) =>
                    setHistory({ ...history, feverOnsetDays: Number(e.target.value) || 1 })
                  }
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-bold text-base focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                />
              </div>

              <div>
                <label className="block text-slate-600 text-xs font-medium mb-1">
                  Fever Pattern
                </label>
                <select
                  id="history-fever-pattern-select"
                  value={history.feverPattern}
                  onChange={(e) =>
                    setHistory({
                      ...history,
                      feverPattern: e.target.value as any,
                    })
                  }
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                >
                  <option value="Continuous">Continuous (High, persistent)</option>
                  <option value="Intermittent">Intermittent (Spikes with chills - Malaria)</option>
                  <option value="Step-ladder">Step-ladder (Progressively rising - Typhoid)</option>
                  <option value="Remittent">Remittent (Fluctuates)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Symptoms Checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${roleTheme.primaryIconBg}`}>
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Review of Symptoms
                </h3>
              </div>

              {/* Local language selection toggle */}
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                <Languages className={`w-3 h-3 ${roleTheme.primaryText}`} />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="bg-transparent text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="twi">Twi</option>
                  <option value="ga">Ga</option>
                  <option value="ewe">Ewe</option>
                  <option value="dagbani">Dagbani</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {symptomList.map((sym) => {
                const isActive = Boolean((history as any)[sym.key]);
                const localDesc = sym[selectedLanguage];
                return (
                  <button
                    type="button"
                    key={sym.key}
                    onClick={() =>
                      setHistory({
                        ...history,
                        [sym.key]: !isActive,
                      })
                    }
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg border text-left text-xs transition shadow-xs ${
                      isActive
                        ? `${roleTheme.primaryLightBg} ${roleTheme.primaryLightBorder} ${roleTheme.primaryDarkText} font-semibold ring-1 ${roleTheme.primaryLightBorder}`
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="pr-1 truncate">
                      <div className="font-semibold text-slate-800 truncate">{sym.label}</div>
                      {localDesc && (
                        <div className={`text-[10px] ${roleTheme.primaryText} italic font-medium truncate`}>
                          ({localDesc})
                        </div>
                      )}
                    </div>
                    <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ml-1 ${
                      isActive ? `${roleTheme.primaryBg} border-transparent text-white` : 'border-slate-300 bg-white'
                    }`}>
                      {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exposure & Prior Meds */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="p-1 rounded bg-blue-100 text-blue-700">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Exposures & Prior Medications
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  setHistory({
                    ...history,
                    floodOrStagnantWaterContact: !history.floodOrStagnantWaterContact,
                  })
                }
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between shadow-xs ${
                  history.floodOrStagnantWaterContact
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Stagnant Water / Flood Contact</span>
                {history.floodOrStagnantWaterContact && <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />}
              </button>

              <button
                type="button"
                onClick={() =>
                  setHistory({
                    ...history,
                    miningOrGalamseyOrForestExposure: !history.miningOrGalamseyOrForestExposure,
                  })
                }
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between shadow-xs ${
                  history.miningOrGalamseyOrForestExposure
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Mining / Forest Exposure</span>
                {history.miningOrGalamseyOrForestExposure && <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 text-[11px] font-medium mb-1">Prior Antimalarial (ACT)</label>
                <input
                  id="history-prior-act-input"
                  type="text"
                  value={history.priorAntimalarialTaken}
                  onChange={(e) => setHistory({ ...history, priorAntimalarialTaken: e.target.value })}
                  placeholder="e.g. None or AL 1 dose"
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[11px] font-medium mb-1">Prior Antibiotic / Herbs</label>
                <input
                  id="history-prior-abx-input"
                  type="text"
                  value={history.priorAntibioticsTaken}
                  onChange={(e) => setHistory({ ...history, priorAntibioticsTaken: e.target.value })}
                  placeholder="e.g. None or Amoxil"
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Suggested Follow-up Questions & Clinical Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Suggested Questions */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${roleTheme.primaryIconBg}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Suggested Inquiries
                </h3>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${roleTheme.primaryBadge}`}>Adaptive</span>
            </div>

            <div className="space-y-2">
              {suggestedQuestions.length > 0 ? (
                suggestedQuestions.slice(0, 3).map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-xs shadow-2xs"
                  >
                    <div className="font-semibold text-slate-800 mb-1 leading-snug">
                      "{q.question}"
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                      <span>Target: <strong className={roleTheme.primaryText}>{q.targetCondition}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedNotes = history.notes
                            ? `${history.notes}\n• Q: ${q.question} (Checked)`
                            : `• Q: ${q.question} (Checked)`;
                          setHistory({ ...history, notes: updatedNotes });
                        }}
                        className={`${roleTheme.primaryText} hover:opacity-80 font-bold flex items-center gap-0.5`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add to Notes</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No specific follow-up flags at this time.</p>
              )}
            </div>
          </div>

          {/* Consultation Notes */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Consultation Notes
            </label>
            <textarea
              id="history-clinical-notes-input"
              rows={4}
              value={history.notes}
              onChange={(e) => setHistory({ ...history, notes: e.target.value })}
              placeholder="Clinical narrative, caregiver comments, or details..."
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 text-xs focus:bg-white focus:outline-none ${roleTheme.primaryRing} resize-none font-mono shadow-xs`}
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <button
          onClick={onPrevStage}
          className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 transition shadow-xs"
        >
          ← Back to Vitals
        </button>

        <button
          id="history-proceed-btn"
          onClick={onNextStage}
          className={`${roleTheme.btnPrimary} text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm`}
        >
          <span>Continue to Physical Exam</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
