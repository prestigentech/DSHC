import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle2, 
  Clock, 
  Ambulance, 
  Search, 
  UserPlus, 
  FolderOpen, 
  Settings, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  HelpCircle, 
  User, 
  Phone, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  Bell
} from 'lucide-react';
import { CadreRole, FacilityLevel, EncounterRecord, MainViewMode } from '../types';
import { DshcLogo } from './DshcLogo';

interface DashboardViewProps {
  cadre: CadreRole;
  facilityLevel: FacilityLevel;
  facilityName?: string;
  onStartNewConsultation: () => void;
  onNavigateToRecords: () => void;
  onNavigateToView: (view: MainViewMode) => void;
  encounters: EncounterRecord[];
  onSelectEncounter?: (enc: EncounterRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cadre,
  facilityLevel,
  facilityName = 'Begoro Health Centre',
  onStartNewConsultation,
  onNavigateToRecords,
  onNavigateToView,
  encounters,
  onSelectEncounter,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'profile' | 'settings' | 'help'>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Stats calculation
  const totalCount = encounters.length || 24;
  const completedCount = encounters.filter(e => e.status === 'completed').length || 18;
  const inProgressCount = encounters.filter(e => e.status === 'in-progress').length || 4;
  const referredCount = encounters.filter(e => e.status === 'referred').length || 2;

  const monthlyCases = [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 52 },
    { month: 'Mar', count: 38 },
    { month: 'Apr', count: 65 },
    { month: 'May', count: 78 },
    { month: 'Jun', count: 92 },
    { month: 'Jul', count: 110 },
    { month: 'Aug', count: 125 },
  ];
  const maxCount = Math.max(...monthlyCases.map(m => m.count));

  const recentActivities = [
    { time: '10 mins ago', text: 'Completed encounter for Akosua Mensah (Malaria AL prescribed)' },
    { time: '35 mins ago', text: 'Referred Kwabena Osei to Begoro District Hospital (Severe Anemia)' },
    { time: '1 hour ago', text: 'Recorded health counselling session for Ama Serwaa (Nutrition)' },
    { time: '2 hours ago', text: 'Diagnostic mRDT Pf positive verified for Kofi Boateng' },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs">
              <DshcLogo size="md" variant="icon-only" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                DSHC · GHANA HEALTH SERVICE CLINICAL WORKSPACE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Welcome back, {cadre}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {facilityName} · {facilityLevel}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onStartNewConsultation}
              className="px-5 py-2.5 bg-cyan-800 hover:bg-cyan-900 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Start New Consultation</span>
            </button>

            <button
              onClick={onNavigateToRecords}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              <span>View All Records</span>
            </button>
          </div>
        </div>

