import React, { useState } from 'react';
import { PatientProfile } from '../../types';
import { 
  MessageSquare, 
  CheckCircle2, 
  ArrowLeft, 
  FileCheck, 
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface CounsellingStageProps {
  patient: PatientProfile;
  vitals?: any;
  decisionSupport?: any;
  cadre?: any;
  onComplete?: (data: { selectedTopics: string[]; adviceGiven: string; followUpPlan: string; notes?: string }) => void;
  onNextStage?: () => void;
  onPrevStage?: () => void;
}

const HEALTH_TOPICS = [
  { id: 'nutrition', label: '🍎 Nutrition & Diet', desc: 'Balanced diet, feeding during illness' },
  { id: 'hygiene', label: '🧼 Hygiene & Sanitation', desc: 'Handwashing, clean water, waste disposal' },
  { id: 'immunization', label: '💉 Immunization', desc: 'EPI schedule, catch-up vaccinations' },
  { id: 'family_planning', label: '👨‍👩‍👧‍👦 Family Planning', desc: 'Birth spacing, modern contraceptives' },
  { id: 'malaria_prev', label: '🦟 Malaria Prevention', desc: 'ITN bed net usage, clearing breeding sites' },
  { id: 'hiv_aids', label: '🎗️ HIV/AIDS Awareness', desc: 'Prevention, voluntary testing, PMTCT' },
  { id: 'tb_awareness', label: '🫁 TB Awareness', desc: 'Cough etiquette, screening, full DOTS course' },
  { id: 'maternal_health', label: '🤰 Maternal Health', desc: 'Antenatal care (ANC), danger signs in pregnancy' },
  { id: 'child_health', label: '👶 Child Health', desc: 'Growth monitoring, exclusive breastfeeding' },
  { id: 'mental_health', label: '🧠 Mental Health', desc: 'Stress reduction, postpartum support' },
  { id: 'substance_abuse', label: '🚫 Substance Abuse', desc: 'Alcohol & tobacco cessation' },
  { id: 'chronic_disease', label: '💊 Chronic Disease Management', desc: 'Hypertension, diabetes medication adherence' },
];

export const CounsellingStage: React.FC<CounsellingStageProps> = ({
  patient,
  onComplete,
  onNextStage,
  onPrevStage,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    '🦟 Malaria Prevention',
    '🍎 Nutrition & Diet'
  ]);
  const [adviceGiven, setAdviceGiven] = useState<string>(
    'Patient counseled on sleeping under insecticide-treated bed nets every night. Emphasized drinking plenty of fluids (water, ORS, coconut water) and continuing nutritious meals. Advised to complete any prescribed medication fully even if fever subsides.'
  );
  const [followUpPlan, setFollowUpPlan] = useState<string>(
    'Return to facility in 3 days if fever persists, or immediately if danger signs develop (vomiting everything, convulsions, difficulty breathing, extreme weakness).'
  );
  const [additionalNotes, setAdditionalNotes] = useState<string>(
    'Caregiver demonstrated clear understanding of warning signs and oral hydration.'
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const toggleTopic = (label: string) => {
    if (selectedTopics.includes(label)) {
      setSelectedTopics(selectedTopics.filter(t => t !== label));
    } else {
      setSelectedTopics([...selectedTopics, label]);
    }
  };

  const handleComplete = () => {
    if (selectedTopics.length === 0) {
      alert('Please select at least one health topic discussed.');
      return;
    }
    if (!adviceGiven.trim()) {
      alert('Please document the advice and recommendations given.');
      return;
    }

    setIsSaved(true);
    if (onComplete) {
      onComplete({
        selectedTopics,
        adviceGiven,
        followUpPlan,
        notes: additionalNotes,
      });
    }
    if (onNextStage) {
      setTimeout(() => {
        onNextStage();
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-200">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              Health Education & Patient Counselling
            </h3>
            <p className="text-xs text-slate-500">
              Document health promotion topics and preventive recommendations provided during this visit.
            </p>
          </div>
        </div>

        {/* 1. Health Topics Discussed (Checkbox Grid) */}
        <div className="mb-6">
          <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-emerald-600" />
            Health Topics Discussed (Click to select)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {HEALTH_TOPICS.map((topic) => {
              const isSelected = selectedTopics.includes(topic.label);
              return (
                <div
                  key={topic.id}
                  onClick={() => toggleTopic(topic.label)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-xs ring-1 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{topic.label}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by div click
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 pointer-events-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{topic.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Advice & Recommendations Given */}
        <div className="mb-6">
          <label className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider mb-2 block flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Counselling Notes & Recommendations Given
          </label>
          <textarea
            value={adviceGiven}
            onChange={(e) => setAdviceGiven(e.target.value)}
            rows={3}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Document the key advice and preventive steps explained to the patient..."
          />
        </div>

        {/* 3. Follow-up & Additional Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5 block">
              Follow-up Instructions
            </label>
            <textarea
              value={followUpPlan}
              onChange={(e) => setFollowUpPlan(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="When to return, monitoring schedule, danger sign review..."
            />
          </div>

          <div>
            <label className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5 block">
              Additional Observations (Optional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Caregiver comprehension, environmental notes..."
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            onClick={onPrevStage}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Plan of Care</span>
          </button>

          <button
            onClick={handleComplete}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaved ? 'Counselling Recorded ✓' : 'Complete Counselling Session'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
