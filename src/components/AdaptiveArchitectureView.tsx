import React, { useState, useMemo } from 'react';
import {
  CadreRole,
  FacilityLevel,
  DshcConsultationStep,
  UserContextLayerState,
  HTATaskNode,
  DecisionRequirementEntry,
  SemanticRetrievalResult,
  DynamicUISpecification,
  AdaptiveFeedbackMetrics
} from '../types';
import {
  HTA_WORKFLOW_MODELS,
  DECISION_REQUIREMENTS_TABLES,
  retrieveAdaptiveKnowledge,
  generateAdaptiveUISpecification,
  INITIAL_ADAPTIVE_METRICS
} from '../data/adaptiveArchitectureData';
import { CadreHtaVisualizer } from './CadreHtaVisualizer';
import {
  Layers,
  Cpu,
  Database,
  Search,
  Layout,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Stethoscope,
  UserCheck,
  Building2,
  Activity,
  Pill,
  Baby,
  ShieldAlert,
  Sliders,
  Code,
  FileText,
  Clock,
  HeartPulse,
  BrainCircuit,
  Workflow
} from 'lucide-react';

interface AdaptiveArchitectureViewProps {
  onReturnToConsultation: () => void;
  activeRole: CadreRole;
  setActiveRole: (role: CadreRole) => void;
  facilityLevel: FacilityLevel;
  setFacilityLevel: (level: FacilityLevel) => void;
}

