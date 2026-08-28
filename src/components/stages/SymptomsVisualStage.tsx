import React from 'react';
import { HistoryData } from '../../types';
import { 
  Thermometer, 
  Brain, 
  Wind, 
  Activity, 
  Bone, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface SymptomsVisualStageProps {
  history: HistoryData;
  setHistory?: React.Dispatch<React.SetStateAction<HistoryData>>;
  patient?: any;
  vitals?: any;
  onNextStage: () => void;
  onPrevStage: () => void;
}

interface SymptomCardDef {
  id: string;
  name: string;
  category: 'General' | 'Head & Neuro' | 'Respiratory' | 'Gastrointestinal' | 'Musculoskeletal' | 'Skin & Mucosa';
  iconEmoji: string;
  mappingKey?: keyof HistoryData;
}

const SYMPTOMS_LIST: SymptomCardDef[] = [
  // General
  { id: 'fever', name: 'Fever', category: 'General', iconEmoji: '🌡️' },
  { id: 'chills', name: 'Chills / Rigors', category: 'General', iconEmoji: '❄️', mappingKey: 'chillsRigors' },
  { id: 'night_sweats', name: 'Night Sweats', category: 'General', iconEmoji: '🌧️' },
  { id: 'fatigue', name: 'Fatigue / Malaise', category: 'General', iconEmoji: '🛌' },
  { id: 'appetite', name: 'Loss of Appetite', category: 'General', iconEmoji: '🍽️' },
  { id: 'dehydration', name: 'Dehydration', category: 'General', iconEmoji: '💧' },

  // Head & Neuro
  { id: 'headache', name: 'Headache', category: 'Head & Neuro', iconEmoji: '🤕', mappingKey: 'headache' },
  { id: 'neck_stiffness', name: 'Neck Stiffness', category: 'Head & Neuro', iconEmoji: '🦴' },
  { id: 'photophobia', name: 'Photophobia', category: 'Head & Neuro', iconEmoji: '☀️' },
  { id: 'confusion', name: 'Confusion', category: 'Head & Neuro', iconEmoji: '😵' },
  { id: 'seizures', name: 'Seizures / Fits', category: 'Head & Neuro', iconEmoji: '⚡' },
  { id: 'dizziness', name: 'Dizziness / Vertigo', category: 'Head & Neuro', iconEmoji: '🌀' },

  // Respiratory
  { id: 'cough', name: 'Cough', category: 'Respiratory', iconEmoji: '🗣️', mappingKey: 'cough' },
  { id: 'sore_throat', name: 'Sore Throat', category: 'Respiratory', iconEmoji: '🧣', mappingKey: 'soreThroat' },
  { id: 'runny_nose', name: 'Runny Nose', category: 'Respiratory', iconEmoji: '🤧' },
  { id: 'chest_pain', name: 'Chest Pain', category: 'Respiratory', iconEmoji: '🫀' },
  { id: 'sob', name: 'Shortness of Breath', category: 'Respiratory', iconEmoji: '🫁', mappingKey: 'shortnessOfBreath' },
  { id: 'wheezing', name: 'Wheezing / Stridor', category: 'Respiratory', iconEmoji: '💨' },

  // Gastrointestinal
  { id: 'nausea', name: 'Nausea', category: 'Gastrointestinal', iconEmoji: '🤢' },
  { id: 'vomiting', name: 'Vomiting', category: 'Gastrointestinal', iconEmoji: '🤮', mappingKey: 'vomiting' },
  { id: 'diarrhea', name: 'Diarrhea', category: 'Gastrointestinal', iconEmoji: '🚽', mappingKey: 'diarrhea' },
  { id: 'abdominal_pain', name: 'Abdominal Pain', category: 'Gastrointestinal', iconEmoji: '😖', mappingKey: 'abdominalPain' },
  { id: 'jaundice', name: 'Jaundice / Yellow Eyes', category: 'Gastrointestinal', iconEmoji: '👁️', mappingKey: 'yellowEyesOrSkin' },

  // Musculoskeletal
  { id: 'myalgia', name: 'Muscle Pain (Myalgia)', category: 'Musculoskeletal', iconEmoji: '💪', mappingKey: 'jointMusclePain' },
  { id: 'arthralgia', name: 'Joint Pain (Arthralgia)', category: 'Musculoskeletal', iconEmoji: '🦵' },
  { id: 'back_pain', name: 'Back Pain', category: 'Musculoskeletal', iconEmoji: '🧍' },

  // Skin & Mucosa
  { id: 'rash', name: 'Skin Rash', category: 'Skin & Mucosa', iconEmoji: '🔴' },
  { id: 'pallor', name: 'Pallor (Pale skin)', category: 'Skin & Mucosa', iconEmoji: '⚪' },
  { id: 'mouth_ulcers', name: 'Mouth Ulcers / Thrush', category: 'Skin & Mucosa', iconEmoji: '👄' },
  { id: 'bleeding', name: 'Bleeding / Petechiae', category: 'Skin & Mucosa', iconEmoji: '🩸' },
  { id: 'swollen_neck', name: 'Swollen Neck Nodes', category: 'Skin & Mucosa', iconEmoji: '🧣' },
];

export const SymptomsVisualStage: React.FC<SymptomsVisualStageProps> = ({
  history,
  setHistory,
  onNextStage,
  onPrevStage,
}) => {
  const selectedList = history.selectedSymptoms || [
    'Fever',
    'Chills / Rigors',
    'Headache',
    'Vomiting',
    'Abdominal Pain',
    'Muscle Pain (Myalgia)'
  ];

  const toggleSymptom = (item: SymptomCardDef) => {
    let nextSelected: string[];
    const isAlready = selectedList.includes(item.name);

    if (isAlready) {
      nextSelected = selectedList.filter(s => s !== item.name);
    } else {
      nextSelected = [...selectedList, item.name];
    }

    // Also update typed history flags if mapped
    const updatedHistory: HistoryData = {
      ...history,
      selectedSymptoms: nextSelected,
    };

    if (item.mappingKey) {
      (updatedHistory as any)[item.mappingKey] = !isAlready;
    }

    setHistory(updatedHistory);
  };

  const categories: ('General' | 'Head & Neuro' | 'Respiratory' | 'Gastrointestinal' | 'Musculoskeletal' | 'Skin & Mucosa')[] = [
    'General',
    'Head & Neuro',
    'Respiratory',
    'Gastrointestinal',
    'Musculoskeletal',
    'Skin & Mucosa',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Visual Review of Systems (ROS) & Symptom Assessment
              </h3>
              <p className="text-xs text-slate-500">
                Click symptom cards to select/deselect. Selected symptoms feed directly into the clinical reasoning engine.
              </p>
            </div>
          </div>

          <div className="px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-900 font-bold text-xs">
            {selectedList.length} Symptoms Selected
          </div>
        </div>

        {/* Categories Sections */}
        <div className="space-y-6">
          {categories.map((cat) => {
            const catItems = SYMPTOMS_LIST.filter(s => s.category === cat);
            return (
              <div key={cat}>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <span>{cat}</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {catItems.map((item) => {
                    const isSelected = selectedList.includes(item.name);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleSymptom(item)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center select-none ${
                          isSelected
                            ? 'bg-cyan-50 border-cyan-500 text-cyan-950 shadow-xs ring-2 ring-cyan-500/20'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl mb-1.5">{item.iconEmoji}</span>
                        <span className="font-bold text-xs leading-tight">{item.name}</span>
                        {isSelected && (
                          <span className="mt-1 text-[10px] font-bold text-cyan-700 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-200">
          <button
            onClick={onPrevStage}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to History</span>
          </button>

          <button
            onClick={onNextStage}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <span>Continue to Physical Examination</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
