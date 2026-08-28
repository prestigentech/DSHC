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
  Pill,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Clock
} from 'lucide-react';

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

const QUICK_CLINICAL_QUESTIONS = [
  'Artemether-Lumefantrine dosage by weight',
  'Severe malaria pre-referral steps at CHPS / Health Centre',
  'Malaria treatment in 1st trimester pregnancy',
  'IMNCI fast-breathing thresholds for under-5s',
  'Diagnosis & first-line treatment for Enteric (Typhoid) fever',
  'When to give IV Ceftriaxone for suspected meningitis',
];

export const GhanaRagDrawer: React.FC<GhanaRagDrawerProps> = ({
  isOpen,
  onClose,
  cadre,
}) => {
  const roleTheme = getRoleTheme(cadre);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your **Ghana Health Service (GHS) Clinical Treatment Assistant**, grounded in the Standard Treatment Guidelines (STG 7th Edition), IMNCI Protocols, Ghana Essential Medicines List (EML), and National Malaria Elimination Programme (NMEP) directives.\n\nAsk any question regarding febrile illness management, pediatric dosing calculations, danger sign criteria, or emergency stabilization.`,
      source: 'GHS Standard Treatment Guidelines (7th Edition)',
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
            source: data.source === 'gemini-ai' ? 'Ghana STG + Gemini Guidelines Assistant' : 'Ghana STG Clinical Engine',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Unable to retrieve guideline reference at this moment. Please consult your printed Ghana STG manual.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Network error communicating with guideline service. Please verify device connectivity.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${roleTheme.primaryIconBg}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>GHS Clinical Guidelines Quick Reference</span>
                <span className={`text-[10px] ${roleTheme.primaryBadge} font-mono`}>
                  STG 7th Ed
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Official Clinical Treatment Protocols for {cadre}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
            aria-label="Close guidelines drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Question Chips for Clinician */}
        <div className="p-3 bg-white border-b border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Common Clinical Queries
          </span>
          <div className="flex gap-1.5 overflow-x-auto text-[11px] pb-1 no-scrollbar">
            {QUICK_CLINICAL_QUESTIONS.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(question)}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-cyan-800 px-2.5 py-1 rounded-full shrink-0 border border-slate-200 font-medium transition shadow-2xs whitespace-nowrap"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Chat / Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-4 leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? `${roleTheme.primaryBg} text-white rounded-br-none shadow-xs font-medium`
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                }`}
              >
                {msg.content}
              </div>
              {msg.source && (
                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <FileCheck className="w-3 h-3 text-emerald-600" /> {msg.source}
                </span>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-600 text-xs bg-white p-3.5 rounded-2xl border border-slate-200 w-fit shadow-xs">
              <Loader2 className={`w-4 h-4 ${roleTheme.primaryText} animate-spin`} />
              <span className="font-medium">Searching Ghana STG & NMEP protocols...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200">
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
              placeholder="Ask a clinical dosage or protocol question..."
              className={`flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className={`p-2.5 ${roleTheme.btnPrimary} text-white rounded-xl shadow-xs disabled:opacity-50 transition`}
              aria-label="Send clinical inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
            <span>Ghana Standard Treatment Guidelines · 7th Edition</span>
            <span>Pediatric & Adult Protocols</span>
          </div>
        </div>

      </div>
    </div>
  );
};
