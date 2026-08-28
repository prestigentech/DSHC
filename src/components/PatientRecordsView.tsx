import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  Play, 
  Printer, 
  Share2, 
  X, 
  CheckCircle2, 
  Clock, 
  Ambulance, 
  AlertTriangle,
  User,
  Calendar,
  IdCard,
  Pill,
  HeartPulse,
  Send
} from 'lucide-react';
import { EncounterRecord } from '../types';

interface PatientRecordsViewProps {
  encounters: EncounterRecord[];
  onStartNewConsultation: () => void;
  onResumeEncounter: (enc: EncounterRecord) => void;
  onDeleteEncounter: (id: string) => void;
}

export const PatientRecordsView: React.FC<PatientRecordsViewProps> = ({
  encounters,
  onStartNewConsultation,
  onResumeEncounter,
  onDeleteEncounter,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress' | 'referred' | 'pending'>('all');
  const [selectedEncounter, setSelectedEncounter] = useState<EncounterRecord | null>(null);

  // Filtered encounters
  const filtered = encounters.filter((enc) => {
    const pt = enc.pageStates?.patient_info || enc.pageStates?.dshc_patient_info;
    const name = pt?.fullName || pt?.name || '';
    const phone = pt?.phone || '';
    const id = pt?.patientId || enc.id;
    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return enc.status === statusFilter;
  });

  const totalCount = encounters.length;
  const completedCount = encounters.filter(e => e.status === 'completed').length;
  const inProgressCount = encounters.filter(e => e.status === 'in-progress').length;
  const referredCount = encounters.filter(e => e.status === 'referred').length;

  const handlePrintModal = () => {
    window.print();
  };

  const handleWhatsAppShare = (enc: EncounterRecord) => {
    const pt = enc.pageStates?.patient_info || enc.pageStates?.dshc_patient_info;
    const vitals = enc.pageStates?.vitals || enc.pageStates?.dshc_vitals;
    const name = pt?.fullName || pt?.name || 'Patient';
    const age = pt?.age ? `${pt.age} ${pt.ageUnit || 'yrs'}` : '';
    const temp = vitals?.temp ? `${vitals.temp}°C` : '';
    const status = enc.status.toUpperCase();

    const text = encodeURIComponent(
      `*GHS CLINICAL SUMMARY & PRESCRIPTION*\n` +
      `👤 Patient: ${name} (${age})\n` +
      `📋 Encounter ID: ${enc.id.substring(0, 8)}\n` +
      `🌡️ Temp: ${temp} | Status: ${status}\n` +
      `🏥 Facility: ${enc.facilityName || 'Begoro Health Centre'}\n` +
      `📅 Date: ${new Date(enc.createdAt).toLocaleDateString()}\n` +
      `\n_Generated via Ghana DSHC Clinical Decision Support System_`
    );

    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
              <FolderOpen className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                PATIENT ENCOUNTER DATABASE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Clinical Encounter Records
              </h2>
            </div>
          </div>

          <button
            onClick={onStartNewConsultation}
            className="px-5 py-2.5 bg-cyan-800 hover:bg-cyan-900 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Consultation</span>
          </button>
        </div>

        {/* Stats Pill Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-200 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Total Records</span>
            <span className="font-black text-slate-900 text-sm">{totalCount}</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <span className="text-emerald-700 font-semibold">Completed</span>
            <span className="font-black text-emerald-900 text-sm">{completedCount}</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
            <span className="text-amber-700 font-semibold">In Progress</span>
            <span className="font-black text-amber-900 text-sm">{inProgressCount}</span>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
            <span className="text-rose-700 font-semibold">Referred</span>
            <span className="font-black text-rose-900 text-sm">{referredCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Patient Name, Phone, or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-800"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {(['all', 'completed', 'in-progress', 'referred', 'pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl capitalize transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'in-progress' ? 'In Progress' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Encounters Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Patient Info</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Vitals / Findings</th>
                <th className="py-3.5 px-4">Encounter Status</th>
                <th className="py-3.5 px-4">Visit Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching clinical encounter records found.
                  </td>
                </tr>
              ) : (
                filtered.map((enc) => {
                  const pt = enc.pageStates?.patient_info || enc.pageStates?.dshc_patient_info || { name: 'Anonymous', age: 25 };
                  const vitals = enc.pageStates?.vitals || enc.pageStates?.dshc_vitals;
                  const temp = vitals?.temp ? `${vitals.temp}°C` : '--';

                  return (
                    <tr key={enc.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* Patient Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {pt.fullName || pt.name || 'Anonymous Patient'}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {pt.patientId || enc.id.substring(0, 8)}
                        </div>
                      </td>

                      {/* Demographics */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {pt.age} {pt.ageUnit || 'yrs'} · {pt.gender || 'Unknown'}
                        {pt.weight > 0 && <span className="text-slate-400"> ({pt.weight} kg)</span>}
                      </td>

                      {/* Vitals */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          Temp: <span className="font-bold">{temp}</span>
                        </div>
                        {vitals?.pulse && (
                          <div className="text-[10px] text-slate-500">
                            Pulse: {vitals.pulse} bpm · SpO2: {vitals.spo2 || 98}%
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          enc.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : enc.status === 'referred'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {enc.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {new Date(enc.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Resume */}
                          <button
                            onClick={() => onResumeEncounter(enc)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                            title="Resume Consultation"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>

                          {/* View Modal */}
                          <button
                            onClick={() => setSelectedEncounter(enc)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                            title="View Summary"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this encounter record?')) {
                                onDeleteEncounter(enc.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ENCOUNTER SUMMARY DETAIL MODAL */}
      {selectedEncounter && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-100 text-cyan-800 rounded-xl">
                  <IdCard className="w-5 h-5 text-cyan-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    Clinical Encounter Summary
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedEncounter.id}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedEncounter(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {(() => {
              const pt = selectedEncounter.pageStates?.patient_info || selectedEncounter.pageStates?.dshc_patient_info || { name: 'Anonymous' };
              const vitals = selectedEncounter.pageStates?.vitals || selectedEncounter.pageStates?.dshc_vitals;
              const tx = selectedEncounter.pageStates?.treatment_plan || selectedEncounter.pageStates?.dshc_treatment_plan;

              return (
                <div className="space-y-4 text-xs">
                  
                  {/* Demographics Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2 text-[10px]">
                      Patient Details
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-medium">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Name:</span>
                        <span className="font-bold text-slate-900">{pt.fullName || pt.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Age / Sex:</span>
                        <span>{pt.age} {pt.ageUnit || 'yrs'} · {pt.gender}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Weight:</span>
                        <span>{pt.weight || '--'} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Phone:</span>
                        <span className="font-mono">{pt.phone || '--'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">NHIS:</span>
                        <span className="font-mono">{pt.nhisNo || '--'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Date:</span>
                        <span>{new Date(selectedEncounter.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vitals Box */}
                  {vitals && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2 text-[10px]">
                        Recorded Vitals
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-medium">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Temp:</span>
                          <span className="font-bold text-slate-900">{vitals.temp}°C</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Pulse:</span>
                          <span>{vitals.pulse} bpm</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">RR:</span>
                          <span>{vitals.rr} bpm</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">SpO2:</span>
                          <span>{vitals.spo2}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Prescribed Plan Box */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                    <span className="font-bold uppercase tracking-wider block mb-1 text-[10px] text-emerald-800">
                      Diagnosis & Prescribed Regimen
                    </span>
                    <p className="font-extrabold text-sm mb-1">
                      Uncomplicated Malaria (P. falciparum)
                    </p>
                    <p className="text-xs text-emerald-900/90 leading-relaxed">
                      Weight-calculated Artemether-Lumefantrine (Coartem) 20/120mg BD for 3 days. Paracetamol 15mg/kg PRN for fever.
                    </p>
                  </div>

                </div>
              );
            })()}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedEncounter(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 transition"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleWhatsAppShare(selectedEncounter)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share via WhatsApp</span>
                </button>

                <button
                  onClick={handlePrintModal}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Case Summary</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
