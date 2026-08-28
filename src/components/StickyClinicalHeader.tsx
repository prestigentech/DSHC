import React, { useState } from 'react';
import { CadreRole, FacilityLevel, DecisionSupportOutput, PatientProfile } from '../types';
import { getRoleTheme } from '../utils/theme';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Pill, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  BookOpen,
  Sparkles,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface StickyClinicalHeaderProps {
  decisionSupport: DecisionSupportOutput;
  cadre: CadreRole;
  facilityLevel: FacilityLevel;
  patient: PatientProfile;
  isAnalyzing: boolean;
  onOpenRag?: () => void;
}

export const StickyClinicalHeader: React.FC<StickyClinicalHeaderProps> = ({
  decisionSupport,
  cadre,
  facilityLevel,
  patient,
  isAnalyzing,
  onOpenRag,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showDosingQuickView, setShowDosingQuickView] = useState<boolean>(false);

  const roleTheme = getRoleTheme(cadre);
  const isSevere = decisionSupport?.isSevere || false;
  const redFlags = decisionSupport?.redFlags || [];
  const primaryTx = decisionSupport?.managementPlan?.primaryTreatment || [];
  const weight = patient.weight || 15;

  // Weight-calculated fast reference dosing
  const getAlDosing = (w: number) => {
    if (w < 5) return 'Use specialized dosing or Quinine (<5kg)';
    if (w < 15) return '1 tab (20/120mg) BD x 3 days (6 tabs total)';
    if (w < 25) return '2 tabs (20/120mg) BD x 3 days (12 tabs total)';
    if (w < 35) return '3 tabs (20/120mg) BD x 3 days (18 tabs total)';
    return '4 tabs (20/120mg) BD x 3 days (24 tabs total)';
  };

  const getParacetamolDosing = (w: number) => {
    const mg = Math.round(w * 15);
    return `${mg} mg (15 mg/kg) every 6-8 hours PRN (Max 4 doses/day)`;
  };

  const getAmoxicillinDosing = (w: number) => {
    const mgPerDose = Math.round((w * 80) / 2);
    return `${mgPerDose} mg BD for 5 days (Dispersible tablets)`;
  };

  const summaryText = decisionSupport?.cognitiveSummaryText || 
    (isSevere 
      ? `🚨 RED FLAG DETECTED: This case meets criteria for severe febrile illness. Prioritize airway, breathing, circulation, immediate parenteral stabilization, and referral.`
      : `✅ Manageable at ${facilityLevel}. Primary recommendation is Uncomplicated Malaria (P. falciparum) protocol with weight-calculated Artemether-Lumefantrine (Coartem) 20/120mg.`);

  return (
    <div className="sticky top-[49px] sm:top-[53px] z-30 w-full transition-all duration-200 shadow-md">
      {/* Primary Sticky Header Bar */}
      <div 
        className={`px-3 sm:px-5 py-2 sm:py-2.5 backdrop-blur-md border-b flex flex-wrap items-center justify-between gap-2.5 transition-colors ${
          isSevere 
            ? 'bg-rose-900/95 text-rose-50 border-rose-700 shadow-rose-950/20' 
            : 'bg-slate-900/95 text-slate-100 border-slate-700 shadow-slate-950/20'
        }`}
      >
        {/* Left: Status Icon & Core Clinical Recommendation */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {isSevere ? (
            <div className="p-1 bg-rose-500/20 text-rose-300 rounded-md shrink-0 animate-pulse">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
          ) : (
            <div className="p-1 bg-emerald-500/20 text-emerald-300 rounded-md shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-[13px] font-semibold leading-snug tracking-tight truncate sm:whitespace-normal">
              {summaryText}
            </div>
          </div>
        </div>

        {/* Right: Protocol Badges & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* AI / RAG Enrichment Indicator */}
          {isAnalyzing ? (
            <div className="hidden md:flex items-center gap-1 text-[11px] text-amber-300 font-medium px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Enriching with GHS...</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-emerald-300 font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              <span>Live CDSS Active</span>
            </div>
          )}

          {/* Protocol Badge */}
          <span className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-2xs ${
            isSevere 
              ? 'bg-rose-500 text-white' 
              : 'bg-blue-600 text-white'
          }`}>
            {cadre} Protocol
          </span>

          {/* Ghana STG Tag */}
          <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Ghana STG 7th Ed Active
          </span>

          {/* Quick Dosing Button */}
          <button
            onClick={() => setShowDosingQuickView(!showDosingQuickView)}
            className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition"
            title="Weight-calculated rapid drug dosing"
          >
            <Pill className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Dosing ({weight}kg)</span>
          </button>

          {/* Red Flags Alert Counter (if present) */}
          {redFlags.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{redFlags.length} Danger Signs</span>
            </button>
          )}

          {/* Search Guidelines */}
          {onOpenRag && (
            <button
              onClick={onOpenRag}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition"
              title="Search Ghana Guidelines Knowledge Base"
            >
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">RAG Search</span>
            </button>
          )}

          {/* Expand Details Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle clinical details"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Dosing Dropdown Tray */}
      {showDosingQuickView && (
        <div className="bg-slate-900 text-slate-100 border-b border-slate-700 p-3 sm:p-4 text-xs animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                <Pill className="w-3.5 h-3.5 text-cyan-400" />
                Weight-Calculated Dosage Reference for {patient.name || 'Patient'} ({weight} kg, {patient.age} {patient.ageUnit || 'yrs'}):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5">
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <span className="font-bold text-cyan-300 block">Artemether-Lumefantrine (AL):</span>
                  <span className="text-slate-300 text-[11px]">{getAlDosing(weight)}</span>
                </div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <span className="font-bold text-amber-300 block">Paracetamol (15 mg/kg):</span>
                  <span className="text-slate-300 text-[11px]">{getParacetamolDosing(weight)}</span>
                </div>
                <div className="p-2 rounded bg-slate-800 border border-slate-700">
                  <span className="font-bold text-emerald-300 block">Amoxicillin (80 mg/kg/day):</span>
                  <span className="text-slate-300 text-[11px]">{getAmoxicillinDosing(weight)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDosingQuickView(false)}
              className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-slate-300"
            >
              Close Quick Dosing
            </button>
          </div>
        </div>
      )}

      {/* Expanded Danger Signs & Clinical Rationale Panel */}
      {isExpanded && (
        <div className="bg-slate-900/98 text-slate-100 border-b border-slate-700 p-3 sm:p-4 text-xs space-y-2.5 animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto space-y-2">
            {redFlags.length > 0 && (
              <div>
                <span className="font-bold text-rose-300 block mb-1">
                  Identified IMNCI & GHS Danger Signs:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {redFlags.map((flag, idx) => (
                    <div key={idx} className="p-2 bg-rose-950/60 border border-rose-800/80 rounded-lg text-[11px]">
                      <span className="font-bold text-rose-200 block">{flag.sign}</span>
                      <span className="text-rose-300/80 block mt-0.5">{flag.immediateAction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {decisionSupport?.cadreSpecificAdvice && (
              <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800 flex items-start gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span><strong>{cadre} Guidance:</strong> {decisionSupport.cadreSpecificAdvice}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
