import React from 'react';
import { 
  ExaminationData, 
  CadreRole, 
  ClinicalExpertise, 
  SuggestedExamination,
  DecisionSupportOutput 
} from '../../types';
import { getRoleTheme } from '../../utils/theme';
import { 
  Search, 
  Sparkles, 
  Eye, 
  Stethoscope, 
  ShieldAlert, 
  ArrowRight, 
  Check,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';

interface ExaminationStageProps {
  examination: ExaminationData;
  setExamination: React.Dispatch<React.SetStateAction<ExaminationData>>;
  cadre: CadreRole;
  expertise: ClinicalExpertise;
  timePressure: boolean;
  suggestedExaminations: SuggestedExamination[];
  decisionSupport?: DecisionSupportOutput | null;
  onNextStage: () => void;
  onPrevStage: () => void;
}

export const ExaminationStage: React.FC<ExaminationStageProps> = ({
  examination,
  setExamination,
  cadre,
  suggestedExaminations,
  decisionSupport,
  onNextStage,
  onPrevStage,
}) => {
  const roleTheme = getRoleTheme(cadre);

  return (
    <div className="space-y-5">
      {/* Cadre-Specific Adaptive Banner: CHN IMNCI Step-by-Step Physical Guide */}
      {cadre === 'Community Health Nurse' && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span>IMNCI PHYSICAL CHECKLIST FOR CHN</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-800">
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
              <span className="font-bold text-emerald-800">1. Look:</span> Chest indrawing & stridor in calm child
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
              <span className="font-bold text-emerald-800">2. Feel:</span> Skin pinch on abdomen (does it go back slowly &gt;2s?)
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
              <span className="font-bold text-emerald-800">3. Check:</span> Palmar pallor & pedal edema (both feet)
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-2xs">
              <span className="font-bold text-emerald-800">4. Move:</span> Gently flex neck (chin to chest)
            </div>
          </div>
        </div>
      )}

      {/* Cadre-Specific Adaptive Banner: Pharmacist Visual Red-Flag Assessment */}
      {cadre === 'Pharmacist' && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>COMMUNITY PHARMACY VISUAL TRIAGE RED FLAGS</span>
          </div>
          <p className="text-xs text-amber-800 font-medium">
            If patient presents with <strong>Severe Pallor, Neck Stiffness, Petechial Rash, Scleral Jaundice, or Chest Indrawing</strong>, DO NOT dispense OTC medications. Stabilize and refer immediately.
          </p>
        </div>
      )}

      {/* Suggested Examinations Banner */}
      {suggestedExaminations.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${roleTheme.primaryIconBg}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Targeted Clinical Maneuvers
              </h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${roleTheme.primaryBadge}`}>Adaptive Guidelines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {suggestedExaminations.map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-xs shadow-2xs">
                <div className={`font-bold ${roleTheme.primaryText} mb-0.5`}>{item.procedure}</div>
                <div className="text-[11px] text-slate-700 font-medium">Look for: {item.clinicalSignToLookFor}</div>
                <div className="text-[10px] text-slate-500 mt-1">{item.rationale}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: 3 Clean Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. General & Hydration */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1 rounded bg-blue-100 text-blue-700">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              General & Hydration
            </h3>
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">Appearance</label>
            <select
              id="exam-general-select"
              value={examination.generalCondition}
              onChange={(e) =>
                setExamination({ ...examination, generalCondition: e.target.value as any })
              }
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
            >
              <option value="Well">Well / Normal</option>
              <option value="Mildly Ill">Mildly Ill</option>
              <option value="Moderately Ill">Moderately Ill</option>
              <option value="Toxic/Critically Ill">Toxic / Critically Ill</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">Hydration (IMNCI)</label>
            <select
              id="exam-hydration-select"
              value={examination.hydrationStatus}
              onChange={(e) =>
                setExamination({ ...examination, hydrationStatus: e.target.value as any })
              }
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
            >
              <option value="Well Hydrated">Well Hydrated</option>
              <option value="Some Dehydration">Some Dehydration (Sunken eyes)</option>
              <option value="Severe Dehydration">Severe Dehydration (Pinch &gt; 2s)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setExamination({ ...examination, jaundice: !examination.jaundice })}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition shadow-xs ${
              examination.jaundice
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Scleral Icterus / Jaundice</span>
            {examination.jaundice && <Check className="w-4 h-4 text-amber-600 stroke-[2.5]" />}
          </button>
        </div>

        {/* 2. Anemia & Pallor */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1 rounded bg-rose-100 text-rose-700">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Anemia & Pallor
            </h3>
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">Conjunctival Pallor</label>
            <select
              id="exam-conj-pallor-select"
              value={examination.conjunctivalPallor}
              onChange={(e) =>
                setExamination({ ...examination, conjunctivalPallor: e.target.value as any })
              }
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
            >
              <option value="None">None (Pink)</option>
              <option value="Mild">Mild Pallor</option>
              <option value="Moderate">Moderate Pallor</option>
              <option value="Severe">Severe Pallor (Hb &lt; 5g/dL)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">Palmar Pallor</label>
            <select
              id="exam-palmar-pallor-select"
              value={examination.palmarPallor}
              onChange={(e) =>
                setExamination({ ...examination, palmarPallor: e.target.value as any })
              }
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
            >
              <option value="None">None</option>
              <option value="Moderate">Some Palmar Pallor</option>
              <option value="Severe">Severe Palmar Pallor</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setExamination({ ...examination, pedalEdema: !examination.pedalEdema })}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition shadow-xs ${
              examination.pedalEdema
                ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Bilateral Pedal Edema</span>
            {examination.pedalEdema && <Check className="w-4 h-4 text-rose-600 stroke-[2.5]" />}
          </button>
        </div>

        {/* 3. Meningeal & Neurological */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1 rounded bg-amber-100 text-amber-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Meningeal Signs
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setExamination({ ...examination, neckStiffness: !examination.neckStiffness })}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition shadow-xs ${
              examination.neckStiffness
                ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div>
              <div className="font-semibold">Nuchal Rigidity / Stiff Neck</div>
              <div className="text-[10px] text-slate-500">Cannot flex chin to chest</div>
            </div>
            {examination.neckStiffness && <Check className="w-4 h-4 text-rose-600 stroke-[2.5]" />}
          </button>

          <button
            type="button"
            onClick={() => setExamination({ ...examination, kernigBrudzinskiSign: !examination.kernigBrudzinskiSign })}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition shadow-xs ${
              examination.kernigBrudzinskiSign
                ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div>
              <div className="font-semibold">Positive Kernig / Brudzinski</div>
              <div className="text-[10px] text-slate-500">Hip/knee flexion resistance</div>
            </div>
            {examination.kernigBrudzinskiSign && <Check className="w-4 h-4 text-rose-600 stroke-[2.5]" />}
          </button>

          <button
            type="button"
            onClick={() => setExamination({ ...examination, bulgingFontanelle: !examination.bulgingFontanelle })}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition shadow-xs ${
              examination.bulgingFontanelle
                ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div>
              <div className="font-semibold">Bulging Fontanelle</div>
              <div className="text-[10px] text-slate-500">In non-crying infants</div>
            </div>
            {examination.bulgingFontanelle && <Check className="w-4 h-4 text-rose-600 stroke-[2.5]" />}
          </button>
        </div>

        {/* 4. Respiratory & Chest */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1 rounded bg-cyan-100 text-cyan-700">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Respiratory Findings
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setExamination({ ...examination, chestIndrawing: !examination.chestIndrawing })}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition shadow-xs ${
              examination.chestIndrawing
                ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div>
              <div className="font-semibold">Chest Wall Indrawing</div>
              <div className="text-[10px] text-slate-500">Severe pneumonia indicator</div>
            </div>
            {examination.chestIndrawing && <Check className="w-4 h-4 text-rose-600 stroke-[2.5]" />}
          </button>

          <button
            type="button"
            onClick={() => setExamination({ ...examination, gruntingOrNasalFlaring: !examination.gruntingOrNasalFlaring })}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition shadow-xs ${
              examination.gruntingOrNasalFlaring
                ? 'bg-cyan-50 border-cyan-300 text-cyan-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Grunting / Nasal Flaring</span>
            {examination.gruntingOrNasalFlaring && <Check className="w-4 h-4 text-cyan-600 stroke-[2.5]" />}
          </button>

          <button
            type="button"
            onClick={() => setExamination({ ...examination, lungCracklesOrWheezes: !examination.lungCracklesOrWheezes })}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition shadow-xs ${
              examination.lungCracklesOrWheezes
                ? 'bg-cyan-50 border-cyan-300 text-cyan-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Lung Crackles / Wheezes</span>
            {examination.lungCracklesOrWheezes && <Check className="w-4 h-4 text-cyan-600 stroke-[2.5]" />}
          </button>
        </div>

        {/* 5. Abdominal & Organs */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className={`p-1 rounded ${roleTheme.primaryIconBg}`}>
              <Search className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Abdomen & Organs
            </h3>
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">Tenderness</label>
            <select
              id="exam-abdo-tender-select"
              value={examination.abdominalTenderness}
              onChange={(e) =>
                setExamination({ ...examination, abdominalTenderness: e.target.value as any })
              }
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
            >
              <option value="None">None (Soft)</option>
              <option value="Epigastric">Epigastric</option>
              <option value="Right Upper Quadrant">Right Upper Quadrant</option>
              <option value="Right Lower Quadrant">Right Lower Quadrant (RLQ)</option>
              <option value="Generalised">Generalised Tenderness</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setExamination({ ...examination, splenomegaly: !examination.splenomegaly })}
              className={`p-2 rounded-lg border text-left text-xs flex items-center justify-between shadow-xs ${
                examination.splenomegaly
                  ? `${roleTheme.primaryLightBg} ${roleTheme.primaryLightBorder} ${roleTheme.primaryDarkText} font-semibold`
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Splenomegaly</span>
              {examination.splenomegaly && <Check className={`w-3.5 h-3.5 ${roleTheme.primaryText} stroke-[2.5]`} />}
            </button>

            <button
              type="button"
              onClick={() => setExamination({ ...examination, hepatomegaly: !examination.hepatomegaly })}
              className={`p-2 rounded-lg border text-left text-xs flex items-center justify-between shadow-xs ${
                examination.hepatomegaly
                  ? `${roleTheme.primaryLightBg} ${roleTheme.primaryLightBorder} ${roleTheme.primaryDarkText} font-semibold`
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Hepatomegaly</span>
              {examination.hepatomegaly && <Check className={`w-3.5 h-3.5 ${roleTheme.primaryText} stroke-[2.5]`} />}
            </button>
          </div>
        </div>

        {/* 6. Rash & Throat */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1 rounded bg-purple-100 text-purple-700">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Skin Rash & Throat
            </h3>
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">Skin Lesions / Rash</label>
            <select
              id="exam-rash-select"
              value={examination.skinRash}
              onChange={(e) => setExamination({ ...examination, skinRash: e.target.value as any })}
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
            >
              <option value="None">None</option>
              <option value="Petechial/Purpuric">Petechial / Purpuric (Warning)</option>
              <option value="Maculopapular">Maculopapular (Measles/Rose spots)</option>
              <option value="Vesicular">Vesicular</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setExamination({ ...examination, tonsillarExudates: !examination.tonsillarExudates })}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition shadow-xs ${
              examination.tonsillarExudates
                ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Tonsillar Exudates / Red Throat</span>
            {examination.tonsillarExudates && <Check className="w-4 h-4 text-purple-600 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <button
          onClick={onPrevStage}
          className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 transition shadow-xs"
        >
          ← Back to History
        </button>

        <button
          id="exam-proceed-btn"
          onClick={onNextStage}
          className={`${roleTheme.btnPrimary} text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm`}
        >
          <span>Continue to Differential Diagnoses</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
