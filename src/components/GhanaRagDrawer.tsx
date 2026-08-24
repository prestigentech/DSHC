import React, { useState } from 'react';
import { CadreRole } from '../types';
import { getRoleTheme } from '../utils/theme';
import { 
  X, 
  BookOpen, 
  Send, 
  Search, 
  Loader2,
  FileCheck,
  AlertTriangle,
  Activity,
  Pill,
  ShieldAlert,
  FileText,
  BookmarkCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  GHANA_KB_CONDITIONS, 
  GHANA_KB_THRESHOLDS, 
  GHANA_KB_RED_FLAGS, 
  GHANA_KB_SURVEILLANCE 
} from '../data/ghanaKnowledgeBase';

interface GhanaRagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cadre: CadreRole;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
}

const QUICK_PROMPTS = [
  'What is the Ghana STG dosage for Artemether-Lumefantrine by weight?',
  'How to treat malaria in 1st trimester pregnancy in Ghana?',
  'What are the pre-referral steps for severe malaria at CHPS?',
  'What are the IMNCI fast breathing thresholds for under-5 children?',
  'When should IV Ceftriaxone be given for suspected meningitis in Ghana?',
  'What is the diagnosis criteria for Enteric (Typhoid) fever?',
];

export const GhanaRagDrawer: React.FC<GhanaRagDrawerProps> = ({
  isOpen,
  onClose,
  cadre,
}) => {
  const roleTheme = getRoleTheme(cadre);
  const [activeTab, setActiveTab] = useState<'consult' | 'kb-browse'>('consult');
  const [kbFilter, setKbFilter] = useState<'all' | 'conditions' | 'thresholds' | 'red_flags' | 'surveillance'>('all');
  const [kbSearchTerm, setKbSearchTerm] = useState('');
  const [expandedCondition, setExpandedCondition] = useState<string | null>('malaria');

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your **Ghana Health Service (GHS) Guidelines & Knowledge Base Assistant**, grounded in the Standard Treatment Guidelines (STG 7th Edition 2017), IMNCI Protocols, Ghana EML, and IDSR Technical Guidelines.\n\nAsk any question regarding febrile disease management, pediatric dosages, danger sign criteria, or pre-referral stabilization in Ghana. You can also switch to the **Guidelines Knowledge Base** tab to browse verified clinical chunks directly.`,
      source: 'GHS STG Database',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/rag-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, cadre }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.answer,
            source: data.source === 'gemini-ai' ? 'Gemini 3.7 Flash + GHS RAG' : 'GHS Rule Engine',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Unable to retrieve guidance at this moment. Please refer to your printed Ghana STG manual.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Network error communicating with guideline server. Please verify connectivity.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConditions = GHANA_KB_CONDITIONS.filter((c) => {
    if (!kbSearchTerm) return true;
    const term = kbSearchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.keywords.some((kw) => kw.toLowerCase().includes(term)) ||
      c.supporting_features.toLowerCase().includes(term) ||
      c.first_line_management.toLowerCase().includes(term)
    );
  });

  const filteredSurveillance = GHANA_KB_SURVEILLANCE.filter((s) => {
    if (!kbSearchTerm) return true;
    const term = kbSearchTerm.toLowerCase();
    return (
      s.disease.toLowerCase().includes(term) ||
      s.case_definition.toLowerCase().includes(term) ||
      s.keywords.some((kw) => kw.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-2xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${roleTheme.primaryIconBg}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>GHS Clinical Guidelines & Knowledge Base</span>
                <span className={`text-[10px] ${roleTheme.primaryBadge} font-mono`}>
                  STG 2017
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Official Treatment Protocols, IDSR Surveillance & EML Registry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('consult')}
            className={`pb-2.5 px-3 font-semibold flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'consult'
                ? `border-emerald-600 ${roleTheme.primaryText}`
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Consultation & AI RAG</span>
          </button>
          <button
            onClick={() => setActiveTab('kb-browse')}
            className={`pb-2.5 px-3 font-semibold flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'kb-browse'
                ? `border-emerald-600 ${roleTheme.primaryText}`
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Knowledge Base Chunks ({GHANA_KB_CONDITIONS.length} conditions)</span>
          </button>
        </div>

        {/* Tab 1: AI RAG & Guidance Consultation */}
        {activeTab === 'consult' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
            {/* Quick Topic Chips */}
            <div className="p-3 bg-white border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
              {QUICK_PROMPTS.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-emerald-700 px-2.5 py-1 rounded-full shrink-0 border border-slate-200 font-medium transition shadow-2xs"
                >
                  {prompt.length > 38 ? prompt.slice(0, 38) + '...' : prompt}
                </button>
              ))}
            </div>

            {/* Chat / Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? `${roleTheme.primaryBg} text-white rounded-br-none shadow-xs font-medium`
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.source && (
                    <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                      <FileCheck className="w-3 h-3 text-emerald-600" /> Grounded in {msg.source}
                    </span>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-slate-600 text-xs bg-white p-3 rounded-lg border border-slate-200 w-fit shadow-xs">
                  <Loader2 className={`w-4 h-4 ${roleTheme.primaryText} animate-spin`} />
                  <span className="font-medium">Retrieving Ghana STG guidance...</span>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask a clinical question about Ghana guidelines..."
                  className={`flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputQuery.trim()}
                  className={`${roleTheme.btnPrimary} disabled:opacity-50 text-white p-2 rounded-lg transition shadow-xs`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Knowledge Base Direct Browser */}
        {activeTab === 'kb-browse' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
            {/* Search & Filter Bar */}
            <div className="p-3 bg-white border-b border-slate-200 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={kbSearchTerm}
                  onChange={(e) => setKbSearchTerm(e.target.value)}
                  placeholder="Search guidelines by condition, medicine, or sign..."
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                <button
                  onClick={() => setKbFilter('all')}
                  className={`px-2.5 py-0.5 rounded-full border transition font-medium ${
                    kbFilter === 'all'
                      ? `${roleTheme.primaryBadge} font-bold`
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  All ({GHANA_KB_CONDITIONS.length + GHANA_KB_THRESHOLDS.length + GHANA_KB_SURVEILLANCE.length})
                </button>
                <button
                  onClick={() => setKbFilter('conditions')}
                  className={`px-2.5 py-0.5 rounded-full border transition font-medium ${
                    kbFilter === 'conditions'
                      ? `${roleTheme.primaryBadge} font-bold`
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  Conditions ({GHANA_KB_CONDITIONS.length})
                </button>
                <button
                  onClick={() => setKbFilter('thresholds')}
                  className={`px-2.5 py-0.5 rounded-full border transition font-medium ${
                    kbFilter === 'thresholds'
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  Vitals & Thresholds ({GHANA_KB_THRESHOLDS.length})
                </button>
                <button
                  onClick={() => setKbFilter('red_flags')}
                  className={`px-2.5 py-0.5 rounded-full border transition font-medium ${
                    kbFilter === 'red_flags'
                      ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  Red Flags ({GHANA_KB_RED_FLAGS.length})
                </button>
                <button
                  onClick={() => setKbFilter('surveillance')}
                  className={`px-2.5 py-0.5 rounded-full border transition font-medium ${
                    kbFilter === 'surveillance'
                      ? 'bg-blue-100 text-blue-900 border-blue-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  IDSR Surveillance ({GHANA_KB_SURVEILLANCE.length})
                </button>
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Conditions Section */}
              {(kbFilter === 'all' || kbFilter === 'conditions') && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Clinical Conditions (Ghana STG 2017)</span>
                  </div>

                  {filteredConditions.map((cond) => {
                    const isExpanded = expandedCondition === cond.id;
                    return (
                      <div
                        key={cond.id}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
                      >
                        <div
                          onClick={() =>
                            setExpandedCondition(isExpanded ? null : cond.id)
                          }
                          className="p-3 bg-white hover:bg-slate-50 cursor-pointer flex items-center justify-between transition border-b border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {cond.name}
                            </span>
                            <span className={`text-[10px] ${roleTheme.primaryBadge} font-mono`}>
                              Priority {cond.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-semibold">
                              {cond.stg_reference.split('—')[1]?.trim() || 'STG 2017'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-3.5 space-y-3 bg-slate-50/70 border-t border-slate-100 text-xs">
                            {/* Recognition */}
                            <div>
                              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                                1. Recognition & Clinical Features:
                              </span>
                              <p className="text-slate-700 mt-0.5 leading-relaxed">
                                {cond.supporting_features}
                              </p>
                              {cond.discriminators && (
                                <p className="text-slate-600 mt-1 italic text-[11px]">
                                  <strong>Clinical Pearl:</strong> {cond.discriminators}
                                </p>
                              )}
                            </div>

                            {/* Danger Signs */}
                            {cond.danger_signs && cond.danger_signs.length > 0 && (
                              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                                <span className="text-[11px] font-bold text-rose-900 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                  Severe Danger Signs (Urgent Stabilisation & Transfer):
                                </span>
                                <ul className="mt-1 space-y-1 text-rose-800 text-[11px] list-disc list-inside font-medium">
                                  {cond.danger_signs.map((sign, idx) => (
                                    <li key={idx}>{sign}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Confirmatory Testing */}
                            <div>
                              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                                2. Confirmatory Testing & Investigations:
                              </span>
                              <p className="text-slate-700 mt-0.5 leading-relaxed">
                                {cond.confirmatory_test}
                              </p>
                            </div>

                            {/* First-line Management */}
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                              <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                                3. First-Line Management & Dosages (Ghana EML):
                              </span>
                              <p className="text-emerald-950 mt-1 leading-relaxed text-[11px] font-medium">
                                {cond.first_line_management}
                              </p>

                              {cond.medicines_cited && cond.medicines_cited.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {cond.medicines_cited.map((med, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] bg-white text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded capitalize font-medium"
                                    >
                                      {med}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Source Provenance */}
                            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between items-center font-medium">
                              <span>Reference: {cond.stg_reference}</span>
                              {cond.source_page && (
                                <span>PDF Page: {cond.source_page.join(', ')}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Vitals & Clinical Thresholds */}
              {(kbFilter === 'all' || kbFilter === 'thresholds') && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5 text-amber-600" />
                    <span>Clinical Vital Thresholds (Ghana STG & IMNCI)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {GHANA_KB_THRESHOLDS.map((th) => (
                      <div
                        key={th.id}
                        className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-xs">
                            {th.label}
                          </span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                            {th.rule}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{th.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Red Flags */}
              {(kbFilter === 'all' || kbFilter === 'red_flags') && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Systemic Emergency Red Flags</span>
                  </div>
                  <div className="space-y-2">
                    {GHANA_KB_RED_FLAGS.map((rf) => (
                      <div
                        key={rf.id}
                        className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 space-y-1 shadow-2xs"
                      >
                        <div className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>{rf.label}</span>
                        </div>
                        <p className="text-rose-800 text-[11px]">
                          <strong>Action:</strong> {rf.action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IDSR Surveillance Case Definitions */}
              {(kbFilter === 'all' || kbFilter === 'surveillance') && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider">
                    <BookmarkCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>IDSR Disease Surveillance Case Definitions</span>
                  </div>
                  <div className="space-y-2">
                    {filteredSurveillance.map((sc) => (
                      <div
                        key={sc.id}
                        className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">
                            {sc.disease}
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 font-semibold px-2 py-0.5 rounded">
                            {sc.notification_type}
                          </span>
                        </div>
                        <p className="text-slate-700 text-[11px] leading-relaxed">
                          {sc.case_definition}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 font-medium">
                          <span>Category: {sc.priority_category}</span>
                          <span>Source: {sc.document_id} (p.{sc.source_page?.join(', ')})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
