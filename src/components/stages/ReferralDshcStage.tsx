import React, { useState } from 'react';
import { PatientProfile, VitalsData, HistoryData, ExaminationData, DiagnosticTestsData, CadreRole, FacilityLevel } from '../../types';
import { 
  Ambulance, 
  Printer, 
  CheckCircle2, 
  ArrowLeft, 
  FileText, 
  Send,
  Building2,
  Phone,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface ReferralDshcStageProps {
  patient: PatientProfile;
  vitals: VitalsData;
  history?: HistoryData;
  examination?: ExaminationData;
  tests?: DiagnosticTestsData;
  decisionSupport?: any;
  cadre: CadreRole;
  facilityLevel: FacilityLevel;
  facilityName?: string;
  onPrevStage: () => void;
  onSubmitReferral?: (referralData: any) => void;
  onCompleteReferral?: () => void;
}

export const ReferralDshcStage: React.FC<ReferralDshcStageProps> = ({
  patient,
  vitals,
  history,
  examination,
  tests,
  cadre,
  facilityLevel,
  facilityName = 'Begoro Health Centre',
  onPrevStage,
  onSubmitReferral,
  onCompleteReferral,
}) => {
  // Form State
  const [referringFacility, setReferringFacility] = useState<string>(facilityName);
  const [district, setDistrict] = useState<string>(patient.district || 'Fanteakwa North');
  const [referringOfficer, setReferringOfficer] = useState<string>(`${cadre} On Duty`);
  const [officerContact, setOfficerContact] = useState<string>('0244000000');
  
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState<string>(
    'Severe Febrile Illness / Severe Malaria (P. falciparum) with repeated vomiting and danger signs'
  );
  const [clinicalSummary, setClinicalSummary] = useState<string>(
    `Patient presented with ${history.feverOnsetDays || 3} days of high fever (Temp: ${vitals.temp}°C, Pulse: ${vitals.pulse} bpm, RR: ${vitals.rr} bpm). Positive mRDT Pf. Exhibiting signs requiring higher-level stabilization and parenteral therapy.`
  );
  const [preReferralTreatment, setPreReferralTreatment] = useState<string>(
    'Rectal Artesunate capsule 100mg administered stat; IM Paracetamol 15mg/kg given for hyperpyrexia; IV cannula sited with slow infusion of Ringer\'s Lactate.'
  );
  
  const [reasonsForReferral, setReasonsForReferral] = useState<string[]>([
    'Severe Malaria / Danger signs',
    'Requires parenteral treatment / admission',
  ]);

  const [receivingFacility, setReceivingFacility] = useState<string>('Begoro District Hospital');
  const [receivingUnit, setReceivingUnit] = useState<string>('Emergency / Pediatric Ward');
  const [transportMode, setTransportMode] = useState<string>('National Ambulance Service (NAS)');
  const [escortNurse, setEscortNurse] = useState<string>('Staff Nurse on transit');

  const reasonOptions = [
    'Severe Malaria / Danger signs',
    'Requires parenteral treatment / admission',
    'Diagnostic capacity exceeded (No FBC / Blood culture / Ultrasound)',
    'Specialist physician review needed',
    'Blood transfusion requirement (Severe Anemia Hb < 5 g/dL)',
    'Intractable vomiting / Unable to retain oral medications',
    'Pregnancy with high-risk febrile complication',
  ];

  const toggleReason = (r: string) => {
    if (reasonsForReferral.includes(r)) {
      setReasonsForReferral(reasonsForReferral.filter(item => item !== r));
    } else {
      setReasonsForReferral([...reasonsForReferral, r]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = () => {
    const payload = {
      referringFacility,
      district,
      referringOfficer,
      officerContact,
      patientId: patient.patientId || patient.id,
      patientName: patient.fullName || patient.name,
      provisionalDiagnosis,
      clinicalSummary,
      preReferralTreatment,
      reasonsForReferral,
      receivingFacility,
      receivingUnit,
      transportMode,
      escortNurse,
      timestamp: new Date().toISOString(),
    };

    if (onSubmitReferral) {
      onSubmitReferral(payload);
    }
    if (onCompleteReferral) {
      onCompleteReferral();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-8 shadow-xs">
        
        {/* Ghana Health Service Official Referral Banner */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl p-4 sm:p-5 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <Ambulance className="w-7 h-7 text-amber-100" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 block">
                GHANA HEALTH SERVICE · OFFICIAL REFERRAL FORM
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Standard Inter-Facility Referral & Escalation
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Form</span>
            </button>
          </div>
        </div>

        {/* SECTION A: Referring Facility Details */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-700" />
            Section A: Referring Facility Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Referring Facility</label>
              <input
                type="text"
                value={referringFacility}
                onChange={(e) => setReferringFacility(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">District / Region</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Referring Officer</label>
              <input
                type="text"
                value={referringOfficer}
                onChange={(e) => setReferringOfficer(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Officer Phone</label>
              <input
                type="text"
                value={officerContact}
                onChange={(e) => setOfficerContact(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* SECTION B: Patient Demographics Summary */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-700" />
            Section B: Patient Clinical Demographics
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name</span>
              <span className="font-bold text-slate-900">{patient.fullName || patient.name}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Age / Gender / Weight</span>
              <span className="font-bold text-slate-900">{patient.age} {patient.ageUnit || 'yrs'} · {patient.gender} · {patient.weight}kg</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">NHIS Number</span>
              <span className="font-mono font-bold text-slate-900">{patient.nhisNo || 'Verified Active'}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Phone / Relative</span>
              <span className="font-mono font-bold text-slate-900">{patient.phone || patient.relativeContact || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* SECTION C: Clinical Findings & Reason for Referral */}
        <div className="mb-6 space-y-4">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            Section C: Clinical Information & SBAR Summary
          </h4>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Provisional / Working Diagnosis:
            </label>
            <input
              type="text"
              value={provisionalDiagnosis}
              onChange={(e) => setProvisionalDiagnosis(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Summary of Clinical Findings & Triage Vitals:
            </label>
            <textarea
              value={clinicalSummary}
              onChange={(e) => setClinicalSummary(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Pre-Referral Treatment Given & Stabilization Steps:
            </label>
            <textarea
              value={preReferralTreatment}
              onChange={(e) => setPreReferralTreatment(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
            />
          </div>

          {/* Reason for Referral Checkboxes */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Primary Reason(s) for Referral:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {reasonOptions.map((r, idx) => {
                const isSelected = reasonsForReferral.includes(r);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleReason(r)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 text-amber-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{r}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION D: Destination & Logistics */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
            <Ambulance className="w-4 h-4 text-cyan-700" />
            Section D: Receiving Facility & Transport
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Receiving Facility</label>
              <input
                type="text"
                value={receivingFacility}
                onChange={(e) => setReceivingFacility(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Target Department / Unit</label>
              <input
                type="text"
                value={receivingUnit}
                onChange={(e) => setReceivingUnit(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Transport Mode</label>
              <input
                type="text"
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Escort Staff</label>
              <input
                type="text"
                value={escortNurse}
                onChange={(e) => setEscortNurse(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onPrevStage}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit & Dispatch Referral</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
