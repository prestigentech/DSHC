import React from 'react';
import { CadreRole, DiagnosticStage } from '../types';
import { getRoleTheme } from '../utils/theme';
import { 
  Activity, 
  HelpCircle, 
  Search, 
  GitBranch, 
  FlaskConical, 
  Pill, 
  Check
} from 'lucide-react';

interface StageNavigatorProps {
  currentStage: DiagnosticStage;
  setStage: (stage: DiagnosticStage) => void;
  stageProgress: Record<DiagnosticStage, { isCompleted: boolean; count: number; hasWarning?: boolean }>;
  isSevere: boolean;
  cadre: CadreRole;
}

interface StageConfig {
  id: DiagnosticStage;
  number: number;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const STAGES: StageConfig[] = [
  {
    id: 'vitals',
    number: 1,
    label: 'Vitals & Triage',
    shortLabel: 'Vitals',
    icon: Activity,
  },
  {
    id: 'history',
    number: 2,
    label: 'History Taking',
    shortLabel: 'History',
    icon: HelpCircle,
  },
  {
    id: 'examination',
    number: 3,
    label: 'Physical Exam',
    shortLabel: 'Exam',
    icon: Search,
  },
  {
    id: 'diagnosis',
    number: 4,
    label: 'Diagnosis',
    shortLabel: 'Differentials',
    icon: GitBranch,
  },
  {
    id: 'testing',
    number: 5,
    label: 'Diagnostic Tests',
    shortLabel: 'Tests',
    icon: FlaskConical,
  },
  {
    id: 'management',
    number: 6,
    label: 'Treatment Plan',
    shortLabel: 'Treatment',
    icon: Pill,
  },
];

export const StageNavigator: React.FC<StageNavigatorProps> = ({
  currentStage,
  setStage,
  stageProgress,
  cadre,
}) => {
  const roleTheme = getRoleTheme(cadre);

  return (
    <nav aria-label="Clinical Stages" className="bg-slate-100/80 border-b border-slate-200 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2">
          {STAGES.map((stage) => {
            const isActive = currentStage === stage.id;
            const progress = stageProgress[stage.id];

            return (
              <button
                key={stage.id}
                id={`stage-nav-${stage.id}`}
                onClick={() => setStage(stage.id)}
                className={`relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border text-left transition-all min-w-0 ${
                  isActive
                    ? `bg-white ${roleTheme.primaryBorder} shadow-xs text-slate-900 ring-1 ${roleTheme.primaryBorder}`
                    : progress.isCompleted
                    ? 'bg-white/70 border-slate-200 hover:bg-white text-slate-700'
                    : 'bg-slate-100/60 border-slate-200/70 hover:bg-white/80 text-slate-500'
                }`}
              >
                {/* Step Number / Icon Badge */}
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] sm:text-xs font-bold transition-colors ${
                    isActive
                      ? `${roleTheme.primaryBg} text-white`
                      : progress.hasWarning
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : progress.isCompleted
                      ? `${roleTheme.primaryMediumBg} ${roleTheme.primaryText}`
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {progress.isCompleted && !isActive ? (
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                  ) : (
                    <span>{stage.number}</span>
                  )}
                </div>

                {/* Stage Title */}
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className={`font-semibold text-[11px] sm:text-xs truncate ${isActive ? roleTheme.primaryDarkText : 'text-slate-700'}`}>
                    <span className="hidden md:inline">{stage.label}</span>
                    <span className="md:hidden">{stage.shortLabel}</span>
                  </div>
                </div>

                {/* Warning Alert Dot */}
                {progress.hasWarning && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                )}

                {/* Active Indicator Underline */}
                {isActive && (
                  <div className={`absolute -bottom-1.5 sm:-bottom-2 left-2 right-2 h-0.5 ${roleTheme.primaryBg} rounded-full`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
