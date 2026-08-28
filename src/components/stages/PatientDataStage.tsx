import React, { useState } from 'react';
import { PatientProfile, CadreRole, FacilityLevel } from '../../types';
import { 
  UserPlus, 
  Sparkles, 
  ArrowRight, 
  IdCard, 
  Phone, 
  Calendar, 
  MapPin, 
  RefreshCw,
  User,
  Heart,
  Baby
} from 'lucide-react';

interface PatientDataStageProps {
  patient: PatientProfile;
  setPatient: React.Dispatch<React.SetStateAction<PatientProfile>>;
  cadre: CadreRole;
  facilityLevel: FacilityLevel;
  onNextStage: () => void;
}

export const PatientDataStage: React.FC<PatientDataStageProps> = ({
  patient,
  setPatient,
  cadre,
  facilityLevel,
  onNextStage,
}) => {
  const [fullName, setFullName] = useState<string>(patient.fullName || patient.name || 'Akosua Mensah');
  const [phone, setPhone] = useState<string>(patient.phone || '0244123456');
  const [nhisNo, setNhisNo] = useState<string>(patient.nhisNo || 'NHIS-88294012');
  const [patientId, setPatientId] = useState<string>(patient.patientId || patient.id || 'GH-PT-8392');
  const [dob, setDob] = useState<string>(patient.dateOfBirth || '2001-04-15');
  const [gender, setGender] = useState<string>(patient.gender || 'Female');
  const [weight, setWeight] = useState<number>(patient.weight || 54);
  const [height, setHeight] = useState<number>(patient.height || 162);
  const [isPregnant, setIsPregnant] = useState<boolean>(patient.isPregnant || false);
  const [trimester, setTrimester] = useState<'1st' | '2nd' | '3rd'>(patient.pregnancyTrimester || '2nd');
  const [district, setDistrict] = useState<string>(patient.district || 'Fanteakwa North');
  const [community, setCommunity] = useState<string>(patient.community || 'Begoro Central');
  const [relativeName, setRelativeName] = useState<string>(patient.relativeName || 'Kofi Mensah (Husband)');
  const [relativePhone, setRelativePhone] = useState<string>(patient.relativeContact || '0209876543');

  // Auto-calculate age from DOB
  const calculateAge = (dobString: string) => {
    if (!dobString) return 25;
    const birthDate = new Date(dobString);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge >= 0 ? calculatedAge : 25;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    const calculated = calculateAge(val);
    setPatient((prev) => ({
      ...prev,
      dateOfBirth: val,
      age: calculated,
      ageUnit: calculated < 1 ? 'months' : 'years',
    }));
  };

  const generateNewId = () => {
    const randomId = 'GH-PT-' + Math.floor(1000 + Math.random() * 9000);
    setPatientId(randomId);
    setPatient((prev) => ({ ...prev, patientId: randomId, id: randomId }));
  };

  const handleProceed = () => {
    const age = calculateAge(dob);
    setPatient({
      ...patient,
      id: patientId,
      patientId: patientId,
      name: fullName,
      fullName: fullName,
      phone: phone,
      nhisNo: nhisNo,
      dateOfBirth: dob,
      age: age,
      ageUnit: age < 1 ? 'months' : 'years',
      gender: gender as any,
      weight: Number(weight) || 54,
      height: Number(height) || 162,
      isPregnant: isPregnant,
      pregnancyTrimester: isPregnant ? trimester : undefined,
      district: district,
      community: community,
      relativeName: relativeName,
      relativeContact: relativePhone,
    });

    onNextStage();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xs">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-100 text-cyan-800 rounded-xl">
              <UserPlus className="w-5 h-5 text-cyan-800" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Step 1: Patient Information & Registration
              </h3>
              <p className="text-xs text-slate-500">
                Register or verify patient demographics, NHIS insurance status, and vital anthropometrics.
              </p>
            </div>
          </div>

          <button
            onClick={generateNewId}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-700" />
            <span>Generate Patient ID</span>
          </button>
        </div>

        {/* Demographics Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-xs">
          
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Patient Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-800"
              placeholder="e.g. Akosua Mensah"
            />
          </div>

          {/* Patient ID */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Patient ID / Folder No. *
            </label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-800"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-700" />
              Date of Birth *
            </label>
            <input
              type="date"
              value={dob}
              onChange={handleDobChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-800"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Calculated Age: <strong>{calculateAge(dob)} years</strong>
            </span>
          </div>

          {/* Gender */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Gender *
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-800"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-cyan-700" />
              Phone / Contact
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0244123456"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-800"
            />
          </div>

          {/* NHIS Number */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <IdCard className="w-3.5 h-3.5 text-cyan-700" />
              NHIS Number
            </label>
            <input
              type="text"
              value={nhisNo}
              onChange={(e) => setNhisNo(e.target.value)}
              placeholder="e.g. NHIS-88294012"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-800"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Weight (kg) *
            </label>
            <input
              type="number"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-800"
            />
            <span className="text-[10px] text-cyan-700 mt-1 block">
              Required for weight-calculated drug dosing
            </span>
          </div>

          {/* Height */}
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-800"
            />
          </div>

        </div>

        {/* Pregnancy Status (if Female) */}
        {gender === 'Female' && (
          <div className="mb-6 p-4 rounded-2xl bg-pink-50/70 border border-pink-200 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-pink-950 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPregnant}
                  onChange={(e) => setIsPregnant(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-pink-300"
                />
                <span>Patient is currently Pregnant</span>
              </label>

              {isPregnant && (
                <div className="flex items-center gap-2">
                  <span className="text-pink-900 font-semibold">Trimester:</span>
                  <select
                    value={trimester}
                    onChange={(e) => setTrimester(e.target.value as any)}
                    className="bg-white border border-pink-300 rounded-lg px-2.5 py-1 text-xs text-pink-950 font-bold"
                  >
                    <option value="1st">1st Trimester (Oral Quinine/AL per STG)</option>
                    <option value="2nd">2nd Trimester (AL 1st line)</option>
                    <option value="3rd">3rd Trimester (AL 1st line)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location & Emergency Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <label className="font-bold text-slate-600 block mb-1">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Community / Town</label>
            <input
              type="text"
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Relative / Next of Kin</label>
            <input
              type="text"
              value={relativeName}
              onChange={(e) => setRelativeName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">Relative Contact</label>
            <input
              type="tel"
              value={relativePhone}
              onChange={(e) => setRelativePhone(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
            />
          </div>
        </div>

        {/* Proceed Action Button */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            onClick={handleProceed}
            className="px-6 py-2.5 bg-cyan-800 hover:bg-cyan-900 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2"
          >
            <span>Proceed to Step 2: Vitals & Triage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
