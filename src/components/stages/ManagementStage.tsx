import React, { useState } from 'react';
import { 
  ManagementPlan, 
  PatientProfile, 
  FacilityLevel, 
  CadreRole, 
  ClinicalExpertise, 
  VitalsData,
  DecisionSupportOutput 
} from '../../types';
import { getRoleTheme } from '../../utils/theme';
import { 
  Pill, 
  Truck, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Printer, 
  Clock, 
  HeartHandshake,
  AlertTriangle,
  Languages
} from 'lucide-react';

interface ManagementStageProps {
  managementPlan: ManagementPlan;
  patient: PatientProfile;
  vitals: VitalsData;
  facilityLevel: FacilityLevel;
  cadre: CadreRole;
  expertise: ClinicalExpertise;
  timePressure: boolean;
  decisionSupport?: DecisionSupportOutput | null;
  onPrevStage: () => void;
}

export const ManagementStage: React.FC<ManagementStageProps> = ({
  managementPlan,
  patient,
  vitals,
  facilityLevel,
  cadre,
  decisionSupport,
  onPrevStage,
}) => {
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [counselingLang, setCounselingLang] = useState<'twi' | 'ga' | 'ewe' | 'dagbani'>('twi');
  const roleTheme = getRoleTheme(cadre);
  const { primaryTreatment, supportiveCare, monitoringParameters, referralGuidance } = managementPlan;
  const drugInteractions = decisionSupport?.drugInteractions || [];

  const localCounselingGuides = {
    twi: [
      'Fa nnuro no nyinaa wie sɛnea dɔkota akyerɛ wo no mpo sɛ ne ho yɛ no dɛ a.',
      'Mma no nsuo ne nufoɔ bebree na wanhwere nsuo pii wɔ ne nipadua mu.',
      'Sɛ ɔfeɛ wɔ simma aduasa mu a, san fa aduro no foforɔ ma no bio.',
      'Sɛ ɔntumi nnom nsuo, feɛ koraa, anaa ne ho tutu a, fa no bɛra ayaresabea ntɛm ara.'
    ],
    ga: [
      'Gbe tsofai lɛ fɛɛ nɔ bɔni dɔkta lɛ tsɔɔ bo lɛ kɛkɛ ni e he wa po.',
      'Hã lɛ nu kɛ fufɔ pii bɔni e he ekalo ko kpo.',
      'Kɛji e fee yɛ miniti 30 mli lɛ, hã lɛ tsofa kroko ekoŋŋ.',
      'Kɛji enyɛɛɛ enum nu, efee babaoo, aloo e wui yeli lɛ, kɛ lɛ aba klɛŋklɛŋ.'
    ],
    ewe: [
      'No atikeawo katã abe alesi dɔketa gblɔe ene ne eƒe lãme le dɔm hã.',
      'Na tsi kple noƒe gbogbo ne tsi magbɔ le eŋuti o.',
      'Ne etutu le aɖabaƒoƒo 30 me la, gbugbɔ atike bubu nɛ.',
      'Ne mate ŋu ano tsi o, tutu vevie, alo eƒe ŋutilã le dzodzo vɔvɔ la, kplɔe va kɔdzi enumake.'
    ],
    dagbani: [
      'Nyuma tima ŋɔ zaa kamani dɔɣite ni wuhi shɛm gbaai shɛhira o yaa kpeeya.',
      'Tirimi o ko\'nyurim mini bihisa pam ka ko\'kom bu che o ningbuna ni.',
      'Di yi niŋ ka o ti tiiri miniti pihita sunsuuni, labsim ti o tima ŋɔ yaha.',
      'Di yi niŋ ka o ku tooi nyu kom, tiri pam, bee ningbuna kpiya, zaŋmi o kuna ashibiti yomyom.'
    ]
  };

  const handleCopySBAR = () => {
    const sbar = referralGuidance.sbarSummary;
    const text = `
GHANA HEALTH SERVICE - CLINICAL REFERRAL / TRANSFER NOTE
------------------------------------------------------
Patient: ${patient.name} (${patient.age} ${patient.ageUnit}, ${patient.gender}, ${patient.weight}kg)
Originating Facility: ${facilityLevel}
Clinician / Cadre: ${cadre}
Date/Time: ${new Date().toLocaleString()}

[S] SITUATION:
${sbar.situation}

[B] BACKGROUND:
${sbar.background}
Current Vitals: Temp ${vitals.temp}°C, HR ${vitals.pulse} bpm, RR ${vitals.rr} bpm, SpO2 ${vitals.spo2}%, AVPU ${vitals.avpu}

[A] ASSESSMENT:
${sbar.assessment}

[R] RECOMMENDATION & PRE-REFERRAL STABILIZATION:
${sbar.recommendation}
Pre-referral treatments administered:
${referralGuidance.preReferralStabilization.map((s) => `• ${s}`).join('\n')}
------------------------------------------------------
`;
    navigator.clipboard.writeText(text.trim());
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Drug Interactions / Contraindication Alert (Pharmacist / Doctor / PA) */}
      {drugInteractions.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>MEDICATION SAFETY & DRUG INTERACTION ALERT</span>
          </div>
          <div className="space-y-1.5">
            {drugInteractions.map((alert, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded-lg border border-amber-200 text-xs text-slate-800 shadow-2xs">
                <div className="font-bold text-amber-900">
                  {alert.drug1} + {alert.drug2} ({alert.severity})
                </div>
                <div className="text-[11px] text-slate-700 mt-0.5">{alert.interaction}</div>
                <div className="text-[11px] text-amber-800 mt-1 italic">
                  <strong>Recommendation:</strong> {alert.management}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referral Alert Banner (If Referral is indicated) */}
      {referralGuidance.isReferralNeeded && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-900">
              <div className="p-1 rounded bg-rose-100 text-rose-700">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wide">
                Clinical Referral Indicated
              </h3>
            </div>
            <span className="text-[10px] bg-rose-100 border border-rose-300 text-rose-900 font-bold px-2.5 py-0.5 rounded-full">
              To: {referralGuidance.targetFacilityLevel}
            </span>
          </div>

          <div className="text-[11px] text-slate-800">
            <strong className="text-rose-900">Pre-Referral Stabilization:</strong>
            <ul className="mt-1 space-y-0.5 text-slate-700 list-disc list-inside">
              {referralGuidance.preReferralStabilization.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>

          {/* SBAR Form */}
          <div className="bg-white rounded-lg p-3 border border-rose-200 text-[11px] shadow-2xs">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                SBAR Referral Note
              </span>
              <button
                id="copy-sbar-btn"
                onClick={handleCopySBAR}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded text-[10px] border border-slate-200 transition"
              >
                {copiedReferral ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>Copy SBAR</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-slate-700">
              <div>
                <span className="text-blue-700 font-bold">[S] Situation:</span> {referralGuidance.sbarSummary.situation}
              </div>
              <div>
                <span className="text-blue-700 font-bold">[B] Background:</span> {referralGuidance.sbarSummary.background}
              </div>
              <div>
                <span className="text-blue-700 font-bold">[A] Assessment:</span> {referralGuidance.sbarSummary.assessment}
              </div>
              <div>
                <span className="text-blue-700 font-bold">[R] Recommendation:</span> {referralGuidance.sbarSummary.recommendation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Prescriptions */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded ${roleTheme.primaryIconBg}`}>
              <Pill className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Pharmacotherapy Regimen (Ghana EML & STG)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            Weight-band adjusted ({patient.weight} kg)
          </span>
        </div>

        <div className="space-y-2">
          {primaryTreatment.map((med, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded ${roleTheme.primaryBadge} flex items-center justify-center font-bold text-[9px]`}>
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900">{med.medication}</span>
                  <span className={`text-[10px] font-semibold ${roleTheme.primaryText}`}>
                    ({med.route} • {med.frequency})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-white text-slate-800 px-2 py-0.5 rounded font-mono text-[11px] font-bold border border-slate-200">
                    {med.dosage}
                  </span>
                  <span className="text-slate-500 font-semibold text-[10px]">{med.duration}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-700">
                <span className="text-slate-500 font-semibold">Administration / Counseling:</span> {med.counselingNotes}
              </div>

              {med.alternativeIfStockout && (
                <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-medium">
                  <span className="font-bold">Stockout alternative:</span> {med.alternativeIfStockout}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Local Language Caregiver Counseling Guide (CHN & Pharmacist) */}
      {(cadre === 'Community Health Nurse' || cadre === 'Pharmacist') && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${roleTheme.primaryIconBg}`}>
                <Languages className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Caregiver Counseling in Local Language
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
              <select
                value={counselingLang}
                onChange={(e) => setCounselingLang(e.target.value as any)}
                className="bg-transparent text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="twi">Twi</option>
                <option value="ga">Ga</option>
                <option value="ewe">Ewe</option>
                <option value="dagbani">Dagbani</option>
              </select>
            </div>
          </div>

          <div className={`space-y-1.5 text-xs ${roleTheme.primaryDarkText} ${roleTheme.primaryLightBg} p-3 rounded-lg border ${roleTheme.primaryLightBorder} font-medium`}>
            {localCounselingGuides[counselingLang].map((line, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className={`${roleTheme.primaryText} font-bold`}>•</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supportive Care & Clinical Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1 rounded bg-blue-100 text-blue-700">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Supportive Care
            </h3>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {supportiveCare.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1 rounded bg-amber-100 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Monitoring & Follow-up
            </h3>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {monitoringParameters.map((param, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>{param}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stage Navigation & Print Button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <button
          onClick={onPrevStage}
          className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg border border-slate-200 transition shadow-xs"
        >
          ← Back to Diagnostic Testing
        </button>

        <button
          id="print-plan-btn"
          onClick={handlePrint}
          className={`${roleTheme.btnPrimary} text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm`}
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export Plan</span>
        </button>
      </div>
    </div>
  );
};