        {/* Dashboard Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'patients' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Recent Encounters ({encounters.length || 5})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Staff Profile
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Preferences & Settings
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'help' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Ghana STG FAQ & Help
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB CONTENT */}
      {activeTab === 'overview' && (
        <>
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Total Patients */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Total Consultations</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalCount}</div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +14% this month
              </span>
            </div>

            {/* Completed */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Completed & Discharged</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{completedCount}</div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Full prescription issued</span>
            </div>

            {/* In Progress */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">In Progress / Triage</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{inProgressCount}</div>
              <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Active encounters</span>
            </div>

            {/* Referred */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Referred Cases</span>
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Ambulance className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{referredCount}</div>
              <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Higher-tier hospital</span>
            </div>

          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            <div 
              onClick={onStartNewConsultation}
              className="p-4 bg-gradient-to-br from-cyan-800 to-cyan-950 text-white rounded-2xl cursor-pointer hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <UserPlus className="w-6 h-6 text-cyan-300 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm text-white">New Consultation</h4>
                <p className="text-[11px] text-cyan-200 mt-1">
                  Launch step-by-step Ghana clinical decision support workflow.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-cyan-300">
                <span>Start Now →</span>
              </div>
            </div>

            <div 
              onClick={onNavigateToRecords}
              className="p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-slate-400 hover:shadow-2xs transition flex flex-col justify-between group"
            >
              <div>
                <FolderOpen className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm text-slate-900">Encounter Records</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Access patient case history, WhatsApp sharing, and print summaries.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-slate-700">
                <span>View Database →</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('patients')}
              className="p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-slate-400 hover:shadow-2xs transition flex flex-col justify-between group"
            >
              <div>
                <Activity className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm text-slate-900">Active Patient Triage</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Review waiting queue, vitals flags, and danger sign triage.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-slate-700">
                <span>Open Triage →</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('settings')}
              className="p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-slate-400 hover:shadow-2xs transition flex flex-col justify-between group"
            >
              <div>
                <Settings className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm text-slate-900">Facility & Device Settings</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Configure HeFRA equipment inventory and display font sizes.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-slate-700">
                <span>Configure →</span>
              </div>
            </div>

          </div>

          {/* Visual Analytics & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Monthly Cases Chart (2 cols) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Monthly Patient Volume & Febrile Trends</h4>
                  <p className="text-xs text-slate-500">Facility encounter statistics for 2026</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                  Peak Rainy Season (Jun-Aug)
                </span>
              </div>

              {/* Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
                {monthlyCases.map((item, idx) => {
                  const heightPercent = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-cyan-700 hover:bg-cyan-600 rounded-t-lg transition-all shadow-xs"
                      />
                      <span className="text-[11px] font-semibold text-slate-600">{item.month}</span>
                    </div>
                  );
                })}
              </div>

              {/* Top Diagnoses Tags */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-2">
                  Top Diagnoses Breakdown:
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                  <span className="px-3 py-1 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-bold">
                    🦟 Uncomplicated Malaria (68%)
                  </span>
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 font-bold">
                    🚨 Severe Malaria (12%)
                  </span>
                  <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 font-bold">
                    🫁 Pneumonia (9%)
                  </span>
                  <span className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-xl text-purple-800 font-bold">
                    🧪 Typhoid Fever (6%)
                  </span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-slate-700">
                    Other / URTI (5%)
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed (1 col) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 text-sm">Recent Clinical Activity</h4>
                <Activity className="w-4 h-4 text-cyan-700" />
              </div>

              <div className="space-y-3.5">
                {recentActivities.map((act, idx) => (
                  <div key={idx} className="text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">{act.time}</span>
                    <p className="text-slate-800 leading-snug">{act.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* PATIENTS TAB CONTENT */}
      {activeTab === 'patients' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3 className="font-extrabold text-slate-900 text-base">
              Recent Consultations & Active Queue
            </h3>
            <button
              onClick={onNavigateToRecords}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View Full Records Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {encounters.slice(0, 6).map((enc) => {
              const pt = enc.pageStates?.patient_info || enc.pageStates?.dshc_patient_info || { name: 'Anonymous', age: 24 };
              return (
                <div
                  key={enc.id}
                  onClick={() => onSelectEncounter && onSelectEncounter(enc)}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-cyan-600 hover:shadow-xs transition cursor-pointer flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-cyan-800 font-bold flex items-center justify-center text-xs">
                      {pt.name?.[0] || 'P'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{pt.name}</h4>
                      <span className="text-[11px] text-slate-500">
                        {pt.age} yrs · ID: {enc.id.substring(0, 8)} · {new Date(enc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      enc.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : enc.status === 'referred'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {enc.status.toUpperCase()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROFILE TAB CONTENT */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs max-w-2xl mx-auto">
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-4">
            Healthcare Provider Profile
          </h3>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Provider Full Name</label>
                <input
                  type="text"
                  defaultValue="Dr. Kwame Mensah / PA Appiah"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Cadre & Role</label>
                <input
                  type="text"
                  value={cadre}
                  disabled
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl p-2.5 text-slate-600 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Facility</label>
                <input
                  type="text"
                  defaultValue={facilityName}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Facility Tier</label>
                <input
                  type="text"
                  value={facilityLevel}
                  disabled
                  className="w-full bg-slate-100 border border-slate-300 rounded-xl p-2.5 text-slate-600 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">MDC / NMC Registration PIN</label>
              <input
                type="text"
                defaultValue="MDC/P/2021/8849"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB CONTENT */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs max-w-2xl mx-auto space-y-6">
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-2">
            System Preferences & Accessibility
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Font Family & Typography</h4>
              <p className="text-slate-500 text-xs mb-3">Choose the interface typography pairing.</p>
              <select className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold">
                <option>Inter (Default Crisp Sans)</option>
                <option>Plus Jakarta Sans (Modern Clean)</option>
                <option>System Default</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Auditory & Emergency Danger Alerts</h4>
              <p className="text-slate-500 text-xs mb-3">Enable visual pulsing and sound cues for severe malaria / emergency red flags.</p>
              <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-cyan-800" />
                <span>Play audible beep and pulse banner on critical triage signs</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* HELP / FAQ TAB CONTENT */}
      {activeTab === 'help' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs max-w-3xl mx-auto space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-2">
            Ghana Standard Treatment Guidelines (7th Edition) FAQ
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                Q: Why is parasitological testing mandatory before ACT prescription?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Per WHO and Ghana National Malaria Control Programme (NMCP), up to 50% of non-malarial fevers were previously mismanaged as malaria. Testing with mRDT or microscopy preserves drug efficacy and prevents missed bacterial infections like pneumonia and sepsis.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                Q: What is the 1st line antimalarial in Ghana?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Artemether-Lumefantrine (AL) or Artesunate-Amodiaquine (AA) for uncomplicated malaria. Artemether-Lumefantrine is taken twice daily for 3 days with a fatty meal or milk for optimal bioavailability.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                Q: What are the pre-referral steps for severe malaria at CHPS/Health Centre?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Administer Rectal Artesunate (100mg for &lt;3 yrs, 200mg for 3-5 yrs) or IV/IM Artesunate 2.4 mg/kg if equipped. Give IM Paracetamol for high fever, manage hypoglycemia, and arrange immediate ambulance transfer.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
