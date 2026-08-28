import React from 'react';
import { DshcConsultationStep, MainViewMode, CadreRole } from '../types';
import { DshcLogo } from './DshcLogo';
import { 
  UserPlus, 
  HeartPulse, 
  ClipboardList, 
  MessageSquare, 
  FileText, 
  Brain, 
  Stethoscope, 
  FlaskConical, 
  Microchip, 
  Pill, 
  Ambulance, 
  LayoutDashboard, 
  FolderOpen, 
  Settings, 
  UserCheck, 
  HelpCircle, 
  ShieldCheck, 
  X,
  Building2,
  Sparkles
} from 'lucide-react';

interface DshcSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: MainViewMode;
  onSelectView: (view: MainViewMode) => void;
  currentStep: DshcConsultationStep;
  onSelectStep: (step: DshcConsultationStep) => void;
  cadre: CadreRole;
  facilityName?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const DshcSidebar: React.FC<DshcSidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  onSelectView,
  currentStep,
  onSelectStep,
  cadre,
  facilityName = 'Health Centre (Sub-District)',
}) => {
  const isConsultation = currentView === 'consultation';

  const handleStepClick = (step: DshcConsultationStep) => {
    onSelectView('consultation');
    onSelectStep(step);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleViewClick = (view: MainViewMode) => {
    onSelectView(view);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl lg:shadow-none`}
      >
        {/* Brand Logo Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div 
            onClick={() => handleViewClick('dashboard')}
            className="cursor-pointer hover:opacity-90 transition"
            title="DSHC - Decision Support in Healthcare"
          >
            <DshcLogo size="sm" variant="full" showSubtitle={true} />
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cadre & Facility Quick Badge */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 text-xs flex items-center justify-between">
          <div className="truncate">
            <span className="font-bold text-slate-800 block truncate">{cadre}</span>
            <span className="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <Building2 className="w-3 h-3 text-cyan-700" /> {facilityName}
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          
          {/* Section 1: Clinical Consultation Steps */}
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Patient Consultation
          </div>

          {/* Step 1: Patient Info */}
          <button
            onClick={() => handleStepClick('patientData')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
              isConsultation && currentStep === 'patientData'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserPlus className="w-4 h-4" />
              <span>Patient Info</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isConsultation && currentStep === 'patientData' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>1</span>
          </button>

          {/* Step 2: Vitals */}
          <button
            onClick={() => handleStepClick('vitals')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
              isConsultation && currentStep === 'vitals'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HeartPulse className="w-4 h-4" />
              <span>Vitals & Triage</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isConsultation && currentStep === 'vitals' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>2</span>
          </button>

          {/* Step 3: Plan of Care */}
          <button
            onClick={() => handleStepClick('planOfCare')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
              isConsultation && currentStep === 'planOfCare'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-4 h-4" />
              <span>Plan of Care</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isConsultation && currentStep === 'planOfCare' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>3</span>
          </button>

          {/* Sub-Step 3a: Counselling */}
          <div className="pl-6">
            <button
              onClick={() => handleStepClick('counselling')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                isConsultation && currentStep === 'counselling'
                  ? 'bg-cyan-800 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400">↳</span>
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Counselling</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                isConsultation && currentStep === 'counselling' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>3a</span>
            </button>
          </div>

          <div className="pt-1.5 pb-0.5 px-3">
            <div className="border-t border-slate-200/80 my-1" />
          </div>

          {/* Step 4: History Taking */}
          <button
            onClick={() => handleStepClick('history')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
              isConsultation && currentStep === 'history'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>History Taking</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isConsultation && currentStep === 'history' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>4</span>
          </button>

          {/* Sub-Step 4a: Symptoms (ROS) */}
          <div className="pl-6">
            <button
              onClick={() => handleStepClick('symptoms')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                isConsultation && currentStep === 'symptoms'
                  ? 'bg-cyan-800 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400">↳</span>
                <Brain className="w-3.5 h-3.5" />
                <span>Symptoms (ROS)</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                isConsultation && currentStep === 'symptoms' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>4a</span>
            </button>
          </div>

          {/* Step 5: Examination */}
          <button
            onClick={() => handleStepClick('examination')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
              isConsultation && currentStep === 'examination'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Stethoscope className="w-4 h-4" />
              <span>Examination</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isConsultation && currentStep === 'examination' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>5</span>
          </button>

          {/* Step 6: Differential DX */}
          <button
            onClick={() => handleStepClick('diagnosis')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
              isConsultation && currentStep === 'diagnosis'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Brain className="w-4 h-4" />
              <span>Differential DX</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isConsultation && currentStep === 'diagnosis' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>6</span>
          </button>

          {/* Step 7: Testing */}
          <button
            onClick={() => handleStepClick('testing')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
              isConsultation && currentStep === 'testing'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FlaskConical className="w-4 h-4" />
              <span>Testing</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isConsultation && currentStep === 'testing' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>7</span>
          </button>

          {/* Step 8: Test Results */}
          <button
            onClick={() => handleStepClick('testResults')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
              isConsultation && currentStep === 'testResults'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Microchip className="w-4 h-4" />
              <span>Test Results</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isConsultation && currentStep === 'testResults' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>8</span>
          </button>

          {/* Step 9: Treatment Plan */}
          <button
            onClick={() => handleStepClick('treatmentplan')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
              isConsultation && currentStep === 'treatmentplan'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Pill className="w-4 h-4" />
              <span>Treatment Plan</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isConsultation && currentStep === 'treatmentplan' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>9</span>
          </button>

          {/* Step 10: Referral */}
          <button
            onClick={() => handleStepClick('referral')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
              isConsultation && currentStep === 'referral'
                ? 'bg-cyan-800 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Ambulance className="w-4 h-4" />
              <span>Referral Form (GHS)</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isConsultation && currentStep === 'referral' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>10</span>
          </button>

          {/* Section: Architecture & Intelligence */}
          <div className="pt-2 pb-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-cyan-800">
            HCI & Adaptive Engine
          </div>

          {/* RAG-Based Adaptive UI Architecture */}
          <button
            onClick={() => handleViewClick('adaptiveArchitecture')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition ${
              currentView === 'adaptiveArchitecture'
                ? 'bg-gradient-to-r from-cyan-800 to-sky-900 text-white shadow-xs'
                : 'text-slate-800 bg-cyan-50/50 hover:bg-cyan-100/70 border border-cyan-200/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>Adaptive UI Architecture</span>
            </div>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
              currentView === 'adaptiveArchitecture' ? 'bg-white/20 text-white' : 'bg-cyan-200/70 text-cyan-900'
            }`}>
              6-LAYER
            </span>
          </button>

          <div className="pt-2 pb-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            System & Records
          </div>

          {/* Dashboard View */}
          <button
            onClick={() => handleViewClick('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
              currentView === 'dashboard'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            <span>Clinical Dashboard</span>
          </button>

          {/* Patient Records */}
          <button
            onClick={() => handleViewClick('records')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
              currentView === 'records'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-emerald-600" />
            <span>Encounter Records</span>
          </button>

          {/* Profile Details */}
          <button
            onClick={() => handleViewClick('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
              currentView === 'profile'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4 text-purple-600" />
            <span>Provider Profile</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => handleViewClick('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
              currentView === 'settings'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings & Fonts</span>
          </button>

          {/* Help / FAQ */}
          <button
            onClick={() => handleViewClick('help')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
              currentView === 'help'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Help Center</span>
          </button>

          {/* Privacy Policy */}
          <button
            onClick={() => handleViewClick('privacy')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
              currentView === 'privacy'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Privacy Policy</span>
          </button>

          {/* Admin & Knowledge Base Portal */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleViewClick('admin')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>Admin & Knowledge Base</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 font-semibold">
                SUPERVISOR
              </span>
            </button>
          </div>
        </nav>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 text-[11px] text-slate-500 bg-slate-50 flex items-center justify-between">
          <span>DSHC · Ghana CDSS</span>
          <span className="font-semibold text-slate-700">v2.6</span>
        </div>
      </aside>
    </>
  );
};
