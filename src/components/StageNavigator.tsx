import React, { useState } from 'react';
import { CadreRole, DshcConsultationStep } from '../types';
import { getRoleTheme } from '../utils/theme';
import { getCadreWorkflow, ALL_CONSULTATION_STEPS_MASTER } from '../data/cadreWorkflowConfig';
import { 
  SlidersHorizontal,
  Sparkles,
  Check
} from 'lucide-react';

interface StageNavigatorProps {
  currentStage: DshcConsultationStep;
  setStage: (stage: DshcConsultationStep) => void;
  isSevere: boolean;
  cadre: CadreRole;
}

export const StageNavigator: React.FC<StageNavigatorProps> = ({
  currentStage,
  setStage,
  cadre,
}) => {
  const [showAllStages, setShowAllStages] = useState<boolean>(false);
  const roleTheme = getRoleTheme(cadre);
  const workflow = getCadreWorkflow(cadre);

  // Determine list of steps based on role filter or showAll override
  const activeStepIds = showAllStages 
    ? (Object.keys(ALL_CONSULTATION_STEPS_MASTER) as DshcConsultationStep[])
    : workflow.visibleSteps;

  const totalStepsCount = activeStepIds.length;

  return (
    <nav aria-label="Consultation Stages" className="bg-slate-100/95 border-b border-slate-200 w-full overflow-x-auto py-1.5 px-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-max">
        
        {/* Left: Role Track Badge & Step Count */}
        <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-200">
          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${workflow.trackBadgeColor} shadow-2xs`}>
            {workflow.badgeLabel}
          </span>
          <span className="text-[11px] font-semibold text-slate-600 hidden md:inline">
            ({totalStepsCount} {showAllStages ? 'All Stages' : 'Curated Stages'})
          </span>
        </div>

        {/* Middle: Render Steps */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-1 overflow-x-auto py-0.5">
          {activeStepIds.map((stepId, index) => {
            const isActive = currentStage === stepId;
            const details = workflow.stepDetails[stepId] || ALL_CONSULTATION_STEPS_MASTER[stepId];
            const Icon = details.icon || ALL_CONSULTATION_STEPS_MASTER[stepId]?.icon;
            const stepNum = showAllStages 
              ? (index + 1).toString() 
              : details.stepNumber;

            return (
              <button
                key={stepId}
                onClick={() => setStage(stepId)}
                title={`${details.label} - ${details.subtitle}`}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-semibold transition shrink-0 ${
                  isActive
                    ? 'bg-cyan-800 text-white shadow-xs font-bold ring-1 ring-cyan-900'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs'
                }`}
              >
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {stepNum}
                </span>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{details.label}</span>
                <span className="sm:hidden">{details.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Optional Workflow View Mode Toggle */}
        <div className="pl-2 border-l border-slate-200 shrink-0 flex items-center gap-1">
          <button
            onClick={() => setShowAllStages(!showAllStages)}
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
              showAllStages 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
            title="Toggle between role-tailored workflow and all 12 consultation stages"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{showAllStages ? 'Role Flow' : 'All Stages'}</span>
          </button>
        </div>

      </div>
    </nav>
  );
};
