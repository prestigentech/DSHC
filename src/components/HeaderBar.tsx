import React from 'react';
import { CadreRole, ClinicalExpertise, FacilityLevel } from '../types';
import { CASE_PRESETS } from '../data/casePresets';
import { getRoleTheme } from '../utils/theme';
import { 
  Building2, 
  Stethoscope, 
  Clock, 
  BookOpen, 
  Sliders, 
  RotateCcw,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

interface HeaderBarProps {
  cadre: CadreRole;
  setCadre: (cadre: CadreRole) => void;
  facilityLevel: FacilityLevel;
  setFacilityLevel: (level: FacilityLevel) => void;
  expertise: ClinicalExpertise;
  setExpertise: (exp: ClinicalExpertise) => void;
  timePressure: boolean;
  setTimePressure: (tp: boolean) => void;
  onOpenInventory: () => void;
  onOpenRagSearch: () => void;
  onLoadPreset: (presetId: string) => void;
  onResetCase: () => void;
  hasRedFlags: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  cadre,
  setCadre,
  facilityLevel,
  setFacilityLevel,
  timePressure,
  setTimePressure,
  onOpenInventory,
  onOpenRagSearch,
  onLoadPreset,
  onResetCase,
  hasRedFlags,
}) => {
  const roleTheme = getRoleTheme(cadre);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 w-full shadow-xs">
      {/* Dynamic Role-Accent Top Stripe */}
      <div className={`h-1 w-full ${roleTheme.primaryBg} transition-colors duration-300`} />

      {/* Top Primary Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand & Preset Section */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            {/* Logo with dynamic role color */}
            <div className={`w-8 h-8 rounded-lg ${roleTheme.primaryBg} flex items-center justify-center font-bold text-white shadow-xs text-xs sm:text-sm shrink-0 transition-colors duration-300`}>
              GH
            </div>
            
            {/* Title & Badge */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight whitespace-nowrap truncate">
                  Ghana CDSS
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border hidden sm:inline-block whitespace-nowrap ${roleTheme.primaryBadge}`}>
                  {roleTheme.title}
                </span>
              </div>
              <p className="text-slate-500 text-[10px] sm:text-[11px] hidden lg:block truncate">
                Ghana Health Service Standard Treatment Guidelines (7th Ed)
              </p>
            </div>

            {/* Quick Case Benchmark Preset */}
            <div className="relative hidden md:block max-w-[150px] lg:max-w-[190px]">
              <select
                id="case-preset-select"
                onChange={(e) => {
                  if (e.target.value) {
                    onLoadPreset(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                aria-label="Load preset clinical case"
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer font-medium truncate"
              >
                <option value="" disabled>Load Case Preset...</option>
                {CASE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop/Tablet Direct Controls (Visible on lg+) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Cadre Selector */}
            <div className="relative flex items-center">
              <span className={`absolute left-2.5 pointer-events-none ${roleTheme.primaryText}`}>
                <Stethoscope className="w-3.5 h-3.5" />
              </span>
              <select
                id="cadre-select-lg"
                value={cadre}
                onChange={(e) => setCadre(e.target.value as CadreRole)}
                aria-label="Clinician cadre role"
                className={`bg-white ${roleTheme.primaryText} font-bold text-xs rounded-lg pl-7 pr-3 py-1.5 border ${roleTheme.primaryLightBorder} shadow-xs focus:ring-2 ${roleTheme.primaryRing} focus:outline-none cursor-pointer transition-colors`}
              >
                <option value="Doctor">Doctor / MO</option>
                <option value="Physician Assistant">Physician Assistant</option>
                <option value="General Nurse">General Nurse</option>
                <option value="Community Health Nurse">CHN (Community)</option>
                <option value="Pharmacist">Pharmacist</option>
              </select>
            </div>

            {/* Facility Tier */}
            <div className="relative flex items-center">
              <span className="absolute left-2.5 pointer-events-none text-slate-500">
                <Building2 className="w-3.5 h-3.5" />
              </span>
              <select
                id="facility-level-select-lg"
                value={facilityLevel}
                onChange={(e) => setFacilityLevel(e.target.value as FacilityLevel)}
                aria-label="Facility level tier"
                className="bg-white text-slate-700 font-semibold text-xs rounded-lg pl-7 pr-3 py-1.5 border border-slate-200 shadow-xs focus:ring-1 focus:ring-slate-400 focus:outline-none cursor-pointer"
              >
                <option value="District Hospital">Hospital (District / General)</option>
                <option value="Regional/Teaching Hospital">Regional / Teaching Hospital</option>
                <option value="Health Centre">Health Centre (Sub-District)</option>
                <option value="Clinic">Clinic (Primary Care)</option>
                <option value="Maternity Home">Maternity Home</option>
                <option value="CHPS Compound">CHPS Compound</option>
                <option value="Community Pharmacy">Community Pharmacy</option>
              </select>
            </div>

            {/* Workload / Triage Mode Toggle */}
            <button
              id="toggle-time-pressure-btn-lg"
              onClick={() => setTimePressure(!timePressure)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border whitespace-nowrap shadow-xs ${
                timePressure
                  ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-400 animate-pulse'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle between standard comprehensive evaluation and rapid triage mode"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timePressure ? 'Rapid Triage' : 'Standard'}</span>
            </button>
          </div>

          {/* Action Buttons (Always accessible on right side) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Guidelines Assistant Drawer Button */}
            <button
              id="open-rag-search-btn"
              onClick={onOpenRagSearch}
              className={`flex items-center gap-1.5 ${roleTheme.btnPrimary} px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs`}
              title="Ask Ghana STG Guidelines Assistant"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">GHS Guidelines</span>
            </button>

            {/* Facility Inventory Button */}
            <button
              id="open-facility-inventory-btn"
              onClick={onOpenInventory}
              className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs transition border border-slate-200 shadow-xs"
              title="Facility Resources & Drug Stock"
              aria-label="Facility Resources and Drug Stock"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Reset Case Button */}
            <button
              id="reset-case-btn"
              onClick={onResetCase}
              className="p-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg text-xs transition border border-slate-200 hover:border-rose-200 shadow-xs"
              title="Start new patient consultation"
              aria-label="Start new patient consultation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsive Secondary Context Bar (Active on mobile and tablets < lg) */}
        <div className="lg:hidden mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {/* Cadre Selector Mobile */}
          <div className="relative flex items-center min-w-0">
            <span className={`absolute left-2 pointer-events-none ${roleTheme.primaryText}`}>
              <Stethoscope className="w-3 h-3" />
            </span>
            <select
              id="cadre-select-mobile"
              value={cadre}
              onChange={(e) => setCadre(e.target.value as CadreRole)}
              aria-label="Clinician cadre role"
              className={`w-full bg-white ${roleTheme.primaryText} font-bold text-[11px] sm:text-xs rounded-lg pl-6 pr-2 py-1.5 border ${roleTheme.primaryLightBorder} focus:ring-1 focus:outline-none cursor-pointer truncate shadow-xs`}
            >
              <option value="Doctor">Doctor / MO</option>
              <option value="Physician Assistant">Physician Assistant</option>
              <option value="General Nurse">General Nurse</option>
              <option value="Community Health Nurse">CHN (Community)</option>
              <option value="Pharmacist">Pharmacist</option>
            </select>
          </div>

          {/* Facility Tier Mobile */}
          <div className="relative flex items-center min-w-0">
            <span className="absolute left-2 pointer-events-none text-slate-500">
              <Building2 className="w-3 h-3" />
            </span>
            <select
              id="facility-level-select-mobile"
              value={facilityLevel}
              onChange={(e) => setFacilityLevel(e.target.value as FacilityLevel)}
              aria-label="Facility level tier"
              className="w-full bg-white text-slate-700 font-semibold text-[11px] sm:text-xs rounded-lg pl-6 pr-2 py-1.5 border border-slate-200 focus:ring-1 focus:outline-none cursor-pointer truncate shadow-xs"
            >
              <option value="District Hospital">Hospital</option>
              <option value="Regional/Teaching Hospital">Regional Hosp</option>
              <option value="Health Centre">Health Centre</option>
              <option value="Clinic">Clinic</option>
              <option value="Maternity Home">Maternity Home</option>
              <option value="CHPS Compound">CHPS</option>
              <option value="Community Pharmacy">Pharmacy</option>
            </select>
          </div>

          {/* Mode Toggle Mobile */}
          <button
            id="toggle-time-pressure-btn-mobile"
            onClick={() => setTimePressure(!timePressure)}
            className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition border truncate shadow-xs ${
              timePressure
                ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-400 animate-pulse'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle between standard comprehensive evaluation and rapid triage mode"
          >
            <Clock className="w-3 h-3 shrink-0" />
            <span className="truncate">{timePressure ? 'Triage Mode' : 'Standard'}</span>
          </button>

          {/* Preset Selector Mobile */}
          <div className="relative flex items-center min-w-0">
            <span className="absolute left-2 pointer-events-none text-slate-400">
              <FolderOpen className="w-3 h-3" />
            </span>
            <select
              id="case-preset-select-mobile"
              onChange={(e) => {
                if (e.target.value) {
                  onLoadPreset(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              aria-label="Load preset clinical case"
              className="w-full bg-white text-slate-700 text-[11px] sm:text-xs rounded-lg pl-6 pr-2 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer font-medium truncate shadow-xs"
            >
              <option value="" disabled>Presets...</option>
              {CASE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Emergency Red Flag Notice Strip (Only visible when active red flags exist) */}
      {hasRedFlags && (
        <div className="bg-rose-50 text-rose-800 px-3 sm:px-4 py-1.5 border-t border-rose-200 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
            <span className="truncate sm:whitespace-normal">CRITICAL: High-risk danger signs or vital abnormalities detected — immediate action required.</span>
          </div>
        </div>
      )}
    </header>
  );
};