export const AdaptiveArchitectureView: React.FC<AdaptiveArchitectureViewProps> = ({
  onReturnToConsultation,
  activeRole,
  setActiveRole,
  facilityLevel,
  setFacilityLevel,
}) => {
  // Navigation tabs for the 6-Layer Architecture
  const [activeTab, setActiveTab] = useState<
    'pipeline' | 'hta' | 'drm' | 'retrieval' | 'generation' | 'interface' | 'feedback'
  >('pipeline');

  // Simulator Context State (Layer 1)
  const [simRole, setSimRole] = useState<CadreRole>(activeRole);
  const [simExperience, setSimExperience] = useState<'Novice' | 'Mid-level' | 'Expert'>('Mid-level');
  const [simTask, setSimTask] = useState<DshcConsultationStep>('vitals');
  const [simAcuity, setSimAcuity] = useState<'NORMAL' | 'URGENT' | 'CRITICAL_EMERGENCY'>('NORMAL');
  const [simAgeGroup, setSimAgeGroup] = useState<'Neonate' | 'Infant' | 'ChildUnder5' | 'Adolescent' | 'Adult' | 'Elderly'>('ChildUnder5');
  const [simIsPregnant, setSimIsPregnant] = useState<boolean>(false);
  const [simHasSickleCell, setSimHasSickleCell] = useState<boolean>(false);
  const [simFacility, setSimFacility] = useState<FacilityLevel>(facilityLevel);
  const [simDangerSigns, setSimDangerSigns] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected HTA Task for inspection
  const [selectedHtaId, setSelectedHtaId] = useState<string>('HTA-1.0');
  const [selectedDrmCategory, setSelectedDrmCategory] = useState<string>('all');

  // Assemble the User Context State
  const userContext: UserContextLayerState = useMemo(() => {
    return {
      role: simRole,
      clinicalExperience: simExperience,
      currentTask: simTask,
      patientCondition: {
        acuity: simAcuity,
        ageGroup: simAgeGroup,
        isPregnant: simIsPregnant,
        hasComorbidities: simHasSickleCell,
        comorbidityLabels: simHasSickleCell ? ['Sickle Cell Disease (HbSS)'] : [],
        feverState: simAcuity === 'CRITICAL_EMERGENCY' ? 'Hyperpyrexia' : 'ModerateFever',
        dangerSignsPresent: simDangerSigns,
      },
      facilityCharacteristics: {
        facilityLevel: simFacility,
        hasElectricity: true,
        hasColdChain: true,
        hasMicroscopy: simFacility === 'District Hospital' || simFacility === 'Regional/Teaching Hospital',
        hasPocRdt: true,
        hasOxygen: simFacility !== 'CHPS Compound',
        hasIvArtesunate: simFacility !== 'CHPS Compound' && simFacility !== 'Community Pharmacy',
        referralDistanceKm: simFacility === 'CHPS Compound' ? 24 : 8,
        resourceTier: simFacility === 'CHPS Compound' ? 'CHPS' : simFacility === 'Health Centre' ? 'PrimaryHealthCentre' : 'DistrictHospital',
      },
    };
  }, [simRole, simExperience, simTask, simAcuity, simAgeGroup, simIsPregnant, simHasSickleCell, simFacility, simDangerSigns]);

  // Semantic Retrieval results (Layer 3)
  const retrievalResults = useMemo(() => {
    return retrieveAdaptiveKnowledge(userContext, searchQuery);
  }, [userContext, searchQuery]);

  // Generated UI Specification (Layer 4 & 5)
  const dynamicUiSpec: DynamicUISpecification = useMemo(() => {
    return generateAdaptiveUISpecification(userContext);
  }, [userContext]);

  // Sync simulator role with main app role when toggled
  const handleApplyToConsultation = () => {
    setActiveRole(simRole);
    setFacilityLevel(simFacility);
    onReturnToConsultation();
  };

  const toggleDangerSign = (sign: string) => {
    setSimDangerSigns((prev) => {
      const exists = prev.includes(sign);
      const updated = exists ? prev.filter((s) => s !== sign) : [...prev, sign];
      if (updated.length > 0) setSimAcuity('CRITICAL_EMERGENCY');
      else setSimAcuity('NORMAL');
      return updated;
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-sky-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-cyan-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BrainCircuit className="w-80 h-80 text-cyan-200" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Human-Computer Interaction (HCI) Framework
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-100">
              6-Layer Architecture
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              GHS Febrile CDSS
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 font-serif">
            Proposed RAG-Based Adaptive UI Architecture
          </h1>

          <p className="text-sm sm:text-base text-cyan-100/90 leading-relaxed mb-6 font-sans">
            A cognitive-adaptive decision support architecture that captures multi-dimensional clinical context, 
            queries a vectorized knowledge base (HTA models, Decision Requirements, and Ghana STG guidelines), 
            and uses Claude/Gemini reasoning to dynamically synthesize role-tailored interfaces for Ghanaian healthcare cadres.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleApplyToConsultation}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <Stethoscope className="w-4 h-4" />
              Apply Current Context to Consultation
            </button>
            <button
              onClick={onReturnToConsultation}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              Back to Patient Workspace
            </button>
          </div>
        </div>
      </div>

      {/* 6-Layer Architecture Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-[760px]">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pipeline'
                ? 'bg-cyan-700 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            1. Pipeline Visualizer
          </button>

          <button
            onClick={() => setActiveTab('hta')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'hta'
                ? 'bg-cyan-700 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Workflow className="w-4 h-4" />
            2. HTA Workflows
          </button>

          <button
            onClick={() => setActiveTab('drm')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'drm'
                ? 'bg-cyan-700 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            3. Decision Requirements
          </button>

          <button
            onClick={() => setActiveTab('retrieval')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'retrieval'
                ? 'bg-cyan-700 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            4. Retrieval Layer (RAG)
          </button>

          <button
            onClick={() => setActiveTab('generation')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'generation'
                ? 'bg-cyan-700 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            5. Generation Engine
          </button>

          <button
            onClick={() => setActiveTab('interface')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'interface'
                ? 'bg-cyan-700 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layout className="w-4 h-4" />
            6. Adaptive UI Output
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'feedback'
                ? 'bg-cyan-700 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            7. Feedback & Learning
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 6-LAYER ARCHITECTURAL PIPELINE VISUALIZER & CONTEXT SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Architecture Concept Map */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {[
              {
                num: '1',
                title: 'User Context Layer',
                desc: 'Captures role, experience, task, patient acuity, and facility HeFRA tier.',
                icon: UserCheck,
                color: 'bg-blue-50 border-blue-200 text-blue-900',
                badge: 'Input State',
              },
              {
                num: '2',
                title: 'Knowledge Repository',
                desc: 'HTA models, Decision Requirements tables, Ghana STG 7th Ed, and adaptation rules.',
                icon: Database,
                color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
                badge: 'Grounding Base',
              },
              {
                num: '3',
                title: 'Retrieval Layer',
                desc: 'Semantic similarity matching and context vector ranking.',
                icon: Search,
                color: 'bg-amber-50 border-amber-200 text-amber-900',
                badge: 'Vector Match',
              },
              {
                num: '4',
                title: 'Claude/Gemini Engine',
                desc: 'Reasoning and dynamic UI layout specification generation.',
                icon: Cpu,
                color: 'bg-purple-50 border-purple-200 text-purple-900',
                badge: 'AI Reasoning',
              },
              {
                num: '5',
                title: 'Adaptive Interface Layer',
                desc: 'Executes role-specific dashboards, diagnostic panels, and alert banners.',
                icon: Layout,
                color: 'bg-cyan-50 border-cyan-200 text-cyan-900',
                badge: 'Executable UI',
              },
              {
                num: '6',
                title: 'Feedback & Learning',
                desc: 'Monitors interactions, clinician overrides, and refines adaptation rules.',
                icon: BarChart3,
                color: 'bg-rose-50 border-rose-200 text-rose-900',
                badge: 'Continuous Loop',
              },
            ].map((layer, idx) => {
              const IconComp = layer.icon;
              return (
                <div
                  key={layer.num}
                  className={`p-4 rounded-xl border ${layer.color} relative flex flex-col justify-between shadow-sm transition-all hover:shadow-md`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {layer.num}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/70">
                        {layer.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <IconComp className="w-4 h-4 opacity-80" />
                      <h4 className="font-bold text-xs">{layer.title}</h4>
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed">{layer.desc}</p>
                  </div>
                  {idx < 5 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 bg-white rounded-full p-0.5 shadow-xs" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Context Layer Controls (Layer 1 Simulator) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Layer 1: User Context Vector Simulator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjust variables below to see the entire RAG pipeline and interface adapt in real time.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Vector: [{simRole}, {simExperience}, {simAcuity}, {simFacility}]
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Variable 1: Healthcare Professional Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-700" />
                  Healthcare Professional Role
                </label>
                <select
                  value={simRole}
                  onChange={(e) => setSimRole(e.target.value as CadreRole)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                >
                  <option value="Doctor">Medical Doctor (Hospital / OPD)</option>
                  <option value="Physician Assistant">Physician Assistant (Health Centre / Clinic)</option>
                  <option value="General Nurse">General / Staff Nurse (Ward & Triage)</option>
                  <option value="Community Health Nurse">Community Health Nurse (CHPS Zone)</option>
                  <option value="Pharmacist">Pharmacist / Dispenser (Pharmacy)</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  Governs decision autonomy, prescription limits & layout depth.
                </p>
              </div>

              {/* Variable 2: Clinical Experience */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-purple-700" />
                  Clinical Experience Level
                </label>
                <select
                  value={simExperience}
                  onChange={(e) => setSimExperience(e.target.value as any)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                >
                  <option value="Novice">Novice / Intern (High guidance & tooltips)</option>
                  <option value="Mid-level">Mid-Level / Experienced (Balanced flow)</option>
                  <option value="Expert">Expert / Specialist (High-density telemetry)</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  Adjusts cognitive scaffolding and progressive disclosure.
                </p>
              </div>

              {/* Variable 3: Healthcare Facility Tier */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  Healthcare Facility Tier
                </label>
                <select
                  value={simFacility}
                  onChange={(e) => setSimFacility(e.target.value as FacilityLevel)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                >
                  <option value="CHPS Compound">CHPS Compound (Rural outreach)</option>
                  <option value="Health Centre">Health Centre (Sub-district)</option>
                  <option value="Clinic">Private / Polyclinic</option>
                  <option value="District Hospital">District Hospital (Secondary tier)</option>
                  <option value="Regional/Teaching Hospital">Regional / Teaching Hospital</option>
                  <option value="Community Pharmacy">Community Pharmacy</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  Filters diagnostic tests, medications & referral pathways.
                </p>
              </div>

              {/* Variable 4: Patient Acuity & Danger Signs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-700" />
                  Patient Acuity State
                </label>
                <select
                  value={simAcuity}
                  onChange={(e) => setSimAcuity(e.target.value as any)}
                  className={`w-full text-xs font-bold rounded-lg px-3 py-2 focus:ring-2 border ${
                    simAcuity === 'CRITICAL_EMERGENCY'
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : simAcuity === 'URGENT'
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                >
                  <option value="NORMAL">Normal Presentation (Uncomplicated)</option>
                  <option value="URGENT">Urgent / High Fever (Close observation)</option>
                  <option value="CRITICAL_EMERGENCY">Critical Emergency (Danger Signs)</option>
                </select>
                <p className="text-[10px] text-slate-500">
                  Triggers emergency pre-referral stabilization lock.
                </p>
              </div>
            </div>

            {/* Sub-Context: Vulnerability & IMNCI Danger Signs */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-600 mr-1">Vulnerability Flags:</span>
                <button
                  type="button"
                  onClick={() => setSimAgeGroup(simAgeGroup === 'ChildUnder5' ? 'Adult' : 'ChildUnder5')}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                    simAgeGroup === 'ChildUnder5'
                      ? 'bg-cyan-100 border-cyan-300 text-cyan-800'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <Baby className="w-3 h-3 inline mr-1" />
                  Child Under 5
                </button>

                <button
                  type="button"
                  onClick={() => setSimIsPregnant(!simIsPregnant)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                    simIsPregnant
                      ? 'bg-purple-100 border-purple-300 text-purple-800'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  Pregnant (1st Trimester)
                </button>

                <button
                  type="button"
                  onClick={() => setSimHasSickleCell(!simHasSickleCell)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                    simHasSickleCell
                      ? 'bg-rose-100 border-rose-300 text-rose-800'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  Sickle Cell Disease (HbSS)
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600 mr-1">IMNCI Danger Signs:</span>
                {['Convulsions', 'Vomiting Everything', 'Lethargy/Coma', 'Cannot Drink'].map((sign) => {
                  const active = simDangerSigns.includes(sign);
                  return (
                    <button
                      key={sign}
                      type="button"
                      onClick={() => toggleDangerSign(sign)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                        active
                          ? 'bg-rose-600 border-rose-700 text-white shadow-xs'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-rose-50'
                      }`}
                    >
                      <ShieldAlert className="w-3 h-3 inline mr-1" />
                      {sign}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Pipeline Output Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Retrieval & Grounding Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Layer 3: Top Retrieved Knowledge Chunks
                  </h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  {retrievalResults.length} Chunks Matched
                </span>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {retrievalResults.slice(0, 4).map((chunk) => (
                  <div
                    key={chunk.chunkId}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{chunk.title}</span>
                      <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Sim: {(chunk.similarityScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px] line-clamp-2">
                      {chunk.content}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <span className="font-mono">{chunk.chunkId}</span>
                      <span>•</span>
                      <span className="text-cyan-700">{chunk.relevanceRationale}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dynamic UI Specification Synthesis */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Layer 4 & 5: Synthesized Dynamic UI Layout
                  </h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                  {dynamicUiSpec.layoutArchetype}
                </span>
              </div>

              <div className="space-y-3">
                {/* Active Alerts */}
                {dynamicUiSpec.activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-3 animate-pulse"
                  >
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold">{alert.message}</p>
                    </div>
                  </div>
                ))}

                {/* Synthesized Components */}
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {dynamicUiSpec.components.map((comp) => (
                    <div
                      key={comp.componentId}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        comp.visualWeight === 'CRITICAL_ALARM'
                          ? 'bg-rose-50/50 border-rose-300 text-rose-900'
                          : 'bg-cyan-50/50 border-cyan-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Layout className="w-3.5 h-3.5 text-cyan-700" />
                          {comp.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-700 border">
                          Priority #{comp.priorityOrder}
                        </span>
                      </div>

                      <p className="font-medium text-[11px] text-slate-700">
                        {comp.dynamicContent.headline}
                      </p>

                      <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-600">
                        {comp.dynamicContent.actionableDirectives.slice(0, 2).map((dir, i) => (
                          <li key={i} className="line-clamp-1">
                            {dir}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HIERARCHICAL TASK ANALYSIS (HTA) WORKFLOW EXPLORER */}
      {/* ========================================================================= */}
      {activeTab === 'hta' && (
        <div className="space-y-8">
          {/* Main Cadre-Specific HTA Visualizer */}
          <CadreHtaVisualizer
            initialCadre={
              simRole === 'Doctor'
                ? 'doctor'
                : simRole === 'General Nurse'
                ? 'general_nurse'
                : simRole === 'Community Health Nurse'
                ? 'chn'
                : simRole === 'Pharmacist'
                ? 'pharmacist'
                : 'physician_assistant'
            }
            onSelectRoleForConsultation={(selectedRole) => {
              setActiveRole(selectedRole);
              setSimRole(selectedRole);
              onReturnToConsultation();
            }}
          />

          {/* Secondary Task Decomposition Explorer */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Underlying HTA Task Decomposition Models
                </h3>
                <p className="text-xs text-slate-500">
                  Granular task sequencing, decision criteria, and cognitive load allocations derived from clinical HCI studies.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold">
                7 Core Sub-Models
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Task List */}
              <div className="space-y-2">
                {HTA_WORKFLOW_MODELS.map((task) => {
                  const isSelected = task.id === selectedHtaId;
                  return (
                    <button
                      key={task.id}
                      onClick={() => setSelectedHtaId(task.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-cyan-700 text-white border-cyan-800 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-cyan-800 text-cyan-100' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {task.taskNumber}
                        </span>
                        <span className={`text-[10px] font-semibold ${
                          isSelected ? 'text-cyan-200' : 'text-slate-500'
                        }`}>
                          {task.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs line-clamp-1">{task.name}</h4>
                    </button>
                  );
                })}
              </div>

              {/* Right Task Details & Subtasks */}
              <div className="lg:col-span-2">
                {(() => {
                  const task = HTA_WORKFLOW_MODELS.find((t) => t.id === selectedHtaId) || HTA_WORKFLOW_MODELS[0];
                  return (
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-5">
                      <div className="border-b border-slate-200 pb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                            Task {task.taskNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{task.category}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">{task.name}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{task.description}</p>
                      </div>

                      {/* Decision Points */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <BrainCircuit className="w-3.5 h-3.5 text-purple-700" />
                          Key Clinical Decision Points
                        </h4>
                        <ul className="space-y-1.5">
                          {task.decisionCriteria.map((crit, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                              <span className="text-purple-600 font-bold font-mono">D{idx + 1}.</span>
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Subtasks & Adaptation Opportunities */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Workflow className="w-3.5 h-3.5 text-cyan-700" />
                          Subtasks & UI Adaptation Opportunities
                        </h4>
                        <div className="space-y-2.5">
                          {task.subtasks.map((sub) => (
                            <div key={sub.id} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-slate-900">{sub.id}: {sub.title}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  sub.cognitiveLoad === 'High'
                                    ? 'bg-rose-100 text-rose-800'
                                    : sub.cognitiveLoad === 'Medium'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  Load: {sub.cognitiveLoad}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600">{sub.description}</p>
                              <div className="text-[11px] bg-cyan-50 p-2 rounded text-cyan-900 border border-cyan-100">
                                <strong>Adaptation Strategy:</strong> {sub.adaptationOpportunity}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Role Allocations */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          Cadre Permissions & Scope Matrix
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(task.rolePermissions).map(([r, perm]) => (
                            <span
                              key={r}
                              className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                                perm === 'Primary'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : perm === 'Secondary'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-slate-100 text-slate-500 border-slate-200 line-through'
                              }`}
                            >
                              {r}: {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DECISION REQUIREMENTS MODELLING (DRM) MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'drm' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Decision Requirements Tables (DRM Matrix)
                </h3>
                <p className="text-xs text-slate-500">
                  Mappings of Clinical Tasks, Information Needs, User Roles, Contextual Factors, and UI Adaptation Triggers.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Filter Role:</span>
                <select
                  value={selectedDrmCategory}
                  onChange={(e) => setSelectedDrmCategory(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
                >
                  <option value="all">All Healthcare Roles</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Physician Assistant">Physician Assistant</option>
                  <option value="General Nurse">General Nurse</option>
                  <option value="Community Health Nurse">Community Health Nurse</option>
                  <option value="Pharmacist">Pharmacist</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {DECISION_REQUIREMENTS_TABLES
                .filter((drm) => selectedDrmCategory === 'all' || drm.userRoles.includes(selectedDrmCategory as CadreRole))
                .map((drm) => (
                  <div
                    key={drm.id}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 hover:border-cyan-300 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                          {drm.id}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{drm.clinicalTask}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {drm.userRoles.map((r) => (
                          <span key={r} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Col 1: Information Needs */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                          Information Needs:
                        </span>
                        <ul className="space-y-1 text-slate-600 list-disc list-inside">
                          {drm.informationNeeds.map((need, i) => (
                            <li key={i}>{need}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Col 2: Contextual Triggers */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                          Adaptation Triggers:
                        </span>
                        <ul className="space-y-1 text-rose-700 list-disc list-inside">
                          {drm.adaptationTriggers.map((trig, i) => (
                            <li key={i}>{trig}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Col 3: UI Output Strategy */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                          UI Adaptation Output Strategy:
                        </span>
                        <div className="p-3 bg-white rounded-lg border border-cyan-200 text-cyan-950 text-[11px] leading-relaxed">
                          {drm.uiOutputStrategy}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: RETRIEVAL LAYER (RAG SIMULATION) */}
      {/* ========================================================================= */}
      {activeTab === 'retrieval' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Retrieval Layer (Multi-Factor Semantic Search)
                </h3>
                <p className="text-xs text-slate-500">
                  Matches the multi-dimensional Context Vector against indexed HTA nodes, Decision Requirements, and Ghana STGs.
                </p>
              </div>
              <div className="w-full sm:w-72">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clinical embeddings..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Context Vector representation */}
            <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span>Active Context Query Vector</span>
                <span className="text-cyan-400">Cosine Similarity Matching Active</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div><span className="text-slate-500">Role:</span> {userContext.role}</div>
                <div><span className="text-slate-500">Experience:</span> {userContext.clinicalExperience}</div>
                <div><span className="text-slate-500">Acuity:</span> {userContext.patientCondition.acuity}</div>
                <div><span className="text-slate-500">Facility:</span> {userContext.facilityCharacteristics.facilityLevel}</div>
              </div>
            </div>

            {/* Retrieved Ranked Results */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Ranked Retrieved Knowledge Chunks ({retrievalResults.length})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {retrievalResults.map((chunk) => (
                  <div
                    key={chunk.chunkId}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 hover:border-cyan-400 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{chunk.title}</span>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Score: {(chunk.similarityScore * 100).toFixed(0)}%
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-[11px]">{chunk.content}</p>

                    <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border">{chunk.chunkId}</span>
                      <span className="text-cyan-700 font-medium">{chunk.relevanceRationale}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: GENERATION ENGINE (CLAUDE / REASONING LAYER) */}
      {/* ========================================================================= */}
      {activeTab === 'generation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Generation & Reasoning Layer (Claude / Gemini Engine)
                </h3>
                <p className="text-xs text-slate-500">
                  Synthesizes retrieved knowledge and user context into an executable Dynamic UI Specification contract.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                Engine: {dynamicUiSpec.generatorEngine}
              </span>
            </div>

            {/* Generated Specification JSON Preview */}
            <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[460px]">
              <pre>{JSON.stringify(dynamicUiSpec, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: ADAPTIVE INTERFACE LAYER (EXECUTABLE PREVIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'interface' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Layer 5: Adaptive Executable Interface
                </h3>
                <p className="text-xs text-slate-500">
                  Live rendering of generated components tailored for {simRole} at {simFacility}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleApplyToConsultation}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-700 text-white font-bold text-xs hover:bg-cyan-600 transition-all"
                >
                  Apply & Open in Patient Flow
                </button>
              </div>
            </div>

            {/* Live Component Renderings */}
            <div className="grid grid-cols-12 gap-5">
              {dynamicUiSpec.components.map((comp) => (
                <div
                  key={comp.componentId}
                  className={`${comp.layoutGridSpan} p-5 rounded-2xl border ${
                    comp.visualWeight === 'CRITICAL_ALARM'
                      ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-900 shadow-xs'
                  } space-y-4`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                      <h4 className="font-bold text-sm text-slate-900">{comp.title}</h4>
                    </div>
                    {comp.dynamicContent.customBadge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                        {comp.dynamicContent.customBadge}
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-xs text-slate-800">
                    {comp.dynamicContent.headline}
                  </p>

                  <ul className="space-y-2 text-xs">
                    {comp.dynamicContent.actionableDirectives.map((dir, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{dir}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex flex-wrap items-center justify-between">
                    <span>Citations: {comp.dynamicContent.guidelineCitations.join(', ')}</span>
                    <span className="font-mono">Priority #{comp.priorityOrder}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: FEEDBACK & LEARNING LAYER TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-serif">
                Layer 6: Continuous Feedback & Learning Telemetry
              </h3>
              <p className="text-xs text-slate-500">
                User interaction logging, guideline acceptance rate, and continuous adaptation refinement metrics.
              </p>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Guideline Acceptance
                </span>
                <p className="text-2xl font-bold text-emerald-900 mt-1">
                  {INITIAL_ADAPTIVE_METRICS.guidelineAcceptanceRate}%
                </p>
                <p className="text-[10px] text-emerald-700 mt-0.5">Clinician agreement with recommendations</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  Time Reduction
                </span>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {INITIAL_ADAPTIVE_METRICS.averageTimeReductionPercent}%
                </p>
                <p className="text-[10px] text-blue-700 mt-0.5">Faster decision throughput vs standard static UI</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                  Cognitive Load Score
                </span>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {INITIAL_ADAPTIVE_METRICS.cognitiveLoadRatingAverage} / 5.0
                </p>
                <p className="text-[10px] text-purple-700 mt-0.5">Clinician usability & clarity evaluation</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Total Encounters Logged
                </span>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {INITIAL_ADAPTIVE_METRICS.totalInteractionsLogged.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">Active Ghana primary care sessions</p>
              </div>
            </div>

            {/* Role Acceptance Breakdown */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Cadre-Specific Guideline Adherence Rates
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {Object.entries(INITIAL_ADAPTIVE_METRICS.roleAcceptanceRates).map(([role, rate]) => (
                  <div key={role} className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                    <span className="text-xs font-semibold text-slate-700 block truncate">{role}</span>
                    <span className="text-base font-bold text-cyan-800 mt-0.5 block">{rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
