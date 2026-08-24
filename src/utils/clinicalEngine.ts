import { 
  PatientProfile, 
  VitalsData, 
  HistoryData, 
  ExaminationData, 
  DiagnosticTestsData, 
  FacilityLevel, 
  CadreRole, 
  ResourceInventory, 
  DecisionSupportOutput, 
  RedFlagAlert,
  DifferentialDiagnosis,
  TestPlanItem,
  MedicationItem,
  CognitiveBiasAlert,
  PharmacyTriageAssessment,
  NurseTriageStatus,
  ChnGuidanceData,
  DoctorEscalationThreshold
} from '../types';

export function computeGhanaClinicalDecision(params: {
  patient: PatientProfile;
  vitals: VitalsData;
  history: HistoryData;
  examination: ExaminationData;
  tests: DiagnosticTestsData;
  facilityLevel: FacilityLevel;
  cadre: CadreRole;
  availableResources?: ResourceInventory;
}): DecisionSupportOutput {
  const {
    patient,
    vitals,
    history,
    examination,
    tests,
    facilityLevel,
    cadre,
    availableResources,
  } = params;

  const age = Number(patient.age) || 5;
  const ageYears = patient.ageUnit === 'months' ? age / 12 : age;
  const weight = Number(patient.weight) || (ageYears < 1 ? 7 : Math.round(ageYears * 2 + 8));
  const temp = Number(vitals.temp) || 38.5;
  const rr = Number(vitals.rr) || 24;
  const spo2 = Number(vitals.spo2) || 98;
  const avpu = vitals.avpu || 'Alert';

  const redFlags: RedFlagAlert[] = [];
  let isSevere = false;

  // 1. Vitals Red Flags
  if (temp >= 39.5) {
    redFlags.push({
      sign: 'Extreme Hyperpyrexia (Temp ≥ 39.5°C)',
      severity: 'HIGH',
      rationale: 'Elevated risk of febrile seizures in pediatrics and metabolic distress.',
      immediateAction: 'Initiate tepid sponging with lukewarm water, Paracetamol 15 mg/kg, remove excess clothing.',
    });
  }
  if (temp < 35.5 && ageYears < 1) {
    redFlags.push({
      sign: 'Neonatal / Infant Hypothermia (< 35.5°C)',
      severity: 'CRITICAL',
      rationale: 'Major danger sign for severe neonatal sepsis or systemic shock in young infants.',
      immediateAction: 'Initiate skin-to-skin warming / incubator, check blood glucose, urgent parenteral antibiotics.',
    });
    isSevere = true;
  }
  if (avpu !== 'Alert') {
    redFlags.push({
      sign: `Altered Sensorium / Lethargy (AVPU: ${avpu})`,
      severity: 'CRITICAL',
      rationale: 'Indicates central nervous system involvement (Cerebral Malaria, Meningitis, Severe Sepsis, Hypoglycemia).',
      immediateAction: 'Check point-of-care blood glucose immediately, secure airway, initiate IV access, prepare pre-referral Artesunate.',
    });
    isSevere = true;
  }
  if (spo2 < 92) {
    redFlags.push({
      sign: `Hypoxia (SpO2: ${spo2}%)`,
      severity: 'CRITICAL',
      rationale: 'Severe respiratory compromise or lactic acidosis.',
      immediateAction: 'Administer supplemental Oxygen (2-4 L/min via nasal prongs), position upright.',
    });
    isSevere = true;
  }

  // Fast breathing check per IMNCI
  const isFastBreathing =
    (ageYears < 0.16 && rr >= 60) || // <2 months
    (ageYears >= 0.16 && ageYears < 1 && rr >= 50) || // 2-11 months
    (ageYears >= 1 && ageYears < 5 && rr >= 40) || // 1-5 years
    (ageYears >= 5 && rr >= 28); // >=5 years

  if (isFastBreathing) {
    redFlags.push({
      sign: `Tachypnea / Fast Breathing (${rr} bpm)`,
      severity: 'HIGH',
      rationale: 'Meets IMNCI criteria for pneumonia or respiratory compensation for metabolic acidosis in severe malaria.',
      immediateAction: 'Assess for chest indrawing, auscultate lungs, administer antipyretic.',
    });
  }

  // 2. History & General Danger Signs
  if (vitals.convulsionsPresent) {
    redFlags.push({
      sign: 'Repeated or Prolonged Convulsions',
      severity: 'CRITICAL',
      rationale: 'IMNCI general danger sign indicating central nervous system pathology.',
      immediateAction: 'Administer Diazepam rectally (0.5 mg/kg) or IV if actively seizing. Prepare IV Artesunate.',
    });
    isSevere = true;
  }

  if (vitals.unableToDrinkOrBreastfeed || vitals.vomitingEverything) {
    redFlags.push({
      sign: 'Inability to Drink / Vomiting Everything',
      severity: 'CRITICAL',
      rationale: 'Patient cannot tolerate oral ACTs or fluids; high risk of dehydration and hypoglycemia.',
      immediateAction: 'Establish IV access or NG tube; initiate parenteral therapy and hydration.',
    });
    isSevere = true;
  }

  if (vitals.extremeWeaknessProstration) {
    redFlags.push({
      sign: 'Prostration / Extreme Weakness',
      severity: 'CRITICAL',
      rationale: 'Inability to sit or stand unsupported is a WHO/GHS severity criterion for severe malaria.',
      immediateAction: 'Parenteral Artesunate and supportive hydration.',
    });
    isSevere = true;
  }

  // 3. Physical Examination Red Flags
  if (examination.neckStiffness || examination.bulgingFontanelle || examination.kernigBrudzinskiSign) {
    redFlags.push({
      sign: 'Meningeal Irritation (Neck Stiffness / Bulging Fontanelle)',
      severity: 'CRITICAL',
      rationale: 'Classic presentation of Acute Bacterial Meningitis requiring emergent management.',
      immediateAction: 'Immediate high-dose IV Ceftriaxone; prepare for lumbar puncture or rapid referral.',
    });
    isSevere = true;
  }

  if (examination.chestIndrawing || examination.gruntingOrNasalFlaring) {
    redFlags.push({
      sign: 'Severe Respiratory Distress (Chest Indrawing / Grunting)',
      severity: 'CRITICAL',
      rationale: 'Indicates severe pneumonia or severe metabolic acidosis.',
      immediateAction: 'Provide Oxygen therapy, parenteral antibiotics, and urgent stabilization.',
    });
    isSevere = true;
  }

  if (examination.conjunctivalPallor === 'Severe' || examination.palmarPallor === 'Severe' || (tests.fbcHb && tests.fbcHb < 5)) {
    redFlags.push({
      sign: `Severe Anemia / Pallor ${tests.fbcHb ? `(Hb: ${tests.fbcHb} g/dL)` : ''}`,
      severity: 'CRITICAL',
      rationale: 'Severe malarial anemia is a primary contributor to under-5 mortality.',
      immediateAction: 'Urgent blood grouping, crossmatch, and blood transfusion. Avoid volume overload.',
    });
    isSevere = true;
  }

  // 4. Differential Diagnoses Calculation
  const differentials: DifferentialDiagnosis[] = [];
  const mrdtResult = tests.mrdtPf;

  // Malaria Differential
  const isMrdtPositive = mrdtResult === 'Positive';
  const isMrdtNegative = mrdtResult === 'Negative';
  
  if (isMrdtPositive || (!isMrdtNegative && (history.chillsRigors || history.feverOnsetDays <= 3 || history.jointMusclePain))) {
    const malariaProb = isMrdtPositive ? (isSevere ? 96 : 92) : 70;
    differentials.push({
      diagnosis: isSevere ? 'Severe / Complicated Malaria (P. falciparum)' : 'Uncomplicated Malaria (P. falciparum)',
      probability: malariaProb,
      matchingCriteria: [
        'Fever / Chills',
        'Endemic in Ghana',
        isMrdtPositive ? 'mRDT Pf HRP2 Positive' : 'Acute febrile onset',
        isSevere ? 'Presence of GHS severity markers' : null
      ].filter(Boolean) as string[],
      missingOrContradictoryCriteria: isMrdtNegative ? ['mRDT is negative - consider alternative focal infection'] : [],
      icdOrGhsCode: isSevere ? 'GHS-MAL-02 (Severe Malaria)' : 'GHS-MAL-01 (Uncomplicated Malaria)',
      severityLevel: isSevere ? 'SEVERE' : 'MODERATE',
      clinicalRationale: `P. falciparum is the leading cause of febrile illness in Ghana (>90%). ${
        isSevere ? 'Patient displays critical GHS danger signs requiring immediate parenteral artesunate.' : 'Uncomplicated presentation requiring prompt weight-dosed oral ACT.'
      }`,
    });
  }

  // Pneumonia / ARI Differential
  if (history.cough || isFastBreathing || examination.chestIndrawing || examination.lungCracklesOrWheezes || tests.chestXray === 'Lobar Consolidation' || tests.chestXray === 'Bronchopneumonia') {
    const pneuProb = examination.chestIndrawing || tests.chestXray === 'Lobar Consolidation' ? 86 : (isFastBreathing ? 75 : 55);
    differentials.push({
      diagnosis: examination.chestIndrawing || isSevere ? 'Severe Community-Acquired Pneumonia' : 'Non-Severe Pneumonia (Acute Lower Respiratory Infection)',
      probability: pneuProb,
      matchingCriteria: [
        history.cough ? 'Cough' : null,
        isFastBreathing ? `Tachypnea (${rr} bpm)` : null,
        examination.chestIndrawing ? 'Subcostal chest indrawing' : null,
        examination.lungCracklesOrWheezes ? 'Crackles / abnormal breath sounds' : null,
      ].filter(Boolean) as string[],
      missingOrContradictoryCriteria: [],
      icdOrGhsCode: 'GHS-RESP-03',
      severityLevel: examination.chestIndrawing || isSevere ? 'SEVERE' : 'MODERATE',
      clinicalRationale: 'Fast breathing and respiratory effort in febrile patient indicates lower respiratory infection per GHS IMNCI guidelines.',
    });
  }

  // Enteric (Typhoid) Fever Differential
  if (history.feverOnsetDays >= 4 || history.abdominalPain || history.diarrhea || examination.abdominalTenderness !== 'None' || tests.widalTest?.includes('Elevated') || tests.bloodCulture === 'Salmonella typhi') {
    const typhoidProb = tests.bloodCulture === 'Salmonella typhi' ? 95 : (history.feverOnsetDays >= 5 ? 65 : 42);
    differentials.push({
      diagnosis: 'Enteric (Typhoid) Fever / Salmonellosis',
      probability: typhoidProb,
      matchingCriteria: [
        history.feverOnsetDays >= 4 ? `Prolonged fever (${history.feverOnsetDays} days)` : null,
        history.abdominalPain ? 'Abdominal discomfort' : null,
        examination.splenomegaly ? 'Splenomegaly' : null,
      ].filter(Boolean) as string[],
      missingOrContradictoryCriteria: ['Gold standard requires blood or stool culture confirmation'],
      icdOrGhsCode: 'GHS-ENT-01',
      severityLevel: 'MODERATE',
      clinicalRationale: 'Step-ladder prolonged fever with abdominal symptoms in Ghana carries high clinical suspicion for Salmonella typhi.',
    });
  }

  // Acute Bacterial Meningitis Differential
  if (examination.neckStiffness || examination.bulgingFontanelle || vitals.convulsionsPresent || avpu !== 'Alert') {
    differentials.push({
      diagnosis: 'Acute Bacterial Meningitis',
      probability: examination.neckStiffness ? 82 : 48,
      matchingCriteria: [
        examination.neckStiffness ? 'Meningismus / nuchal rigidity' : null,
        'Neurological involvement with acute fever'
      ].filter(Boolean) as string[],
      missingOrContradictoryCriteria: ['Requires CSF analysis / Lumbar Puncture for bacteriological confirmation'],
      icdOrGhsCode: 'GHS-CNS-01',
      severityLevel: 'LIFE_THREATENING',
      clinicalRationale: 'Meningeal irritation or severe neurological alteration in febrile patient requires emergent empiric therapy.',
    });
  }

  // Sepsis / Bacterial Infection
  if (isSevere && differentials.length < 4) {
    differentials.push({
      diagnosis: 'Severe Sepsis / Systemic Bacterial Infection',
      probability: 60,
      matchingCriteria: ['Multiple organ system red flags', 'High fever with tachycardia & tachypnea'],
      missingOrContradictoryCriteria: ['Blood cultures pending'],
      icdOrGhsCode: 'GHS-SEP-01',
      severityLevel: 'LIFE_THREATENING',
      clinicalRationale: 'Hemodynamic and systemic response to severe infection requiring rapid fluid resuscitation and broad-spectrum antibiotics.',
    });
  }

  // Sort differentials by probability
  differentials.sort((a, b) => b.probability - a.probability);

  // 5. Diagnostic Testing Plan tailored to facility level & HeFRA Equipment Guide
  const isChps = facilityLevel === 'CHPS Compound';
  const isHealthCentre = facilityLevel === 'Health Centre';
  const isClinic = facilityLevel === 'Clinic';
  const isMaternityHome = facilityLevel === 'Maternity Home';
  const isPharmacy = facilityLevel === 'Community Pharmacy';
  const isHospital = facilityLevel === 'District Hospital' || facilityLevel === 'Regional/Teaching Hospital';
  
  const hasLocalMrdt = availableResources?.diagnostics?.mrdt ?? true;
  const hasLocalMicroscopy = availableResources?.diagnostics?.microscopy ?? (isHospital || (isClinic && availableResources?.isClinicLabEquipped) || isHealthCentre);
  const hasLocalFbc = availableResources?.diagnostics?.fbc ?? (isHospital || (isClinic && availableResources?.isClinicLabEquipped));
  const hasLocalHb = availableResources?.diagnostics?.hemocueHb ?? (!isPharmacy);
  const hasLocalGlucose = availableResources?.diagnostics?.glucometer ?? true;
  const hasLocalUrineDip = availableResources?.diagnostics?.urineDipstick ?? true;
  const hasLocalBloodCulture = availableResources?.diagnostics?.bloodCulture ?? isHospital;
  const hasLocalXray = availableResources?.diagnostics?.chestXray ?? isHospital;
  const hasLocalUltrasound = availableResources?.diagnostics?.ultrasound ?? (isHospital || isMaternityHome);
  const hasLocalLp = availableResources?.diagnostics?.lumbarPunctureKit ?? isHospital;
  
  const testingPlan: TestPlanItem[] = [
    {
      testName: 'Malaria Rapid Diagnostic Test (mRDT Pf HRP2 / Pan)',
      priority: 'IMMEDIATE',
      isAvailableLocally: hasLocalMrdt,
      requiresReferralOrSendout: !hasLocalMrdt,
      expectedUtility: 'Mandatory parasitological confirmation per Ghana NMCP "Test, Treat, Track" policy prior to ACT dispensation.',
      localAlternativeIfUnavailable: hasLocalMicroscopy 
        ? 'Blood film microscopy (thick & thin films) for malaria parasite density.' 
        : 'Prepare blood slide and refer patient/specimen to nearest Health Centre or District Hospital.',
    },
  ];

  if (hasLocalMicroscopy || isHospital || isHealthCentre || (isClinic && availableResources?.isClinicLabEquipped)) {
    testingPlan.push({
      testName: 'Blood Film Microscopy (Giemsa Thick & Thin Films)',
      priority: isSevere ? 'IMMEDIATE' : 'RECOMMENDED',
      isAvailableLocally: hasLocalMicroscopy,
      requiresReferralOrSendout: !hasLocalMicroscopy,
      expectedUtility: 'Quantify parasite density (trophozoites/μL), identify Plasmodium species, and assess treatment response.',
      localAlternativeIfUnavailable: 'Point-of-care mRDT on-site; prepare blood slide for send-out to district laboratory.',
    });
  }

  // Point-of-Care Blood Glucose
  testingPlan.push({
    testName: 'Point-of-Care Blood Glucose (Glucometer)',
    priority: isSevere || ageYears < 5 ? 'IMMEDIATE' : 'RECOMMENDED',
    isAvailableLocally: hasLocalGlucose,
    requiresReferralOrSendout: !hasLocalGlucose,
    expectedUtility: 'Identify and treat life-threatening hypoglycemia (<3.0 mmol/L in children, <2.2 mmol/L in adults) common in severe malaria.',
    localAlternativeIfUnavailable: 'Empiric 10% Dextrose 5 mL/kg orally or pre-referral bolus if altered consciousness.',
  });

  // Pregnancy test for reproductive-age females or if pregnant
  if (patient.gender === 'Female' && (patient.isPregnant || patient.age >= 12)) {
    testingPlan.push({
      testName: 'Urine Pregnancy Rapid Test (hCG)',
      priority: 'IMMEDIATE',
      isAvailableLocally: availableResources?.diagnostics?.pregnancyTest ?? true,
      requiresReferralOrSendout: false,
      expectedUtility: 'Confirm pregnancy status to guide trimester-safe antimalarial choice (Oral Quinine in 1st trimester vs AL in 2nd/3rd trimester).',
      localAlternativeIfUnavailable: 'Clinical LMP dating and prompt referral to antenatal clinic / Maternity Home.',
    });
  }

  // Hemoglobin & Full Blood Count
  if (hasLocalFbc) {
    testingPlan.push({
      testName: 'Full Blood Count (FBC / CBC) with Differential',
      priority: isSevere ? 'IMMEDIATE' : 'RECOMMENDED',
      isAvailableLocally: true,
      requiresReferralOrSendout: false,
      expectedUtility: 'Assess leukocytosis in bacterial sepsis, thrombocytopenia in severe malaria, and hematocrit/Hb.',
      localAlternativeIfUnavailable: 'HemoCue portable Hb test.',
    });
  } else {
    testingPlan.push({
      testName: 'Haemoglobin Assessment (HemoCue POC / FBC send-out)',
      priority: isSevere || examination.conjunctivalPallor !== 'None' ? 'IMMEDIATE' : 'RECOMMENDED',
      isAvailableLocally: hasLocalHb,
      requiresReferralOrSendout: !hasLocalHb,
      expectedUtility: 'Quantify severe malarial anemia (Hb < 5.0 g/dL in children, < 7.0 g/dL in pregnancy) requiring urgent transfusion.',
      localAlternativeIfUnavailable: 'Clinical palmar/conjunctival pallor evaluation; emergency referral to District Hospital if pallor is marked.',
    });
  }

  // Urine Dipstick
  testingPlan.push({
    testName: 'Urine Dipsticks (Leukocytes, Nitrites, Protein, Blood)',
    priority: history.dysuria || !differentials[0]?.diagnosis.includes('Malaria') ? 'IMMEDIATE' : 'RECOMMENDED',
    isAvailableLocally: hasLocalUrineDip,
    requiresReferralOrSendout: !hasLocalUrineDip,
    expectedUtility: 'Screen for occult UTI, pyelonephritis, or proteinuria in pregnancy-related fever / pre-eclampsia.',
    localAlternativeIfUnavailable: 'Clinical dysuria evaluation and urine specimen transport to sub-district lab.',
  });

  // Prolonged fever or blood culture
  if (history.feverOnsetDays >= 4 || tests.bloodCulture !== 'Not Done' || isSevere) {
    testingPlan.push({
      testName: 'Blood Culture & Sensitivity',
      priority: 'RECOMMENDED',
      isAvailableLocally: hasLocalBloodCulture,
      requiresReferralOrSendout: !hasLocalBloodCulture,
      expectedUtility: 'Gold standard for bacteriological confirmation and susceptibility in Salmonella typhi (Typhoid) and sepsis.',
      localAlternativeIfUnavailable: hasLocalMrdt
        ? 'Widal serology test (interpret with caution) or collect blood culture bottle with aseptic technique and transfer to District Hospital.'
        : 'Refer specimen/patient to District Hospital.',
    });
  }

  // Respiratory / Chest X-Ray
  if (history.cough || examination.chestIndrawing || isFastBreathing) {
    testingPlan.push({
      testName: 'Chest Radiography (X-Ray)',
      priority: examination.chestIndrawing ? 'IMMEDIATE' : 'RECOMMENDED',
      isAvailableLocally: hasLocalXray,
      requiresReferralOrSendout: !hasLocalXray,
      expectedUtility: 'Identify lobar consolidation, bronchopneumonia, pleural effusion, or pulmonary edema in severe malaria.',
      localAlternativeIfUnavailable: 'Stethoscope auscultation (crackles/bronchial breathing) + IMNCI fast-breathing protocol; oral dispersible amoxicillin.',
    });
  }

  // Obstetric Ultrasound if maternity or pregnancy
  if ((patient.isPregnant || isMaternityHome) && (hasLocalUltrasound || isHospital)) {
    testingPlan.push({
      testName: 'Obstetric / Abdominal Ultrasound Scan',
      priority: 'RECOMMENDED',
      isAvailableLocally: hasLocalUltrasound,
      requiresReferralOrSendout: !hasLocalUltrasound,
      expectedUtility: 'Assess fetal viability, gestational age, amniotic fluid in febrile pregnancy, or hepatosplenomegaly.',
      localAlternativeIfUnavailable: 'Fetal Doppler / fetoscope auscultation and symphysis-fundal height measuring tape.',
    });
  }

  // Lumbar Puncture for Meningismus
  if (examination.neckStiffness || examination.bulgingFontanelle || examination.kernigBrudzinskiSign) {
    testingPlan.push({
      testName: 'Lumbar Puncture & CSF Analysis (Microbiology/Biochemistry)',
      priority: 'IMMEDIATE',
      isAvailableLocally: hasLocalLp && (cadre === 'Doctor'),
      requiresReferralOrSendout: !(hasLocalLp && cadre === 'Doctor'),
      expectedUtility: 'Definitive diagnosis of Acute Bacterial Meningitis (turbid CSF, elevated WBC, protein, Gram stain).',
      localAlternativeIfUnavailable: 'Stat pre-referral IV/IM Ceftriaxone (100 mg/kg) and urgent ambulance transfer to District Hospital.',
    });
  }

  // 6. Management Plan & Precise Weight-Based Dosing
  const primaryTreatment: MedicationItem[] = [];
  const paracetamolDose = Math.round(weight * 15);

  // Paracetamol
  primaryTreatment.push({
    medication: `Paracetamol ${ageYears < 6 ? 'Syrup (120mg/5mL)' : 'Tablets (500mg)'}`,
    dosage: ageYears < 6 
      ? `${Math.round((paracetamolDose / 120) * 5)} mL (${paracetamolDose} mg)` 
      : `${weight > 45 ? '1000 mg (2 tabs)' : '500 mg (1 tab)'}`,
    route: 'Oral',
    frequency: 'Every 6-8 hours as needed (Max 4 doses/24h)',
    duration: '3 days',
    isAvailableInFacility: true,
    alternativeIfStockout: 'Ibuprofen syrup (only if ≥6 months and well hydrated)',
    counselingNotes: 'Administer with plenty of fluids. Do not exceed 60 mg/kg/day.',
    isPharmacyOtcAllowed: true,
  });

  if (isSevere) {
    const artesunateDoseMg = Math.round(weight * 2.4);
    primaryTreatment.push({
      medication: 'Injectable Artesunate (IV/IM)',
      dosage: `${artesunateDoseMg} mg (2.4 mg/kg body weight)`,
      route: isChps ? 'IM' : 'IV',
      frequency: 'At 0 hours, 12 hours, 24 hours, then once daily',
      duration: 'Minimum 24 hours (3 doses), then switch to full 3-day oral ACT once patient tolerates',
      isAvailableInFacility: !isChps && !isPharmacy,
      alternativeIfStockout: 'IM Artemether 3.2 mg/kg stat then 1.6 mg/kg daily OR Rectal Artesunate 100mg capsule',
      counselingNotes: 'Reconstitute strictly with 5% sodium bicarbonate then saline according to GHS standard.',
      isPharmacyOtcAllowed: false,
    });

    if (examination.neckStiffness || isSevere) {
      const ceftriaxoneDoseMg = Math.min(2000, Math.round(weight * (examination.neckStiffness ? 100 : 50)));
      primaryTreatment.push({
        medication: 'IV Ceftriaxone',
        dosage: `${ceftriaxoneDoseMg} mg (${examination.neckStiffness ? '100 mg/kg' : '50 mg/kg'})`,
        route: 'IV',
        frequency: examination.neckStiffness ? 'Divided BD (every 12 hours) or once daily' : 'Once daily',
        duration: '7 - 10 days',
        isAvailableInFacility: isHospital || (isHealthCentre && availableResources?.medications?.ceftriaxoneIV),
        alternativeIfStockout: 'IV/IM Ampicillin + Gentamicin',
        counselingNotes: 'Slow IV infusion over 30 minutes. Monitor for hypersensitivity.',
        isPharmacyOtcAllowed: false,
      });
    }
  } else {
    // Uncomplicated Malaria ACT Dosing per Ghana Weight Brackets
    let actDose = '1 tablet (20/120mg) BD';
    if (weight >= 15 && weight < 25) actDose = '2 tablets (20/120mg) BD';
    else if (weight >= 25 && weight < 35) actDose = '3 tablets (20/120mg) BD';
    else if (weight >= 35) actDose = '4 tablets (20/120mg) BD';

    if (patient.isPregnant && patient.pregnancyTrimester === '1st') {
      primaryTreatment.push({
        medication: 'Oral Quinine + Clindamycin',
        dosage: 'Quinine 10mg/kg (max 600mg) TDS + Clindamycin 300mg BD',
        route: 'Oral',
        frequency: 'Three times daily',
        duration: '7 days',
        isAvailableInFacility: true,
        alternativeIfStockout: 'Artemether-Lumefantrine (if Quinine unavailable in 1st trimester per GHS update)',
        counselingNotes: '1st trimester pregnancy recommendation per Ghana STG. Complete all 7 days.',
        isPharmacyOtcAllowed: false,
      });
    } else {
      primaryTreatment.push({
        medication: 'Artemether-Lumefantrine (Coartem) 20/120mg',
        dosage: actDose,
        route: 'Oral',
        frequency: 'Twice daily (0h, 8h on Day 1; then BD on Days 2 & 3)',
        duration: '3 days (Total 6 doses)',
        isAvailableInFacility: true,
        alternativeIfStockout: 'Artesunate-Amodiaquine (ASAQ) fixed-dose combination once daily for 3 days',
        counselingNotes: 'MUST be taken with fatty food or milk for lumefantrine absorption. Complete all 6 doses.',
        isPharmacyOtcAllowed: true,
      });
    }

    if (history.cough && isFastBreathing) {
      const amoxDoseMg = Math.round(weight * 40);
      primaryTreatment.push({
        medication: 'Amoxicillin Dispersible Tablets (250mg)',
        dosage: `${amoxDoseMg} mg (approx. ${Math.max(1, Math.round(weight / 6))} tabs)`,
        route: 'Oral',
        frequency: 'Twice daily (every 12 hours)',
        duration: '5 days',
        isAvailableInFacility: true,
        alternativeIfStockout: 'Amoxicillin/Clavulanate or Erythromycin syrup',
        counselingNotes: 'Disperse tablet in 5-10 mL of clean water or breastmilk before giving.',
        isPharmacyOtcAllowed: false,
      });
    }
  }

  const referralNeeded = isSevere && (!isHospital || cadre !== 'Doctor');
  const targetFacility = isChps 
    ? 'Health Centre / District Hospital' 
    : (isHealthCentre || isClinic || isMaternityHome || isPharmacy)
    ? 'District Hospital'
    : 'Regional / Teaching Hospital';

  // DRM 1: Cognitive Bias Detection for Doctors
  const cognitiveBiases: CognitiveBiasAlert[] = [];
  if (tests.mrdtPf === 'Negative' && differentials[0]?.diagnosis.includes('Malaria')) {
    cognitiveBiases.push({
      biasType: 'Anchoring Bias on Malaria',
      warningText: 'mRDT is negative but malaria remains high in initial diagnostic consideration.',
      clinicalEvidence: 'In hyper-endemic regions, clinicians frequently over-anchor on malaria for all febrile presentations, delaying recognition of bacterial pneumonia, sepsis, or UTI.',
      mitigationTip: 'Broaden differential review: auscultate chest for pneumonia, check urine dipstick for UTI, and consider viral/arboviral illness before prescribing antimalarials.',
    });
  }

  if (history.feverOnsetDays < 3 && differentials.some(d => d.diagnosis.includes('Typhoid'))) {
    cognitiveBiases.push({
      biasType: 'Premature Closure on Enteric Fever',
      warningText: 'Typhoid considered early (<3 days of fever) without characteristic step-ladder curve or focal abdominal signs.',
      clinicalEvidence: 'Widal tests have high false-positivity in Ghana. True Salmonella bacteremia typically manifests with >4-5 days of unrelenting fever.',
      mitigationTip: 'Avoid premature empiric fluoroquinolone dispensing in fever < 3 days unless blood culture or severe systemic toxicity confirms bacterial etiology.',
    });
  }

  if (redFlags.length > 0 && !examination.neckStiffness && !examination.chestIndrawing) {
    cognitiveBiases.push({
      biasType: 'Search Satisficing Alert',
      warningText: 'Danger sign identified, but targeted neurological and respiratory examination signs are incomplete.',
      clinicalEvidence: 'Stopping physical examination once a general danger sign (e.g. lethargy) is found may miss concomitant meningism or lower chest indrawing.',
      mitigationTip: 'Complete full mandatory IMNCI physical examination (fontanelle, neck stiffness, chest indrawing, hydration skin pinch).',
    });
  }

  // DRM 2: Pharmacy Triage & Drug Safety for Pharmacist
  const pharmacyRedFlags = redFlags.map(r => r.sign);
  const isPharmacyManageable = !isSevere && tests.mrdtPf === 'Positive' && ageYears >= 0.5 && !patient.isPregnant && history.feverOnsetDays <= 5;
  const pharmacyTriage: PharmacyTriageAssessment = {
    triageStatus: isPharmacyManageable
      ? 'COMMUNITY_PHARMACY_OTC_MANAGEABLE'
      : 'REQUIRES_URGENT_HEALTH_FACILITY_REFERRAL',
    reason: isPharmacyManageable
      ? 'Uncomplicated confirmed P. falciparum malaria in stable patient without danger signs or high-risk contraindications.'
      : isSevere 
        ? `Severe danger signs present (${redFlags.slice(0, 2).map(r => r.sign).join(', ')}). Immediate referral required for parenteral therapy.`
        : patient.isPregnant
        ? 'Pregnant patient with fever requires formal antenatal medical evaluation.'
        : ageYears < 0.5
        ? 'Infant under 6 months requires physician / clinical evaluation.'
        : 'Fever without confirmed etiology or potential bacterial focus requires clinic evaluation.',
    redFlagsPresent: pharmacyRedFlags,
    antimicrobialStewardshipWarning: 'ANTIMICROBIAL STEWARDSHIP: Do NOT dispense oral antibiotics (Ciprofloxacin, Amoxicillin, Azithromycin) OTC without prescription or confirmed bacterial infection. Overuse drives high cephalosporin/quinolone resistance in Ghana.',
    drugInteractions: [
      {
        drug: 'Artemether-Lumefantrine (Coartem)',
        interactingWith: 'CYP3A4 inducers (e.g. Rifampicin, Carbamazepine, Phenobarbital)',
        severity: 'WARNING',
        description: 'Significant reduction in lumefantrine serum concentrations, causing antimalarial treatment failure.',
        clinicalRecommendation: 'Consider alternative ACT (e.g. Artesunate-Amodiaquine) or consult physician.',
      },
      {
        drug: 'Artemether-Lumefantrine (Coartem)',
        interactingWith: 'Halofantrine / Quinine / QT prolonging agents',
        severity: 'CRITICAL',
        description: 'Lumefantrine can cause QT prolongation; co-administration with other QT prolongers increases fatal arrhythmia risk.',
        clinicalRecommendation: 'Do not administer AL within 1 month of Halofantrine. Maintain minimum 12h gap from IV quinine.',
      },
      {
        drug: 'Paracetamol',
        interactingWith: 'Multiple OTC cold syrups / Combination antipyretics',
        severity: 'WARNING',
        description: 'Risk of accidental acetaminophen overdose causing acute hepatic toxicity.',
        clinicalRecommendation: 'Check if caregiver is already giving OTC syrups. Maximum pediatric dose 60 mg/kg/day in 4 divided doses.',
      }
    ],
    patientCounselingPrompts: [
      'Take Coartem (AL) with whole milk, soup, or a fatty meal to ensure full lumefantrine intestinal absorption.',
      'Complete the entire 3-day (6-dose) course even if fever resolves after 24 hours to prevent recrudescence.',
      'If vomiting occurs within 30 minutes of taking medication, repeat the full dose immediately.',
      'Paracetamol is for symptom relief only (max 4 doses/day); do not mix with other multi-symptom cold syrups.',
      'Return to clinic/hospital immediately if patient cannot drink, vomits everything, becomes drowsy, or fever persists after 48 hours.',
    ],
  };

  // DRM 3: Nurse Urgency Triage Status
  const nurseCategory: 'EMERGENCY_RED' | 'PRIORITY_YELLOW' | 'NON_URGENT_GREEN' = 
    isSevere || avpu !== 'Alert' || vitals.convulsionsPresent || spo2 < 92
      ? 'EMERGENCY_RED'
      : temp >= 39.0 || isFastBreathing || vitals.vomitingEverything || examination.hydrationStatus === 'Some Dehydration'
      ? 'PRIORITY_YELLOW'
      : 'NON_URGENT_GREEN';

  const nurseTriage: NurseTriageStatus = {
    category: nurseCategory,
    categoryLabel: nurseCategory === 'EMERGENCY_RED' 
      ? 'RED: EMERGENCY (Immediate Resuscitation / Physician Alert)'
      : nurseCategory === 'PRIORITY_YELLOW'
      ? 'YELLOW: PRIORITY (Rapid Assessment & Fever Management)'
      : 'GREEN: NON-URGENT (Standard Outpatient Care)',
    summary: nurseCategory === 'EMERGENCY_RED'
      ? `Critical physiological danger signs identified (${redFlags.length} active red flags). Immediate nursing resuscitation, airway maintenance, and physician alert required.`
      : nurseCategory === 'PRIORITY_YELLOW'
      ? `High-risk observations (Temp ${temp}°C, RR ${rr} bpm). Needs immediate antipyresis, hydration check, and rapid mRDT testing.`
      : `Patient stable (Temp ${temp}°C, AVPU Alert). Proceed with standard IMNCI assessment and vital sign charting.`,
    immediateNursingActions: nurseCategory === 'EMERGENCY_RED'
      ? [
          'Alert Doctor / Physician Assistant immediately.',
          'Position patient on side (recovery position) if drowsy or convulsing; maintain patent airway.',
          'Administer high-flow Oxygen via nasal cannula if SpO2 < 92%.',
          'Establish IV line and check point-of-care Blood Glucose stat.',
          'Prepare pre-referral / stat IM Artesunate per standing orders.',
        ]
      : nurseCategory === 'PRIORITY_YELLOW'
      ? [
          'Tepid sponge with lukewarm water for 15-20 minutes.',
          'Administer oral Paracetamol syrup/tablets per weight.',
          'Perform point-of-care Malaria RDT and Glucometer check.',
          'Re-check temperature and respiratory rate in 30 minutes.',
        ]
      : [
          'Chart full vital signs in patient record.',
          'Perform malaria mRDT screening.',
          'Provide clean drinking water or ORS while waiting for clinician.',
        ],
  };

  // DRM 4: CHN Local Guidance & Weight Banding
  let chnActColor = {
    colorName: 'Yellow Pack',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-950',
    borderClass: 'border-amber-400',
    weightRange: '5 - 14 kg (approx 5 mos - 3 yrs)',
    tabsPerDose: '1 tablet twice daily for 3 days (Total 6 tablets)',
  };
  if (weight >= 35) {
    chnActColor = {
      colorName: 'Green Pack',
      bgClass: 'bg-emerald-500',
      textClass: 'text-emerald-950',
      borderClass: 'border-emerald-400',
      weightRange: '≥ 35 kg (approx ≥ 12 yrs & adults)',
      tabsPerDose: '4 tablets twice daily for 3 days (Total 24 tablets)',
    };
  } else if (weight >= 25) {
    chnActColor = {
      colorName: 'Brown Pack',
      bgClass: 'bg-yellow-800',
      textClass: 'text-yellow-100',
      borderClass: 'border-yellow-700',
      weightRange: '25 - 34 kg (approx 8 - 11 yrs)',
      tabsPerDose: '3 tablets twice daily for 3 days (Total 18 tablets)',
    };
  } else if (weight >= 15) {
    chnActColor = {
      colorName: 'Blue Pack',
      bgClass: 'bg-blue-500',
      textClass: 'text-blue-950',
      borderClass: 'border-blue-400',
      weightRange: '15 - 24 kg (approx 3 - 7 yrs)',
      tabsPerDose: '2 tablets twice daily for 3 days (Total 12 tablets)',
    };
  }

  const chnSuppDose = weight < 10
    ? { ageRange: '< 3 years', weightRange: '< 10 kg', capsulesCount: 1, mgTotal: 100 }
    : weight < 20
    ? { ageRange: '3 - 5 years', weightRange: '10 - 19 kg', capsulesCount: 2, mgTotal: 200 }
    : { ageRange: '6 - 12 years', weightRange: '20 - 39 kg', capsulesCount: 4, mgTotal: 400 };

  const chnGuidance: ChnGuidanceData = {
    dangerSignsLocalTerms: [
      {
        concept: 'Fever / Hot Body',
        english: 'High body temperature or feeling hot to touch',
        twi: 'Atiridii / Homa yɛ hye',
        ga: 'Atiridii / Gbɔmɔtso dɔ',
        ewe: 'Asra / Ŋutilolo dzo',
        dagbani: 'Tiikpee / Ningbung tulum',
        description: 'Sudden or persistent hot body, chills and rigors',
      },
      {
        concept: 'Convulsions / Fits',
        english: 'Involuntary jerking or rolling of eyes (danger sign)',
        twi: 'Gyan-gyan / Asram twa',
        ga: 'Kplokplo / Gbelegbeli',
        ewe: 'Asra sesẽ / Kpefe',
        dagbani: 'Kpikpariba / Gbin kpari',
        description: 'Seizure activity or twitching during fever',
      },
      {
        concept: 'Vomiting Everything',
        english: 'Inability to retain any fluids, medication or breastmilk',
        twi: 'Fe biribiara / Ɔntumi nsi nsuo koraa',
        ga: 'Efeɔ nɔfɛɛnɔ / Nyɛɛɛ nu ekpɛ',
        ewe: 'Nududu katã tutu / Metsi le tome o',
        dagbani: 'Tiri bini kam / Ku tooi nyu kom',
        description: 'Immediate vomiting after any oral intake',
      },
      {
        concept: 'Difficulty Breathing / Fast Breathing',
        english: 'Chest moving up and down very fast or deep chest sucking',
        twi: 'Ahomegyeɛ mu denhyɛ / Kokom fam',
        ga: 'Mumu kɛ dɔsɛ / Tsotso mlitswaa',
        ewe: 'Gbɔgbɔ sesẽ / Akɔ dɔdɔ',
        dagbani: 'Vuhim toli / Nyɔŋ kpɛbu',
        description: 'Respiratory rate elevated or lower chest wall indrawing',
      },
      {
        concept: 'Extreme Weakness / Lethargy',
        english: 'Child unusually drowsy, cannot sit or suckle',
        twi: 'Mmerɛwyɛ pa ara / Ɔntumi nnyina',
        ga: 'Gbɔjɔmɔ kwraa / Nyɛɛɛ efe nɔko',
        ewe: 'Gbedodo / Ŋutilolo bɔbɔ',
        dagbani: 'Gbaŋgbanli / Ku tooi ziŋ',
        description: 'Unresponsive or abnormally floppy/lethargic',
      },
    ],
    preReferralRectalArtesunateDose: chnSuppDose,
    actColorBand: chnActColor,
    caregiverCounseling: [
      {
        topic: 'How to take ACT medicine',
        english: 'Give the medicine with fatty food, peanut soup, or breastmilk. Finish all 6 doses in 3 days.',
        localPrompt: 'Fa aduro no ma abofra no berɛ a wadi aduane a ngo wom, abenkwan anaa nkatenkwan, na ma no nwie mma 6 no nyinaa.',
      },
      {
        topic: 'What to do if child vomits',
        english: 'If the child vomits within 30 minutes of taking the tablet, wait 10 minutes and give another full dose.',
        localPrompt: 'Sɛ abofra no fe aduro no ansa na simma 30 aduru a, twɛn simma 10 na fa foforɔ ma no bio.',
      },
      {
        topic: 'When to rush back to clinic (Danger Signs)',
        english: 'Bring child back immediately if they cannot drink, have fits, or become very weak.',
        localPrompt: 'Fa no ba ntɛm ara sɛ ɔntumi nnom nsuo, ne honam twa (gyan-gyan), anaa sɛ ne ho yɛ mmerɛ koraa a.',
      },
    ],
  };

  // DRM 5: Doctor Escalation Threshold for Physician Assistant
  const paEscalationTriggers: string[] = [];
  if (isSevere) paEscalationTriggers.push('Severe disease presentation / multiple danger signs');
  if (examination.neckStiffness || examination.kernigBrudzinskiSign) paEscalationTriggers.push('Suspected acute bacterial meningitis requiring lumbar puncture & ICU monitoring');
  if (examination.skinRash === 'Petechial/Purpuric') paEscalationTriggers.push('Petechial / purpuric rash (Meningococcemia / DHF / DIC)');
  if (examination.conjunctivalPallor === 'Severe') paEscalationTriggers.push('Severe malarial anemia requiring blood crossmatching & emergency transfusion');
  if (vitals.convulsionsPresent) paEscalationTriggers.push('Recurrent convulsions / suspected status epilepticus');
  if (history.feverOnsetDays >= 7) paEscalationTriggers.push('Prolonged Fever of Unknown Origin (FUO) refractory to first-line regimens');

  const doctorEscalation: DoctorEscalationThreshold = {
    indicated: paEscalationTriggers.length > 0,
    triggers: paEscalationTriggers,
    recommendedSpecialty: 'Medical Officer / Pediatrician / Internal Medicine Specialist',
    reasonForConsult: paEscalationTriggers.length > 0
      ? `Case exceeds primary care scope at ${facilityLevel}. Formal doctor consultation/admission required for: ${paEscalationTriggers.join('; ')}.`
      : 'Within PA primary clinical scope at Health Centre level.',
  };

  return {
    redFlags,
    isSevere,
    requiresImmediateReferral: referralNeeded,
    suggestedNextQuestions: [
      {
        question: 'Has the patient had convulsions, eye rolling, or loss of consciousness in the last 24 hours?',
        purpose: 'Exclude cerebral malaria and complex febrile seizures.',
        targetCondition: 'Severe Malaria / Meningitis',
        importance: 'HIGH',
      },
      {
        question: 'Can the patient drink liquids or breastfeed, or do they vomit everything?',
        purpose: 'Assess oral tolerance and determine requirement for parenteral medication & hydration.',
        targetCondition: 'IMNCI General Danger Signs',
        importance: 'HIGH',
      },
      {
        question: 'Have you noticed any neck stiffness, unusual crying, or photophobia?',
        purpose: 'Screen for acute bacterial meningitis in high endemicity areas.',
        targetCondition: 'Acute Bacterial Meningitis',
        importance: 'MEDIUM',
      },
      {
        question: 'What medications, antimalarials, or herbal syrups have already been taken?',
        purpose: 'Prevent drug interactions and assess adherence or treatment failure.',
        targetCondition: 'Treatment History',
        importance: 'MEDIUM',
      },
    ],
    suggestedExaminations: [
      {
        procedure: "Check for Neck Rigidity & Kernig's / Brudzinski's Sign",
        clinicalSignToLookFor: 'Resistance to passive neck flexion or pain/knee flexion on lifting head.',
        rationale: 'Crucial in dry Harmattan season and febrile patients with headache/lethargy.',
      },
      {
        procedure: 'Inspect Conjunctival & Palmar Pallor',
        clinicalSignToLookFor: 'Severe pale palmar creases indicating severe anemia (Hb < 5 g/dL).',
        rationale: 'Severe malarial anemia is a primary cause of mortality in pediatric fevers.',
      },
      {
        procedure: 'Count Respiratory Rate for 60 Seconds & Observe Subcostal Indrawing',
        clinicalSignToLookFor: 'Lower chest wall indraws inward when breathing in; elevated breathing rate.',
        rationale: 'Differentiates pneumonia vs respiratory compensation for metabolic acidosis.',
      },
    ],
    differentials,
    testingPlan,
    managementPlan: {
      primaryTreatment,
      supportiveCare: [
        'Encourage generous oral fluids (ORS, coconut water, clean water, breastmilk).',
        'Tepid sponging with lukewarm water for temperatures > 38.5°C.',
        'Ensure sleep under insecticide-treated bed net (ITN).',
        'Nutritional support: Continue feeding with frequent small nutritious meals.',
      ],
      monitoringParameters: [
        'Vital signs & temperature checks every 4-6 hours.',
        'Review fever resolution within 48-72 hours of ACT completion.',
        'Return immediately if danger signs develop (vomiting everything, convulsions, difficulty breathing).',
      ],
      referralGuidance: {
        isReferralNeeded: referralNeeded,
        referralUrgency: isSevere ? 'IMMEDIATE_EMERGENCY' : 'NONE',
        targetFacilityLevel: isChps ? 'Health Centre' : 'District Hospital',
        preReferralStabilization: [
          'Administer single pre-referral stat dose of IM/Rectal Artesunate.',
          'Administer stat IM Ampicillin / Ceftriaxone if severe sepsis or meningitis suspected.',
          'Provide oral sugar water or 10% Dextrose (5 mL/kg) to prevent transit hypoglycemia.',
          'Keep patient warm and arrange rapid emergency transportation.',
        ],
        sbarSummary: {
          situation: `${patient.name || 'Patient'} (${patient.age} ${patient.ageUnit}, ${weight} kg) presenting with acute fever (${temp}°C) and ${redFlags.map((r) => r.sign).join(', ') || 'febrile illness'}.`,
          background: `Evaluated at ${facilityLevel} by ${cadre}. History: ${history.feverOnsetDays} days of fever. Prior treatments: ${history.priorAntimalarialTaken || 'None'}.`,
          assessment: `Working diagnosis: ${differentials[0]?.diagnosis || 'Severe Febrile Illness'}. GHS Severity: ${isSevere ? 'SEVERE' : 'Moderate'}.`,
          recommendation: referralNeeded 
            ? `Immediate transfer to ${targetFacility} for urgent parenteral management, lab workup, and close monitoring.` 
            : 'Outpatient management with weight-adjusted GHS regimen and 48-hour follow-up.',
        },
      },
    },
    cadreSpecificAdvice: `Guidance for ${cadre}: Adhere strictly to GHS STG. Verify weight (${weight} kg) before dispensing. Record all interventions in the GHS register.`,
    cognitiveSummaryText: isSevere
      ? `🚨 RED FLAG DETECTED: This case meets GHS criteria for ${differentials[0]?.diagnosis}. Prioritize airway, breathing, circulation, immediate parenteral stabilization, and referral.`
      : `✅ Manageable at ${facilityLevel}. Primary protocol is ${differentials[0]?.diagnosis} with weight-calculated ${primaryTreatment[1]?.medication || primaryTreatment[0]?.medication}.`,
    cognitiveBiases,
    pharmacyTriage,
    nurseTriage,
    chnGuidance,
    doctorEscalation,
  };
}
