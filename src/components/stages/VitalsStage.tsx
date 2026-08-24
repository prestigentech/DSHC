import React, { useState } from 'react';
import { 
  PatientProfile, 
  VitalsData, 
  CadreRole, 
  ClinicalExpertise, 
  RedFlagAlert,
  DecisionSupportOutput 
} from '../../types';
import { getRoleTheme } from '../../utils/theme';
import { 
  Activity, 
  AlertTriangle, 
  Flame, 
  Heart, 
  Wind, 
  ShieldAlert, 
  Zap, 
  Baby, 
  User, 
  ArrowRight,
  Check,
  Languages,
  Pill,
  Stethoscope
} from 'lucide-react';

interface VitalsStageProps {
  patient: PatientProfile;
  setPatient: React.Dispatch<React.SetStateAction<PatientProfile>>;
  vitals: VitalsData;
  setVitals: React.Dispatch<React.SetStateAction<VitalsData>>;
  cadre: CadreRole;
  expertise: ClinicalExpertise;
  timePressure: boolean;
  redFlags: RedFlagAlert[];
  decisionSupport?: DecisionSupportOutput | null;
  onNextStage: () => void;
}

export const VitalsStage: React.FC<VitalsStageProps> = ({
  patient,
  setPatient,
  vitals,
  setVitals,
  cadre,
  redFlags,
  decisionSupport,
  onNextStage,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'twi' | 'ga' | 'ewe' | 'dagbani'>('twi');
  const roleTheme = getRoleTheme(cadre);

  // IMNCI Fast Breathing Threshold computation
  const getFastBreathingThreshold = () => {
    if (patient.ageUnit === 'months') {
      if (patient.age < 2) return 60;
      if (patient.age <= 11) return 50;
      return 40;
    } else {
      if (patient.age < 1) return 50;
      if (patient.age < 5) return 40;
      return 24;
    }
  };

  const fastBreathingLimit = getFastBreathingThreshold();
  const isFastBreathing = vitals.rr >= fastBreathingLimit;
  const isHypoxic = vitals.spo2 < 92;
  const isHyperpyrexia = vitals.temp >= 39.5;
  const isFever = vitals.temp >= 37.5;
  const isTachycardic = vitals.pulse > (patient.age < 1 ? 160 : patient.age < 5 ? 140 : 100);

  const dangerSignList = [
    { 
      key: 'convulsionsPresent' as const, 
      label: 'Convulsions / Fits', 
      desc: 'Any seizure or twitching during fever',
      twi: 'Gyan-gyan / Asram twa',
      ga: 'Kplokplo / Gbelegbeli',
      ewe: 'Asra sesẽ / Kpefe',
      dagbani: 'Kpikpariba / Gbin kpari',
    },
    { 
      key: 'unconsciousOrLethargic' as const, 
      label: 'Lethargic / Unconscious', 
      desc: 'Abnormally sleepy or unresponsive',
      twi: 'Mmerɛwyɛ pa ara / Ɔntumi nnyina',
      ga: 'Gbɔjɔmɔ kwraa / Nyɛɛɛ efe nɔko',
      ewe: 'Gbedodo / Ŋutilolo bɔbɔ',
      dagbani: 'Gbaŋgbanli / Ku tooi ziŋ',
    },
    { 
      key: 'vomitingEverything' as const, 
      label: 'Vomiting Everything', 
      desc: 'Cannot retain fluids or feeds',
      twi: 'Fe biribiara / Ɔntumi nsi nsuo',
      ga: 'Efeɔ nɔfɛɛnɔ / Nyɛɛɛ nu ekpɛ',
      ewe: 'Nududu katã tutu / Metsi tome o',
      dagbani: 'Tiri bini kam / Ku tooi nyu kom',
    },
    { 
      key: 'unableToDrinkOrBreastfeed' as const, 
      label: 'Unable to Drink / Breastfeed', 
      desc: 'Cannot suckle or swallow oral fluids',
      twi: 'Ɔntumi nnum nsuo anaa nufu',
      ga: 'Nyɛɛɛ nufɔ anaa nu enu',
      ewe: 'Menoa tsi alo no o',
      dagbani: 'Ku tooi nyu bihili bee kom',
    },
    { 
      key: 'stridorInCalmChild' as const, 
      label: 'Stridor in Calm Child', 
      desc: 'Harsh high-pitched inspiratory sound',
      twi: 'Kokom fam / Ahomegyeɛ mu gye',
      ga: 'Mumu mlitswaa kɛ dɔsɛ',
      ewe: 'Gbɔgbɔ sesẽ kple ɣlidodo',
      dagbani: 'Vuhim toli mini kumsi',
    },
    { 
      key: 'extremeWeaknessProstration' as const, 
      label: 'Prostration / Extreme Weakness', 
      desc: 'Cannot sit or stand without assistance',
      twi: 'Ɔntumi nte fam koraa',
      ga: 'Gbɔjɔmɔ kɛ gbenɔ',
      ewe: 'Ŋusẽvɔvɔ gbadzaa',
      dagbani: 'Yalim mini kpaŋkpam',
    },
  ];

  const nurseTriage = decisionSupport?.nurseTriage;
  const pharmacyTriage = decisionSupport?.pharmacyTriage;
  const chnGuidance = decisionSupport?.chnGuidance;

  return (
    <div className="space-y-5">
      {/* Patient Profile Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${roleTheme.primaryIconBg}`}>
              {patient.age < 5 && (patient.ageUnit === 'years' || patient.ageUnit === 'months') ? (
                <Baby className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <span className="text-xs font-bold text-slate-800">
              Patient Demographics & Clinical Context
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {patient.id}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">Name</label>
            <input
              id="patient-name-input"
              type="text"
              value={patient.name}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              placeholder="e.g. Kwame Mensah"
            />
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">Age</label>
            <div className="flex gap-1">
              <input
                id="patient-age-input"
                type="number"
                min="1"
                max="120"
                value={patient.age}
                onChange={(e) => setPatient({ ...patient, age: Number(e.target.value) || 1 })}
                className={`w-2/3 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              />
              <select
                id="patient-age-unit-select"
                value={patient.ageUnit}
                onChange={(e) => setPatient({ ...patient, ageUnit: e.target.value as 'months' | 'years' })}
                className={`w-1/3 bg-slate-50 border border-slate-300 rounded-lg px-1 py-1.5 text-slate-800 text-[10px] font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              >
                <option value="years">Yrs</option>
                <option value="months">Mos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">Gender</label>
            <select
              id="patient-gender-select"
              value={patient.gender}
              onChange={(e) => setPatient({ ...patient, gender: e.target.value as 'Male' | 'Female' })}
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">
              Weight (kg) <span className="text-rose-500">*</span>
            </label>
            <input
              id="patient-weight-input"
              type="number"
              step="0.1"
              min="2"
              max="200"
              value={patient.weight}
              onChange={(e) => setPatient({ ...patient, weight: Number(e.target.value) || 5 })}
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 ${roleTheme.primaryText} font-bold focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
            />
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">Region</label>
            <input
              id="patient-region-input"
              type="text"
              value={patient.region}
              onChange={(e) => setPatient({ ...patient, region: e.target.value })}
              className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              placeholder="e.g. Ashanti Region"
            />
          </div>

          <div>
            <label className="block text-slate-600 text-[11px] font-medium mb-1">
              {patient.gender === 'Female' && patient.age >= 12 ? 'Pregnancy' : 'Height / MUAC'}
            </label>
            {patient.gender === 'Female' && patient.age >= 12 ? (
              <select
                id="patient-pregnancy-select"
                value={patient.isPregnant ? (patient.pregnancyTrimester || '1st') : 'Not Pregnant'}
                onChange={(e) => {
                  if (e.target.value === 'Not Pregnant') {
                    setPatient({ ...patient, isPregnant: false, pregnancyTrimester: undefined });
                  } else {
                    setPatient({
                      ...patient,
                      isPregnant: true,
                      pregnancyTrimester: e.target.value as '1st' | '2nd' | '3rd',
                    });
                  }
                }}
                className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              >
                <option value="Not Pregnant">Not Pregnant</option>
                <option value="1st">Pregnant (1st Trim)</option>
                <option value="2nd">Pregnant (2nd Trim)</option>
                <option value="3rd">Pregnant (3rd Trim)</option>
              </select>
            ) : (
              <input
                id="patient-height-input"
                type="number"
                value={patient.height || ''}
                onChange={(e) => setPatient({ ...patient, height: Number(e.target.value) || undefined })}
                placeholder="cm (Optional)"
                className={`w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              />
            )}
          </div>
        </div>
      </div>

      {/* CADRE-SPECIFIC ADAPTIVE TRIAGE MODULES */}

      {/* 1. General Nurse Triage & Priority Score */}
      {cadre === 'General Nurse' && nurseTriage && (
        <div className={`rounded-xl p-4 border text-xs space-y-3 shadow-xs ${
          nurseTriage.category === 'EMERGENCY_RED'
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : nurseTriage.category === 'PRIORITY_YELLOW'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wide">
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span>NURSE TRIAGE LEVEL: {nurseTriage.categoryLabel}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-white/80 border border-slate-200">
              GHS Early Warning Protocol
            </span>
          </div>

          <p className="text-[12px] font-medium">{nurseTriage.summary}</p>

          <div className="bg-white/80 rounded-lg p-2.5 border border-slate-200 space-y-1.5">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Immediate Nursing Standing Orders:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-700">
              {nurseTriage.immediateNursingActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 2. Community Pharmacist Triage: OTC Manageable vs Hospital Referral Decision */}
      {cadre === 'Pharmacist' && pharmacyTriage && (
        <div className={`rounded-xl p-4 border text-xs space-y-3 shadow-xs ${
          pharmacyTriage.triageStatus === 'COMMUNITY_PHARMACY_OTC_MANAGEABLE'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wide">
              <Pill className="w-4 h-4 shrink-0" />
              <span>
                PHARMACY TRIAGE DECISION: {pharmacyTriage.triageStatus === 'COMMUNITY_PHARMACY_OTC_MANAGEABLE' 
                  ? 'COMMUNITY PHARMACY OTC MANAGEABLE' 
                  : 'REQUIRES URGENT HEALTH FACILITY REFERRAL'}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-white/80 border border-slate-200">
              GHS Pharmacy Scope
            </span>
          </div>

          <p className="text-[12px] font-medium">{pharmacyTriage.reason}</p>

          {/* Antimicrobial Stewardship Banner */}
          <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-200 text-[11px] text-amber-900">
            <strong>{pharmacyTriage.antimicrobialStewardshipWarning}</strong>
          </div>
        </div>
      )}

      {/* 3. Community Health Nurse: Rectal Artesunate Prompt */}
      {cadre === 'Community Health Nurse' && chnGuidance?.preReferralRectalArtesunateDose && redFlags.length > 0 && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 space-y-2 text-xs text-rose-900 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>CHN PRE-REFERRAL EMERGENCY STABILIZATION</span>
            </div>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono font-semibold border border-rose-200">
              Standing Orders
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-rose-200 text-[11px] text-slate-800 space-y-1">
            <div>
              <strong className="text-rose-800">Rectal Artesunate Dose:</strong> {chnGuidance.preReferralRectalArtesunateDose.capsulesCount} x 100mg suppository ({chnGuidance.preReferralRectalArtesunateDose.mgTotal}mg total) for {patient.weight}kg body weight.
            </div>
            <div className="text-amber-800 text-[10px] font-medium">
              Insert suppository into rectum and hold buttocks together for 1-2 minutes. Refer child immediately to the nearest Health Centre / Hospital.
            </div>
          </div>
        </div>
      )}

      {/* Critical Red Flag Alert Banner (Universal) */}
      {redFlags.length > 0 && cadre !== 'General Nurse' && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>CRITICAL CLINICAL ALERT ({redFlags.length} Danger Sign{redFlags.length > 1 ? 's' : ''})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {redFlags.map((rf, idx) => (
              <div key={idx} className="bg-white rounded-lg p-2.5 border border-rose-200 text-xs shadow-2xs">
                <div className="font-semibold text-rose-900 flex items-center justify-between">
                  <span>{rf.sign}</span>
                  <span className="text-[10px] text-rose-600 font-bold uppercase">{rf.severity}</span>
                </div>
                <div className="text-[11px] text-slate-700 mt-1 flex items-start gap-1">
                  <Zap className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Action:</strong> {rf.immediateAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Vital Signs (Left) & Danger Signs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Core Vital Signs */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${roleTheme.primaryIconBg}`}>
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Vital Signs
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Thresholds auto-evaluated per GHS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Temperature */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                  <Flame className={`w-3.5 h-3.5 ${isHyperpyrexia ? 'text-rose-600' : 'text-amber-600'}`} />
                  Temp (°C)
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
                  isHyperpyrexia ? 'bg-rose-100 text-rose-800 border-rose-200' : isFever ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {isHyperpyrexia ? 'Severe' : isFever ? 'Fever' : 'Normal'}
                </span>
              </div>
              <input
                id="vital-temp-input"
                type="number"
                step="0.1"
                min="32"
                max="43"
                value={vitals.temp}
                onChange={(e) => setVitals({ ...vitals, temp: Number(e.target.value) || 37.0 })}
                className={`w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-lg font-bold focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              />
            </div>

            {/* Respiratory Rate */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                  <Wind className={`w-3.5 h-3.5 ${isFastBreathing ? 'text-rose-600' : 'text-blue-600'}`} />
                  Resp Rate (bpm)
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
                  isFastBreathing ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {isFastBreathing ? `Fast (≥${fastBreathingLimit})` : 'Normal'}
                </span>
              </div>
              <input
                id="vital-rr-input"
                type="number"
                min="10"
                max="120"
                value={vitals.rr}
                onChange={(e) => setVitals({ ...vitals, rr: Number(e.target.value) || 20 })}
                className={`w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-lg font-bold focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              />
            </div>

            {/* Pulse */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                  <Heart className={`w-3.5 h-3.5 ${isTachycardic ? 'text-amber-600' : 'text-rose-600'}`} />
                  Pulse (bpm)
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
                  isTachycardic ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}>
                  {isTachycardic ? 'High' : 'Normal'}
                </span>
              </div>
              <input
                id="vital-pulse-input"
                type="number"
                min="40"
                max="250"
                value={vitals.pulse}
                onChange={(e) => setVitals({ ...vitals, pulse: Number(e.target.value) || 80 })}
                className={`w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-lg font-bold focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              />
            </div>

            {/* SpO2 */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-cyan-600" />
                  SpO2 (%)
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
                  isHypoxic ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {isHypoxic ? 'Hypoxic <92%' : 'Adequate'}
                </span>
              </div>
              <input
                id="vital-spo2-input"
                type="number"
                min="50"
                max="100"
                value={vitals.spo2}
                onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) || 98 })}
                className={`w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-lg font-bold focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              />
            </div>

            {/* Blood Pressure */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-600 font-medium">BP (mmHg)</span>
                <span className="text-[10px] text-slate-500 font-medium">Sys / Dia</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  id="vital-bps-input"
                  type="number"
                  placeholder="Sys"
                  value={vitals.bpSystolic || ''}
                  onChange={(e) => setVitals({ ...vitals, bpSystolic: Number(e.target.value) || undefined })}
                  className={`w-1/2 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-900 text-sm font-semibold focus:outline-none ${roleTheme.primaryRing} text-center shadow-xs`}
                />
                <span className="text-slate-400 font-bold">/</span>
                <input
                  id="vital-bpd-input"
                  type="number"
                  placeholder="Dia"
                  value={vitals.bpDiastolic || ''}
                  onChange={(e) => setVitals({ ...vitals, bpDiastolic: Number(e.target.value) || undefined })}
                  className={`w-1/2 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-900 text-sm font-semibold focus:outline-none ${roleTheme.primaryRing} text-center shadow-xs`}
                />
              </div>
            </div>

            {/* AVPU */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-600 font-medium">Consciousness</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
                  vitals.avpu === 'Alert' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                  {vitals.avpu}
                </span>
              </div>
              <select
                id="vital-avpu-select"
                value={vitals.avpu}
                onChange={(e) => setVitals({ ...vitals, avpu: e.target.value as any })}
                className={`w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-900 text-xs font-semibold focus:outline-none ${roleTheme.primaryRing} shadow-xs`}
              >
                <option value="Alert">Alert (Normal)</option>
                <option value="Voice">Voice (Drowsy)</option>
                <option value="Pain">Pain (Stupor)</option>
                <option value="Unresponsive">Unresponsive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: IMNCI Danger Signs + Local Language toggle for CHN */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-amber-100 text-amber-700">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  IMNCI Danger Signs
                </h3>
              </div>

              {/* Local language selection for CHN / Community cadres */}
              <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                <Languages className={`w-3 h-3 ${roleTheme.primaryText}`} />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as any)}
                  className="bg-transparent text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="twi">Twi</option>
                  <option value="ga">Ga</option>
                  <option value="ewe">Ewe</option>
                  <option value="dagbani">Dagbani</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {dangerSignList.map((item) => {
                const isChecked = Boolean((vitals as any)[item.key]);
                const localText = item[selectedLanguage];

                return (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() =>
                      setVitals({
                        ...vitals,
                        [item.key]: !isChecked,
                      })
                    }
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition shadow-xs ${
                      isChecked
                        ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="pr-2">
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {localText && (
                          <span className={`text-[10px] font-medium ${roleTheme.primaryText} italic`}>
                            ({localText})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                      isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Next Action */}
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              id="vitals-proceed-btn"
              onClick={onNextStage}
              className={`w-full sm:w-auto ${roleTheme.btnPrimary} text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-sm`}
            >
              <span>Continue to History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
