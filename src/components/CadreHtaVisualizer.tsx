import React, { useState } from 'react';
import { CadreRole, FacilityLevel } from '../types';
import { CADRE_HTA_TREES, HTA_CADRE_COMPARISON_MATRIX } from '../data/cadreHtaTreesData';
import {
  GitBranch,
  Stethoscope,
  UserCheck,
  Building2,
  Pill,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Split,
  Table,
  Layers,
  Thermometer,
  ShieldAlert,
  Clock,
  Eye,
  FileText,
  Activity,
  Workflow
} from 'lucide-react';

interface CadreHtaVisualizerProps {
  initialCadre?: 'doctor' | 'general_nurse' | 'chn' | 'pharmacist' | 'physician_assistant';
  onSelectRoleForConsultation?: (role: CadreRole) => void;
}

export const CadreHtaVisualizer: React.FC<CadreHtaVisualizerProps> = ({
  initialCadre = 'doctor',
  onSelectRoleForConsultation,
}) => {
  const [selectedCadreKey, setSelectedCadreKey] = useState<
    'doctor' | 'general_nurse' | 'chn' | 'pharmacist' | 'physician_assistant'
  >(initialCadre);

  const [activeSubView, setActiveSubView] = useState<'tree_diagram' | 'step_pathway' | 'comparison_matrix'>('tree_diagram');
  const [selectedNodeCode, setSelectedNodeCode] = useState<string | null>(null);
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
  });

  const activeTree = CADRE_HTA_TREES[selectedCadreKey];

  const toggleBranch = (stepNumber: string) => {
    setExpandedBranches((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const cadreTabs = [
    { key: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { key: 'general_nurse', label: 'General Nurse', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { key: 'chn', label: 'Community Health Nurse', icon: Building2, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { key: 'pharmacist', label: 'Pharmacist', icon: Pill, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { key: 'physician_assistant', label: 'Physician Assistant', icon: Activity, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                Hierarchical Task Analysis (HTA)
              </span>
              <span className="text-xs font-semibold text-slate-500">
                GHS Febrile Illness CDSS Diagnostic Models
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Cadre-Specific Workflow & Decision Decomposition
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl mt-1 leading-relaxed">
              Task sequences, decision points, and information inputs tailored to the distinct diagnostic scopes of Ghanaian healthcare cadres.
            </p>
          </div>

          {/* Sub-view switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveSubView('tree_diagram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubView === 'tree_diagram'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-cyan-600" />
              HTA Tree Diagram
            </button>
            <button
              onClick={() => setActiveSubView('step_pathway')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubView === 'step_pathway'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Step-by-Step Explorer
            </button>
            <button
              onClick={() => setActiveSubView('comparison_matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeSubView === 'comparison_matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-purple-600" />
              Comparative Matrix
            </button>
          </div>
        </div>

        {/* Cadre Selection Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {cadreTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedCadreKey === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setSelectedCadreKey(tab.key as any);
                    setSelectedNodeCode(null);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/10'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {onSelectRoleForConsultation && (
            <button
              onClick={() => onSelectRoleForConsultation(activeTree.role)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Apply {activeTree.role} to CDSS
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: HTA TREE DIAGRAM (Graphical Tree View) */}
      {/* ========================================================================= */}
      {activeSubView === 'tree_diagram' && (
        <div className="space-y-6">
          {/* Cadre Meta Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                  <span>{activeTree.title}</span>
                  <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {activeTree.practiceSetting}
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Autonomy Tier:</span>
                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                  {activeTree.decisionAutonomy}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeTree.contextSummary}
            </p>

            {/* Key Differences Bullet Badges */}
            <div className="pt-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                Key Workflow Distinctions for this Cadre:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeTree.keyDifferences.map((diff, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{diff}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Graphical Tree Canvas */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-6 md:p-8 shadow-md space-y-8 overflow-x-auto">
            {/* Root Goal Node */}
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                Goal (Level 0)
              </div>
              <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-850 border-2 border-cyan-400/80 shadow-lg text-white font-bold text-base md:text-lg max-w-xl">
                {activeTree.goal}
              </div>
              <div className="px-4 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
                {activeTree.rootPlan}
              </div>

              {/* Vertical connector line */}
              <div className="w-0.5 h-8 bg-cyan-500/40" />
            </div>

            {/* Branches Horizontal Container */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {activeTree.branches.map((branch) => {
                  const isExpanded = expandedBranches[branch.stepNumber] !== false;
                  return (
                    <div
                      key={branch.stepNumber}
                      className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-4 space-y-3.5 flex flex-col justify-between hover:border-cyan-500/60 transition-all shadow-sm"
                    >
                      <div>
                        {/* Branch Step Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-900 text-cyan-200 border border-cyan-700">
                            Step {branch.stepNumber}
                          </span>
                          {branch.isDecisionBranch && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-900 text-purple-200 border border-purple-700 flex items-center gap-1">
                              <Split className="w-2.5 h-2.5" />
                              Decision
                            </span>
                          )}
                        </div>

                        {/* Branch Title */}
                        <h4 className="font-bold text-sm text-white leading-tight">
                          {branch.name}
                        </h4>

                        {/* Plan Description */}
                        <div className="mt-2 p-2 rounded-lg bg-slate-900/80 border border-slate-700 text-[11px] font-mono text-amber-300 leading-snug">
                          {branch.planDescription}
                        </div>

                        {/* Input Artifact (e.g. vital signs, lab report) */}
                        {branch.inputArtifacts && branch.inputArtifacts.length > 0 && (
                          <div className="mt-2 p-2 rounded-lg bg-cyan-950/60 border border-cyan-800 text-[10px] text-cyan-300 flex items-center gap-1.5">
                            <FileText className="w-3 h-3 shrink-0 text-cyan-400" />
                            <span>Input: {branch.inputArtifacts.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Sub-nodes list */}
                      <div className="space-y-2 pt-2 border-t border-slate-700/60">
                        {branch.nodes.map((node) => (
                          <div
                            key={node.code}
                            onClick={() => setSelectedNodeCode(node.code)}
                            className={`p-2.5 rounded-xl text-xs cursor-pointer transition-all border ${
                              selectedNodeCode === node.code
                                ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                                : 'bg-slate-900/60 hover:bg-slate-700/70 text-slate-200 border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-mono text-[10px] font-bold opacity-80">
                                {node.code}
                              </span>
                              {node.type === 'decision' && (
                                <span className="text-[9px] font-bold px-1 rounded bg-purple-500/30 text-purple-300">
                                  Decision
                                </span>
                              )}
                              {node.type === 'triage' && (
                                <span className="text-[9px] font-bold px-1 rounded bg-rose-500/30 text-rose-300">
                                  Triage
                                </span>
                              )}
                            </div>

                            <p className="font-semibold text-xs leading-snug">{node.name}</p>

                            {node.plan && (
                              <p className="text-[10px] font-mono text-amber-400/90 mt-1">
                                {node.plan}
                              </p>
                            )}

                            {/* Annotations */}
                            {node.annotations && node.annotations.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {node.annotations.map((ann, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-amber-200 border border-slate-700"
                                  >
                                    {ann}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Sub-children list */}
                            {node.children && node.children.length > 0 && (
                              <div className="mt-2 pl-2 border-l border-slate-600 space-y-1">
                                {node.children.map((child) => (
                                  <div
                                    key={child.code}
                                    className="text-[10px] text-slate-300 flex items-center justify-between"
                                  >
                                    <span className="font-mono text-cyan-400 mr-1">{child.code}</span>
                                    <span className="line-clamp-1 flex-1">{child.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Node Inspector Drawer */}
          {selectedNodeCode && (
            <div className="bg-white rounded-2xl border border-cyan-300 shadow-md p-6 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-100 text-cyan-800">
                    Node {selectedNodeCode}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Clinical Specification & Rationale
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedNodeCode(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-slate-100"
                >
                  Close Inspector
                </button>
              </div>

              {(() => {
                let foundNode: any = null;
                for (const b of activeTree.branches) {
                  for (const n of b.nodes) {
                    if (n.code === selectedNodeCode) foundNode = n;
                    if (n.children) {
                      for (const c of n.children) {
                        if (c.code === selectedNodeCode) foundNode = c;
                      }
                    }
                  }
                }

                if (!foundNode) return null;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <p className="font-bold text-slate-800 text-sm">{foundNode.name}</p>
                      {foundNode.plan && (
                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-mono text-[11px]">
                          <strong>Plan Rule:</strong> {foundNode.plan}
                        </div>
                      )}
                      {foundNode.clinicalRationale && (
                        <p className="text-slate-600 leading-relaxed">
                          <strong>Clinical Objective:</strong> {foundNode.clinicalRationale}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Cognitive Load:</span>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                          foundNode.cognitiveLoad === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : foundNode.cognitiveLoad === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {foundNode.cognitiveLoad || 'Low'}
                        </span>
                      </div>

                      {foundNode.annotations && (
                        <div>
                          <span className="font-bold text-slate-700 block mb-1">Annotations / Protocol Triggers:</span>
                          <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                            {foundNode.annotations.map((a: string, idx: number) => (
                              <li key={idx}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: STEP-BY-STEP CLINICAL PATHWAY */}
      {/* ========================================================================= */}
      {activeSubView === 'step_pathway' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Step-by-Step Task Sequence for {activeTree.title}
            </h3>
            <p className="text-xs text-slate-500">
              Detailed procedural decomposition including decision rules, subtask dependencies, and cognitive load distribution.
            </p>
          </div>

          <div className="space-y-6">
            {activeTree.branches.map((branch, branchIdx) => (
              <div
                key={branch.stepNumber}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 hover:border-cyan-300 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-cyan-700 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                      {branch.stepNumber}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{branch.name}</h4>
                      <p className="font-mono text-xs text-amber-700 font-semibold">{branch.planDescription}</p>
                    </div>
                  </div>

                  {branch.inputArtifacts && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-medium flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-cyan-600" />
                      {branch.inputArtifacts[0]}
                    </span>
                  )}
                </div>

                {/* Subtask Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {branch.nodes.map((node) => (
                    <div
                      key={node.code}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                          {node.code}
                        </span>
                        {node.cognitiveLoad && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            node.cognitiveLoad === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : node.cognitiveLoad === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            Load: {node.cognitiveLoad}
                          </span>
                        )}
                      </div>

                      <h5 className="font-bold text-xs text-slate-900">{node.name}</h5>

                      {node.clinicalRationale && (
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {node.clinicalRationale}
                        </p>
                      )}

                      {node.annotations && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {node.annotations.map((a, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Sub-children */}
                      {node.children && (
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          {node.children.map((child) => (
                            <div key={child.code} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                              <ChevronRight className="w-3 h-3 text-cyan-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-mono font-bold text-slate-800 mr-1">{child.code}:</span>
                                <span>{child.name}</span>
                                {child.clinicalRationale && (
                                  <p className="text-[10px] text-slate-500 mt-0.5">{child.clinicalRationale}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: CROSS-CADRE COMPARATIVE MATRIX */}
      {/* ========================================================================= */}
      {activeSubView === 'comparison_matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Cross-Cadre Comparative Task Analysis Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Direct comparison of clinical triggers, diagnostic investigation depth, decision autonomy, and disposition responsibilities across all 5 Ghanaian healthcare roles.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <th className="p-3 font-bold font-serif w-1/6">Workflow Dimension</th>
                  <th className="p-3 font-bold bg-cyan-50/70 text-cyan-900 w-1/6">Doctor</th>
                  <th className="p-3 font-bold bg-emerald-50/70 text-emerald-900 w-1/6">General Nurse</th>
                  <th className="p-3 font-bold bg-teal-50/70 text-teal-900 w-1/6">Community Health Nurse</th>
                  <th className="p-3 font-bold bg-purple-50/70 text-purple-900 w-1/6">Pharmacist</th>
                  <th className="p-3 font-bold bg-blue-50/70 text-blue-900 w-1/6">Physician Assistant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {HTA_CADRE_COMPARISON_MATRIX.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-3 font-bold text-slate-900 border-r border-slate-200">
                      {row.dimension}
                    </td>
                    <td className="p-3 text-slate-700 leading-relaxed border-r border-slate-200">
                      {row.doctor}
                    </td>
                    <td className="p-3 text-slate-700 leading-relaxed border-r border-slate-200">
                      {row.generalNurse}
                    </td>
                    <td className="p-3 text-slate-700 leading-relaxed border-r border-slate-200">
                      {row.chn}
                    </td>
                    <td className="p-3 text-slate-700 leading-relaxed border-r border-slate-200">
                      {row.pharmacist}
                    </td>
                    <td className="p-3 text-slate-700 leading-relaxed">
                      {row.physicianAssistant}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
