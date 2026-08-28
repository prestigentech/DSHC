import React from 'react';
import { PatientProfile, VitalsData, CadreRole, FacilityLevel, DecisionSupportOutput } from '../../types';
import { 
  MessageSquare, 
  Ambulance, 
  ArrowRight, 
  ArrowLeft,
  HeartHandshake,
  Stethoscope,
  FlaskConical
} from 'lucide-react';

interface PlanOfCareStageProps {
  patient: PatientProfile;
  vitals?: VitalsData;
  decisionSupport?: DecisionSupportOutput | null;
  cadre?: CadreRole;
  facilityLevel?: FacilityLevel;
  onProceedCounselling?: () => void;
  onProceedFullConsultation?: () => void;
  onProceedTesting?: () => void;
  onProceedReferral?: () => void;
  onSelectCounselling?: () => void;
  onSelectReferral?: () => void;
  onSelectContinue?: () => void;
  onPrevStage?: () => void;
}

export const PlanOfCareStage: React.FC<PlanOfCareStageProps> = ({
  patient,
  onProceedCounselling,
  onProceedFullConsultation,
  onProceedTesting,
  onProceedReferral,
  onSelectCounselling,
  onSelectReferral,
  onSelectContinue,
  onPrevStage,
}) => {
  const handleCounselling = onProceedCounselling || onSelectCounselling || (() => {});
  const handleReferral = onProceedReferral || onSelectReferral || (() => {});
  const handleContinue = onProceedFullConsultation || onSelectContinue || (() => {});

  return (
    <div className="space-y-6">
      {/* Action Decision Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs text-center">
        <div className="inline-flex items-center gap-2 text-cyan-800 font-extrabold text-xl sm:text-2xl mb-1">
          <HeartHandshake className="w-6 h-6 text-amber-500" />
          <span>Step 3: Plan of Care (Clinical Decision Path)</span>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto mb-8">
          Based on the initial vital signs and triage assessment for {patient.fullName || patient.name || 'the patient'}, choose the appropriate clinical pathway:
        </p>

        {/* 3 Core Decision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 text-left">
          
          {/* Card 1: Health Counselling */}
          <div className="bg-white border-2 border-emerald-100 hover:border-emerald-500 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition duration-200 flex flex-col group">
            <div className="h-32 bg-emerald-50/70 border-b-2 border-emerald-500 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform duration-200">
              <MessageSquare className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-1.5">
                  Health Counselling
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Provide tailored health education, preventive counselling, and dietary or hygiene advice. Document recommendations given.
                </p>
              </div>
              <button
                onClick={handleCounselling}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Provide Counselling</span>
              </button>
            </div>
          </div>

          {/* Card 2: Refer Patient */}
          <div className="bg-white border-2 border-amber-100 hover:border-amber-500 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition duration-200 flex flex-col group">
            <div className="h-32 bg-amber-50/70 border-b-2 border-amber-500 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform duration-200">
              <Ambulance className="w-12 h-12 text-amber-600" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-1.5">
                  Refer Patient
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Patient presents severe danger signs or requires specialized diagnostic/inpatient care not available locally. Fill GHS referral form.
                </p>
              </div>
              <button
                onClick={handleReferral}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
              >
                <Ambulance className="w-4 h-4" />
                <span>Refer Patient</span>
              </button>
            </div>
          </div>

          {/* Card 3: Continue Full Consultation */}
          <div className="bg-white border-2 border-blue-100 hover:border-blue-500 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition duration-200 flex flex-col group">
            <div className="h-32 bg-blue-50/70 border-b-2 border-blue-500 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform duration-200">
              <ArrowRight className="w-12 h-12 text-blue-600" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-1.5">
                  Continue Consultation
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Proceed to complete history taking, symptom assessment, physical examination, and diagnostic testing for complete management.
                </p>
              </div>
              <button
                onClick={handleContinue}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
              >
                <span>Continue Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Back Button */}
        {onPrevStage && (
          <div className="flex justify-center pt-2">
            <button
              onClick={onPrevStage}
              className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs text-slate-700 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Vitals</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
