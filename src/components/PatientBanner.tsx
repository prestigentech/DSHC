import React from 'react';
import { PatientProfile } from '../types';
import { User, Calendar, IdCard } from 'lucide-react';

interface PatientBannerProps {
  patient: PatientProfile;
  visitDate?: string;
}

export const PatientBanner: React.FC<PatientBannerProps> = ({ patient, visitDate }) => {
  const dateStr = visitDate || `VISIT: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}`;
  
  const initials = (patient.fullName || patient.name || 'PT')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const displayAge = patient.age ? `${patient.age} ${patient.ageUnit || 'yrs'}` : (patient.dateOfBirth ? 'DOB provided' : '--');
  const displayGender = patient.gender || 'Unknown gender';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 mb-4 shadow-xs relative overflow-hidden flex flex-wrap items-center gap-3 sm:gap-4 transition-colors">
      {/* Decorative accent bar */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-700" />

      {/* Patient Avatar with Initials */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-cyan-800 font-bold text-base sm:text-lg shrink-0 shadow-2xs">
        {initials || <User className="w-6 h-6 text-cyan-700" />}
      </div>

      {/* Patient Key Info */}
      <div className="flex-1 min-w-[200px]">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {patient.fullName || patient.name || 'Anonymous Patient'}
        </h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-0.5">
          <div className="flex items-center gap-1.5">
            <IdCard className="w-3.5 h-3.5 text-cyan-700" />
            <span className="font-mono">{patient.patientId || patient.id || patient.phone || 'PT-PENDING'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-700" />
            <span>{displayAge} · {displayGender}</span>
            {patient.weight > 0 && <span className="font-semibold text-slate-700">· {patient.weight} kg</span>}
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-700" />
            <span className="font-medium text-slate-600">{dateStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
