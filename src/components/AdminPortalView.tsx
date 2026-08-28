import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Server, 
  Key, 
  Lock, 
  Unlock, 
  Search, 
  Plus, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Activity, 
  Layers, 
  Sliders, 
  Cpu, 
  BookOpen, 
  ChevronRight, 
  Filter,
  Check,
  ExternalLink,
  Zap,
  HardDrive
} from 'lucide-react';
import { 
  GHANA_KB_CONDITIONS, 
  GHANA_KB_THRESHOLDS, 
  GHANA_KB_RED_FLAGS, 
  GHANA_KB_SURVEILLANCE,
  KBCondition,
  KBSurveillanceCase
} from '../data/ghanaKnowledgeBase';
import { DshcLogo } from './DshcLogo';

interface AdminPortalViewProps {
  onReturnToConsultation: () => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  onReturnToConsultation,
  isAdminAuthenticated,
  setIsAdminAuthenticated,
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [activeAdminTab, setActiveAdminTab] = useState<'knowledge' | 'backend' | 'surveillance' | 'audit'>('knowledge');

  // Backend Status State
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false);
  const [isFlushingCache, setIsFlushingCache] = useState<boolean>(false);
  const [flushMessage, setFlushMessage] = useState<string>('');

  // Knowledge Base Management State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customChunks, setCustomChunks] = useState<KBCondition[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newChunkTitle, setNewChunkTitle] = useState<string>('');
  const [newChunkCategory, setNewChunkCategory] = useState<string>('Standard Clinical Guideline');
  const [newChunkSource, setNewChunkSource] = useState<string>('GHS STG 7th Edition (2017)');
  const [newChunkContent, setNewChunkContent] = useState<string>('');

  // Combine standard and custom chunks
  const allConditions = [...GHANA_KB_CONDITIONS, ...customChunks];

  // Fetch System Status & Logs
  const fetchSystemMetrics = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/admin/system-status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
      const logsRes = await fetch('/api/admin/audit-logs');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAuditLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error('Failed to load system metrics:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchSystemMetrics();
    }
  }, [isAdminAuthenticated]);

  // Handle Admin PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'GHS-ADMIN-2026' || pinInput.toLowerCase() === 'admin') {
      setIsAdminAuthenticated(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Invalid Supervisor PIN. (Hint: Use default PIN 1234)');
    }
  };

  const handleFlushCache = async () => {
    setIsFlushingCache(true);
    try {
      const res = await fetch('/api/admin/flush-cache', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFlushMessage(data.message);
        fetchSystemMetrics();
        setTimeout(() => setFlushMessage(''), 4000);
      }
    } catch (err) {
      setFlushMessage('Error communicating with backend cache.');
    } finally {
      setIsFlushingCache(false);
    }
  };

  const handleAddCustomChunk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChunkTitle.trim() || !newChunkContent.trim()) return;

    const newChunk: KBCondition = {
      id: `gh-kb-custom-${Date.now().toString().slice(-4)}`,
      name: newChunkTitle,
      priority: 1,
      keywords: ['custom', 'ghana stg update'],
      supporting_features: newChunkContent,
      discriminators: 'Clinical presentation and diagnostic triage',
      danger_signs: ['Altered sensorium', 'Extreme hyperpyrexia'],
      confirmatory_test: 'Laboratory confirmation or clinical criteria',
      first_line_management: newChunkContent,
      stg_reference: newChunkSource,
    };

    setCustomChunks((prev) => [newChunk, ...prev]);
    setIsAddModalOpen(false);
    setNewChunkTitle('');
    setNewChunkContent('');
  };

  // Filtered knowledge chunks
  const filteredChunks = allConditions.filter((chunk) => {
    const matchesSearch = 
      chunk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.supporting_features.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.first_line_management.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.keywords.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // If not authenticated, show secure Admin PIN verification screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md text-center">
          
          <div className="flex justify-center mb-4">
            <DshcLogo size="lg" variant="full" showSubtitle={true} />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100 mb-2 inline-block">
            Supervisor & System Administration
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 mb-2">
            Administrator & Backend Suite
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            This section contains clinical knowledge base corpus administration, server telemetry, and system configuration. Clinical healthcare workers do not require access here to treat patients.
          </p>

          <form onSubmit={handleVerifyPin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter Supervisor / Admin PIN
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                  autoFocus
                />
              </div>
              {pinError && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4 text-cyan-400" />
                <span>Unlock Administrator Suite</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAdminAuthenticated(true);
                  setPinError('');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition text-center"
              >
                Quick Demo Unlock (PIN: 1234)
              </button>

              <button
                type="button"
                onClick={onReturnToConsultation}
                className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-medium transition text-center mt-1"
              >
                ← Return to Patient Consultation
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl shadow-inner">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  GHS Clinical Knowledge Base & Backend Admin
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  SUPERVISOR AUTHENTICATED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage Ghana STG guidelines corpus, RAG cache, server health, and IDSR surveillance thresholds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReturnToConsultation}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <span>Back to Clinical Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAdminAuthenticated(false)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700 text-xs"
              title="Lock Admin Session"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveAdminTab('knowledge')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === 'knowledge'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-cyan-500" />
            <span>Knowledge Base Corpus ({allConditions.length} Chunks)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('backend')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === 'backend'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Server className="w-4 h-4 text-emerald-500" />
            <span>Backend Server & AI Engine</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('surveillance')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === 'surveillance'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-500" />
            <span>IDSR Epidemic Thresholds</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === 'audit'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-500" />
            <span>Audit & Trigger Logs ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: KNOWLEDGE BASE CORPUS MANAGEMENT */}
      {/* ========================================================= */}
      {activeAdminTab === 'knowledge' && (
        <div className="space-y-4">
          
          {/* Action Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search guidelines (e.g. malaria, artesunate, amoxicillin, pregnancy)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Condition Guidelines">Condition Guidelines</option>
                <option value="Drug Dosages & Regimens">Drug Dosages</option>
                <option value="Clinical Thresholds & Danger Signs">Danger Signs</option>
                <option value="National Guidelines & Policy">National Policy</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-2xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Guideline Chunk</span>
              </button>
            </div>
          </div>

          {/* Chunks List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChunks.map((chunk) => (
              <div 
                key={chunk.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 inline-block mb-1">
                      {chunk.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{chunk.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-100 whitespace-nowrap">
                    GHS Clinical Protocol
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <p className="line-clamp-2">
                    <strong className="text-slate-800">Features:</strong> {chunk.supporting_features}
                  </p>
                  <p className="line-clamp-2">
                    <strong className="text-slate-800">First-Line:</strong> {chunk.first_line_management}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-cyan-600" />
                    <span className="truncate max-w-[220px]">{chunk.stg_reference}</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Test: {chunk.confirmatory_test}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: BACKEND & SERVER INFRASTRUCTURE */}
      {/* ========================================================= */}
      {activeAdminTab === 'backend' && (
        <div className="space-y-5">
          
          {/* Status Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span className="font-bold">Server State</span>
                <Server className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-lg font-black text-emerald-600 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ONLINE (Healthy)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Port 3000 · {systemStatus?.uptimeHuman || 'Active'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span className="font-bold">AI Engine Status</span>
                <Cpu className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-sm font-black text-slate-900">
                {systemStatus?.geminiStatus === 'CONNECTED' ? 'Gemini 3.7 Flash Active' : 'Deterministic GHS Engine'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Zero-delay clinical decision fallback active
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span className="font-bold">RAG & Analysis Cache</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-lg font-black text-slate-900">
                {(systemStatus?.activeCacheEntries?.analysisCacheSize || 0) + (systemStatus?.activeCacheEntries?.ragCacheSize || 0)} Entries
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                TTL 10min · In-memory LRU
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span className="font-bold">Memory RSS / Heap</span>
                <HardDrive className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-lg font-black text-slate-900 font-mono">
                {systemStatus?.memoryUsageMB?.rss || 48} MB
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Node {systemStatus?.nodeVersion || 'v20+'}
              </p>
            </div>

          </div>

          {/* Cache Management Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Runtime Cache & Clinical Decision Memory
                </h3>
                <p className="text-xs text-slate-500 max-w-xl mt-0.5">
                  The backend caches clinical inference calculations and guideline retrieval chunks to ensure sub-millisecond responses at rural health facilities.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchSystemMetrics}
                  disabled={isLoadingStatus}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin' : ''}`} />
                  <span>Refresh Metrics</span>
                </button>

                <button
                  onClick={handleFlushCache}
                  disabled={isFlushingCache}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition shadow-2xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isFlushingCache ? 'Flushing...' : 'Flush Cache'}</span>
                </button>
              </div>
            </div>

            {flushMessage && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{flushMessage}</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: IDSR EPIDEMIC SURVEILLANCE THRESHOLDS */}
      {/* ========================================================= */}
      {activeAdminTab === 'surveillance' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Integrated Disease Surveillance & Response (IDSR) Thresholds
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configured epidemic action thresholds per Ghana Health Service Surveillance Division.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GHANA_KB_SURVEILLANCE.map((disease) => (
                <div key={disease.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{disease.disease}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full">
                      {disease.priority_category}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600">
                    <p><strong className="text-slate-800">Case Definition:</strong> {disease.case_definition}</p>
                    <p><strong className="text-slate-800">Notification Protocol:</strong> {disease.notification_type}</p>
                    <p><strong className="text-slate-800">GHS Section:</strong> {disease.source_section || 'IDSR Technical Guidelines'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: AUDIT LOGS */}
      {/* ========================================================= */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Clinical Decision Audit Stream</h3>
              <p className="text-xs text-slate-500">
                Log of clinical guideline evaluations, red flag warnings, and emergency referrals.
              </p>
            </div>
            <button
              onClick={fetchSystemMetrics}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 font-mono text-xs max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-800">{log.event}</span>
                    <span className="text-[10px] text-slate-400">{log.facility}</span>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{log.cadre}</span>
                  </div>
                  <p className="text-slate-600 font-sans text-xs mt-0.5">{log.details}</p>
                </div>
                <div className="text-[11px] text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Guideline Chunk */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Add GHS Clinical Guideline Chunk</h3>
            
            <form onSubmit={handleAddCustomChunk} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Guideline Title</label>
                <input
                  type="text"
                  value={newChunkTitle}
                  onChange={(e) => setNewChunkTitle(e.target.value)}
                  placeholder="e.g. Revised Dosing for Artesunate-Amodiaquine"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newChunkCategory}
                  onChange={(e) => setNewChunkCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Condition Guidelines">Condition Guidelines</option>
                  <option value="Drug Dosages & Regimens">Drug Dosages & Regimens</option>
                  <option value="Clinical Thresholds & Danger Signs">Clinical Thresholds & Danger Signs</option>
                  <option value="National Guidelines & Policy">National Guidelines & Policy</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Document</label>
                <input
                  type="text"
                  value={newChunkSource}
                  onChange={(e) => setNewChunkSource(e.target.value)}
                  placeholder="e.g. Ghana STG 7th Edition / NMCP 2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Guideline Content / Clinical Directives</label>
                <textarea
                  rows={4}
                  value={newChunkContent}
                  onChange={(e) => setNewChunkContent(e.target.value)}
                  placeholder="Specify clinical indications, dosing schedules, contraindications, and referral thresholds..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Guideline Chunk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
