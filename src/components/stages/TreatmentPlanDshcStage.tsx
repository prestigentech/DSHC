import React, { useState } from 'react';
import { PatientProfile, DecisionSupportOutput, CadreRole, FacilityLevel } from '../../types';
import { 
  Pill, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Download, 
  Ambulance, 
  ArrowLeft, 
  Edit3, 
  Sparkles,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface TreatmentPlanDshcStageProps {
  patient: PatientProfile;
  decisionSupport?: DecisionSupportOutput | null;
  cadre: CadreRole;
  facilityLevel: FacilityLevel;
  vitals?: any;
  tests?: any;
  onPrevStage?: () => void;
  onGoToReferral?: () => void;
  onProceedReferral?: () => void;
  onCompleteCase?: () => void;
  onCompleteEncounter?: () => void;
}

export const TreatmentPlanDshcStage: React.FC<TreatmentPlanDshcStageProps> = ({
  patient,
  decisionSupport,
  cadre,
  facilityLevel,
  onPrevStage,
  onGoToReferral,
  onProceedReferral,
  onCompleteCase,
  onCompleteEncounter,
}) => {
  const handleReferral = onProceedReferral || onGoToReferral || (() => {});
  const handleComplete = onCompleteEncounter || onCompleteCase || (() => {});

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [diagnosisTitle, setDiagnosisTitle] = useState<string>(
    decisionSupport?.differentials?.[0]?.diagnosis || 'Uncomplicated Malaria (Plasmodium falciparum)'
  );
  const [primaryMed, setPrimaryMed] = useState<string>(
    decisionSupport?.managementPlan?.primaryTreatment?.[0]?.medication || 'Artemether-Lumefantrine (Coartem) 20/120mg'
  );
  const [dosageText, setDosageText] = useState<string>(
    decisionSupport?.managementPlan?.primaryTreatment?.[0]?.dosage || 'Weight-calculated: 2 tablets BD (morning and evening)'
  );
  const [durationText, setDurationText] = useState<string>(
    decisionSupport?.managementPlan?.primaryTreatment?.[0]?.duration || '3 days (6 doses total)'
  );
  const [supportiveCareText, setSupportiveCareText] = useState<string>(
    decisionSupport?.managementPlan?.supportiveCare?.join(', ') || 'Paracetamol 500mg TDS for fever/pain, Oral Rehydration Salts (ORS), High fluid intake, Rest'
  );
  const [clinicalNotes, setClinicalNotes] = useState<string>(
    'Patient counseled to take Artemether-Lumefantrine immediately with milk or fatty meal to ensure adequate lumefantrine absorption. Return on Day 3 or sooner if vomiting persists or danger signs occur.'
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        
        {/* Header & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Pill className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Treatment Plan & Prescription
              </h3>
              <p className="text-xs text-slate-500">
                Grounded in Ghana Standard Treatment Guidelines (7th Edition) and NMCP protocols.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>{isEditing ? 'Close Editor' : 'Edit Plan'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Prescription</span>
            </button>
          </div>
        </div>

        {/* Diagnosis Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Primary Confirmed Diagnosis
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              GHS STG Code: B50.9 / ICD-10
            </span>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={diagnosisTitle}
              onChange={(e) => setDiagnosisTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 mb-2"
            />
          ) : (
            <h4 className="text-base sm:text-lg font-black text-slate-900 mb-2">
              {diagnosisTitle}
            </h4>
          )}

          <p className="text-xs text-slate-600">
            <strong>Supporting Findings:</strong> High fever (38.8°C), chills & rigors, positive mRDT Pf (HRP-2), mild palmar pallor, normal blood glucose (5.2 mmol/L).
          </p>
        </div>

        {/* Medication Prescription Cards */}
        <div className="mb-6">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Prescribed Medications & Administration Details
          </h4>

          <div className="bg-gradient-to-r from-emerald-50/70 to-teal-50/70 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-emerald-200/80">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-emerald-950">
                  1. {primaryMed}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                  1st Line ACT
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-800">
                Route: Oral
              </span>
            </div>

            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={primaryMed}
                    onChange={(e) => setPrimaryMed(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dosage</label>
                  <input
                    type="text"
                    value={dosageText}
                    onChange={(e) => setDosageText(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={durationText}
                    onChange={(e) => setDurationText(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3 text-slate-800">
                <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-100">
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Dosage</span>
                  <span className="font-bold text-emerald-950">{dosageText}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-100">
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Duration</span>
                  <span className="font-bold text-emerald-950">{durationText}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-100">
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">Schedule</span>
                  <span className="font-bold text-emerald-950">Hours: 0, 8, 24, 36, 48, 60</span>
                </div>
              </div>
            )}

            <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-xs text-emerald-950">
              <strong>Administration Rule:</strong> Must be taken with fatty food, full-cream milk, or soup to guarantee therapeutic bioavailability. If vomiting occurs within 30 minutes of dosing, repeat the full dose.
            </div>
          </div>

          {/* Supportive Care */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-4">
            <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
              Supportive & Symptomatic Management
            </h5>
            {isEditing ? (
              <textarea
                value={supportiveCareText}
                onChange={(e) => setSupportiveCareText(e.target.value)}
                rows={2}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
              />
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed">
                {supportiveCareText}
              </p>
            )}
          </div>

          {/* Clinical & Discharge Notes */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
            <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
              Clinical & Discharge Instructions
            </h5>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              rows={2}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onPrevStage}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Test Results</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleReferral}
              className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition flex items-center gap-2"
            >
              <Ambulance className="w-4 h-4 text-amber-700" />
              <span>Escalate / Referral Form</span>
            </button>

            <button
              onClick={handleComplete}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Encounter & Save Case</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
