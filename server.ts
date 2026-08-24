import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory cache for clinical analyses and guideline queries
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const analysisCache = new Map<string, CacheEntry<any>>();
const ragCache = new Map<string, CacheEntry<string>>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached<T>(map: Map<string, CacheEntry<T>>, key: string): T | null {
  const entry = map.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data;
  }
  return null;
}

function setCached<T>(map: Map<string, CacheEntry<T>>, key: string, data: T): void {
  map.set(key, { data, timestamp: Date.now() });
  // Prevent unbounded growth
  if (map.size > 200) {
    const firstKey = map.keys().next().value;
    if (firstKey) map.delete(firstKey);
  }
}

// Ghana Clinical Knowledge Base Context
const GHANA_GUIDELINES_RAG_CONTEXT = `
You are the Ghana Health Service (GHS) Clinical Decision Support Engine for Febrile Illnesses in Ghana.
Grounded in the Ghana Standard Treatment Guidelines (STG 7th/8th Edition), IMNCI protocols, and Ghana National Malaria Elimination Programme (NMEP) directives.

Core Ghana Clinical Realities & Epidemiology:
1. Malaria:
   - Primary etiology in Ghana is Plasmodium falciparum (>90%).
   - All suspected cases must have parasitological confirmation (mRDT or microscopy) before ACT treatment unless life-threatening delay in severe case.
   - First-line for uncomplicated malaria: Artemether-Lumefantrine (AL) or Artesunate-Amodiaquine (ASAQ) or Dihydroartemisinin-Piperaquine (DHAP).
   - Severe malaria: Immediate IV or IM Artesunate 2.4 mg/kg body weight at 0h, 12h, 24h, then daily until oral ACT can be tolerated. Pre-referral at CHPS/Health Centre: Rectal Artesunate (100mg capsule per weight bracket) or single IM Artesunate dose (2.4 mg/kg) then immediate referral.
   - Pregnancy: 1st trimester uncomplicated -> Oral Quinine + Clindamycin (or AL if quinine unavailable per GHS update); 2nd & 3rd trimester -> AL or ASAQ. Severe malaria in any trimester -> IV Artesunate.

2. Enteric (Typhoid) Fever:
   - Step-ladder prolonged fever (>5-7 days), dull frontal headache, coated tongue, relative bradycardia (Faget's sign), abdominal tenderness, hepato/splenomegaly.
   - Diagnosis: Blood culture (gold standard early), stool culture. Widal test is discouraged or interpreted with caution.
   - Treatment: Ciprofloxacin (adults) 500mg BD x 7-10d or Azithromycin 500mg OD x 7d (or 10-20 mg/kg pediatrics) or IV Ceftriaxone 2g daily for severe cases.

3. Acute Respiratory Infections / Pneumonia:
   - IMNCI Fast breathing thresholds: <2 months: >=60 bpm; 2-11 months: >=50 bpm; 12-59 months: >=40 bpm; Adults: >=20-25 bpm.
   - Danger signs: Chest indrawing, grunting, stridor in calm child, SpO2 < 90%.
   - Treatment: Non-severe -> High-dose oral Amoxicillin dispersible tablets (80-90 mg/kg/day divided BD); Severe -> IV/IM Ampicillin + Gentamicin or IV Ceftriaxone + Oxygen + Urgent Referral.

4. Acute Bacterial Meningitis (especially in Northern/Upper regions in dry Harmattan season):
   - Signs: Stiff neck, positive Kernig's/Brudzinski's, bulging fontanelle, altered sensorium, petechial rash.
   - Action: Urgent lumbar puncture if safe, immediate high-dose IV Ceftriaxone (100mg/kg daily) + IV Dexamethasone + urgent referral.

5. Sepsis / Severe Bacterial Infection:
   - Pediatric danger signs: altered mental status, tachypnea, hypotension / delayed capillary refill > 3s.
   - Action: Rapid IV fluids (Ringer's lactate or normal saline), empiric broad-spectrum antibiotics (IV Ceftriaxone), blood cultures, urgent transfer.
`;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ghana-febrile-cdss", timestamp: new Date().toISOString() });
});

// Endpoint for AI-driven clinical reasoning & personalized recommendations
app.post("/api/gemini/analyze", async (req, res) => {
  const {
    patient,
    vitals,
    history,
    examination,
    tests,
    cadre,
    facilityLevel,
    expertise,
    timePressure,
    availableResources,
    currentStage
  } = req.body;

  // Build cache key based on clinical inputs
  const cacheKey = JSON.stringify({
    p: patient?.id || patient?.age,
    v: [vitals?.temp, vitals?.avpu, vitals?.spo2, vitals?.convulsionsPresent],
    h: [history?.feverOnsetDays, history?.chillsRigors, history?.cough],
    e: [examination?.neckStiffness, examination?.chestIndrawing, examination?.splenomegaly],
    t: [tests?.mrdtPf, tests?.fbcHb],
    f: facilityLevel,
    c: cadre
  });

  const cachedResult = getCached(analysisCache, cacheKey);
  if (cachedResult) {
    return res.json({ success: true, source: "cache", data: cachedResult });
  }

  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const prompt = `
System Knowledge:
${GHANA_GUIDELINES_RAG_CONTEXT}

Current Clinical Context:
- User Cadre: ${cadre || "Medical Doctor"}
- Facility Tier: ${facilityLevel || "District Hospital"}
- Clinical Expertise Level: ${expertise || "Experienced"}
- Workload / Time Pressure: ${timePressure ? "HIGH / Emergency Triage" : "Standard Comprehensive"}
- Current Diagnostic Stage: ${currentStage || "Working Diagnosis"}

Patient Profile:
- Age: ${patient?.age} (${patient?.ageUnit || "years"}), Gender: ${patient?.gender}, Weight: ${patient?.weight} kg, Region: ${patient?.region || "Ghana"}
- Pregnancy Status: ${patient?.isPregnant ? "Pregnant (" + (patient?.pregnancyTrimester || "unknown") + ")" : "Not pregnant"}

Collected Vitals: ${JSON.stringify(vitals)}
Collected History: ${JSON.stringify(history)}
Collected Examination: ${JSON.stringify(examination)}
Collected Tests: ${JSON.stringify(tests)}

Task:
Provide a structured clinical decision analysis adapted for a ${cadre} at a ${facilityLevel} in Ghana.
Format your response as a valid JSON object matching this schema:
{
  "redFlags": [
    { "sign": "string", "severity": "CRITICAL" | "HIGH" | "MODERATE", "rationale": "string", "immediateAction": "string" }
  ],
  "isSevere": boolean,
  "requiresImmediateReferral": boolean,
  "suggestedNextQuestions": [
    { "question": "string", "purpose": "string", "targetCondition": "string", "importance": "HIGH" | "MEDIUM" }
  ],
  "suggestedExaminations": [
    { "procedure": "string", "clinicalSignToLookFor": "string", "rationale": "string" }
  ],
  "differentials": [
    {
      "diagnosis": "string",
      "probability": number,
      "matchingCriteria": ["string"],
      "missingOrContradictoryCriteria": ["string"],
      "icdOrGhsCode": "string",
      "severityLevel": "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING",
      "clinicalRationale": "string"
    }
  ],
  "testingPlan": [
    {
      "testName": "string",
      "priority": "IMMEDIATE" | "RECOMMENDED" | "OPTIONAL",
      "isAvailableLocally": boolean,
      "requiresReferralOrSendout": boolean,
      "expectedUtility": "string",
      "localAlternativeIfUnavailable": "string"
    }
  ],
  "managementPlan": {
    "primaryTreatment": [
      {
        "medication": "string",
        "dosage": "string",
        "route": "Oral" | "IV" | "IM" | "Rectal" | "Topical" | "Inhaled",
        "frequency": "string",
        "duration": "string",
        "isAvailableInFacility": boolean,
        "alternativeIfStockout": "string",
        "counselingNotes": "string"
      }
    ],
    "supportiveCare": ["string"],
    "monitoringParameters": ["string"],
    "referralGuidance": {
      "isReferralNeeded": boolean,
      "referralUrgency": "NONE" | "IMMEDIATE_EMERGENCY" | "SAME_DAY" | "ROUTINE",
      "targetFacilityLevel": "Health Centre" | "District Hospital" | "Regional Hospital" | "Teaching Hospital",
      "preReferralStabilization": ["string"],
      "sbarSummary": {
        "situation": "string",
        "background": "string",
        "assessment": "string",
        "recommendation": "string"
      }
    }
  },
  "cadreSpecificAdvice": "string",
  "cognitiveSummaryText": "string"
}
`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const text = response.text || "";
      const parsed = JSON.parse(text);
      setCached(analysisCache, cacheKey, parsed);
      return res.json({ success: true, source: "gemini-ai", data: parsed });
    } catch (err: any) {
      // Clean fallback if API quota or high demand occurs
      console.log("Note: Running on Ghana STG clinical expert engine (Gemini fallback):", err?.status || err?.message || "fallback");
    }
  }

  // Deterministic fallback clinical decision engine
  const fallbackResult = generateDeterministicGhanaRecommendation(req.body);
  setCached(analysisCache, cacheKey, fallbackResult);
  return res.json({
    success: true,
    source: "ghana-stg-expert-system",
    data: fallbackResult,
  });
});

// Deterministic Clinical Decision Rules based on GHS Standard Treatment Guidelines
function generateDeterministicGhanaRecommendation(payload: any) {
  const {
    patient = {},
    vitals = {},
    history = {},
    examination = {},
    tests = {},
    cadre = "General Nurse",
    facilityLevel = "Health Centre"
  } = payload;

  const age = Number(patient.age) || 5;
  const ageYears = patient.ageUnit === "months" ? age / 12 : age;
  const weight = Number(patient.weight) || (ageYears < 1 ? 7 : Math.round(ageYears * 2 + 8));
  const temp = Number(vitals.temp) || 38.5;
  const rr = Number(vitals.rr) || 24;
  const spo2 = Number(vitals.spo2) || 98;
  const avpu = vitals.avpu || "Alert";

  const redFlags: any[] = [];
  let isSevere = false;

  // Check Vitals Red Flags
  if (temp >= 39.5) {
    redFlags.push({
      sign: "Extreme Hyperpyrexia (Temp ≥ 39.5°C)",
      severity: "HIGH",
      rationale: "Elevated risk of febrile seizures in pediatrics and metabolic distress.",
      immediateAction: "Initiate tepid sponging, Paracetamol 15mg/kg, uncover patient.",
    });
  }
  if (temp < 35.5 && ageYears < 1) {
    redFlags.push({
      sign: "Neonatal / Infant Hypothermia (< 35.5°C)",
      severity: "CRITICAL",
      rationale: "Major danger sign for severe neonatal sepsis or systemic shock.",
      immediateAction: "Initiate warming, check blood glucose, urgent parenteral antibiotics.",
    });
    isSevere = true;
  }
  if (avpu !== "Alert") {
    redFlags.push({
      sign: `Altered Sensorium (AVPU: ${avpu})`,
      severity: "CRITICAL",
      rationale: "Indicates cerebral involvement (Cerebral Malaria, Meningitis, Severe Sepsis, Hypoglycemia).",
      immediateAction: "Check blood glucose immediately, secure airway, initiate IV access, prepare pre-referral Artesunate.",
    });
    isSevere = true;
  }
  if (spo2 < 92) {
    redFlags.push({
      sign: `Hypoxia (SpO2: ${spo2}%)`,
      severity: "CRITICAL",
      rationale: "Severe respiratory compromise or metabolic acidosis.",
      immediateAction: "Administer supplemental Oxygen (2-4 L/min via nasal prongs), position upright.",
    });
    isSevere = true;
  }

  // Fast breathing check
  const isFastBreathing =
    (ageYears < 0.16 && rr >= 60) ||
    (ageYears >= 0.16 && ageYears < 1 && rr >= 50) ||
    (ageYears >= 1 && ageYears < 5 && rr >= 40) ||
    (ageYears >= 5 && rr >= 28);

  if (isFastBreathing) {
    redFlags.push({
      sign: `Tachypnea / Fast Breathing (${rr} bpm)`,
      severity: "HIGH",
      rationale: "Meets IMNCI criteria for pneumonia or respiratory compensation for metabolic acidosis.",
      immediateAction: "Assess for chest indrawing, auscultate lungs, administer antipyretic.",
    });
  }

  if (vitals.convulsionsPresent || history.convulsionsPresent) {
    redFlags.push({
      sign: "Repeated or Prolonged Convulsions",
      severity: "CRITICAL",
      rationale: "IMNCI general danger sign indicating central nervous system pathology.",
      immediateAction: "Administer Diazepam rectally (0.5mg/kg) or IV. Prepare IV Artesunate.",
    });
    isSevere = true;
  }

  if (vitals.unableToDrinkOrBreastfeed || vitals.vomitingEverything) {
    redFlags.push({
      sign: "Inability to Drink / Vomiting Everything",
      severity: "CRITICAL",
      rationale: "Cannot tolerate oral ACTs or fluids; high dehydration and hypoglycemia risk.",
      immediateAction: "Establish IV access or NG tube; parenterally administer medications.",
    });
    isSevere = true;
  }

  if (examination.neckStiffness || examination.bulgingFontanelle || examination.kernigBrudzinskiSign) {
    redFlags.push({
      sign: "Meningeal Irritation (Neck Stiffness / Bulging Fontanelle)",
      severity: "CRITICAL",
      rationale: "Classic presentation of Acute Bacterial Meningitis.",
      immediateAction: "Immediate high-dose IV Ceftriaxone; prepare for lumbar puncture or rapid referral.",
    });
    isSevere = true;
  }

  if (examination.chestIndrawing) {
    redFlags.push({
      sign: "Subcostal Chest Indrawing",
      severity: "CRITICAL",
      rationale: "Severe respiratory distress indicating severe pneumonia.",
      immediateAction: "Oxygen, parenteral antibiotics, and urgent referral.",
    });
    isSevere = true;
  }

  // Differentials logic
  const differentials: any[] = [];
  const mrdtResult = tests.mrdtPf;
  const isMrdtPositive = mrdtResult === "Positive";
  const isMrdtNegative = mrdtResult === "Negative";

  if (isMrdtPositive || (!isMrdtNegative && (history.feverOnsetDays <= 3 || history.chillsRigors))) {
    differentials.push({
      diagnosis: isSevere ? "Severe / Complicated Malaria (P. falciparum)" : "Uncomplicated Malaria (P. falciparum)",
      probability: isMrdtPositive ? (isSevere ? 96 : 92) : 72,
      matchingCriteria: ["Fever", "High endemicity in Ghana", isMrdtPositive ? "mRDT Pf positive" : "Acute fever"].filter(Boolean),
      missingOrContradictoryCriteria: isMrdtNegative ? ["mRDT is negative - consider alternative focus"] : [],
      icdOrGhsCode: isSevere ? "GHS-MAL-02 (Severe Malaria)" : "GHS-MAL-01 (Uncomplicated Malaria)",
      severityLevel: isSevere ? "SEVERE" : "MODERATE",
      clinicalRationale: "Malaria accounts for the majority of febrile outpatient cases in Ghana. " + (isSevere ? "Meets GHS criteria for severe malaria due to danger signs." : "Standard outpatient presentation."),
    });
  }

  if (history.cough || isFastBreathing || examination.chestIndrawing) {
    differentials.push({
      diagnosis: isSevere || examination.chestIndrawing ? "Severe Community-Acquired Pneumonia" : "Pneumonia / Acute Lower Respiratory Infection",
      probability: examination.chestIndrawing ? 85 : 70,
      matchingCriteria: ["Cough", isFastBreathing ? "Tachypnea" : null, examination.chestIndrawing ? "Chest indrawing" : null].filter(Boolean),
      missingOrContradictoryCriteria: [],
      icdOrGhsCode: "GHS-RESP-03",
      severityLevel: examination.chestIndrawing ? "SEVERE" : "MODERATE",
      clinicalRationale: "Fast breathing and respiratory effort in a febrile child indicates lower airway involvement per IMNCI guidelines.",
    });
  }

  if (history.feverOnsetDays >= 4 || history.abdominalPain || history.diarrhea) {
    differentials.push({
      diagnosis: "Enteric (Typhoid) Fever / Salmonellosis",
      probability: history.feverOnsetDays >= 5 ? 65 : 40,
      matchingCriteria: [history.feverOnsetDays >= 4 ? `Prolonged fever (${history.feverOnsetDays} days)` : null, history.abdominalPain ? "Abdominal pain" : null].filter(Boolean),
      missingOrContradictoryCriteria: ["Requires blood or stool culture confirmation"],
      icdOrGhsCode: "GHS-ENT-01",
      severityLevel: "MODERATE",
      clinicalRationale: "Prolonged step-ladder fever with gastrointestinal symptoms in Ghana carries high index of suspicion for Salmonella typhi.",
    });
  }

  if (examination.neckStiffness || history.hasConvulsions || vitals.convulsionsPresent || avpu !== "Alert") {
    differentials.push({
      diagnosis: "Acute Bacterial Meningitis",
      probability: examination.neckStiffness ? 82 : 48,
      matchingCriteria: [examination.neckStiffness ? "Meningeal signs" : null, "Fever with neurological disturbance"].filter(Boolean),
      missingOrContradictoryCriteria: ["Requires CSF microscopy & culture"],
      icdOrGhsCode: "GHS-CNS-01",
      severityLevel: "LIFE_THREATENING",
      clinicalRationale: "Meningeal irritation or severe neurological alteration in febrile patient requires emergent empiric therapy.",
    });
  }

  differentials.sort((a, b) => b.probability - a.probability);

  // Testing Recommendations
  const isChps = facilityLevel === "CHPS Compound";
  const testingPlan = [
    {
      testName: "Malaria Rapid Diagnostic Test (mRDT - Pf HRP2)",
      priority: "IMMEDIATE",
      isAvailableLocally: true,
      requiresReferralOrSendout: false,
      expectedUtility: "Mandatory per Ghana NMEP before anti-malarial treatment.",
      localAlternativeIfUnavailable: "Blood film microscopy for malaria parasites (thick/thin).",
    },
    {
      testName: "Random Blood Glucose (RBG)",
      priority: isSevere ? "IMMEDIATE" : "RECOMMENDED",
      isAvailableLocally: true,
      requiresReferralOrSendout: false,
      expectedUtility: "Detect hypoglycemia, common fatal complication in pediatric febrile illness.",
      localAlternativeIfUnavailable: "Clinical trial of 10% Dextrose if unconscious.",
    },
    {
      testName: "Full Blood Count (FBC / CBC) with Differential",
      priority: isSevere ? "IMMEDIATE" : "RECOMMENDED",
      isAvailableLocally: !isChps,
      requiresReferralOrSendout: isChps,
      expectedUtility: "Assess severe anemia (Hb < 5g/dL), leukocytosis for bacterial sepsis, thrombocytopenia.",
      localAlternativeIfUnavailable: "HemoCue Hb test or conjunctival/palmar pallor inspection.",
    },
    {
      testName: "Urine Routine Examination & Dipstick",
      priority: "RECOMMENDED",
      isAvailableLocally: !isChps,
      requiresReferralOrSendout: isChps,
      expectedUtility: "Rule out occult urinary tract infection in unexplained fever.",
      localAlternativeIfUnavailable: "Urine dipstick at Health Centre.",
    },
  ];

  // Management Regimen Calculation (Weight-based)
  const primaryTreatment: any[] = [];
  const paracetamolDose = Math.round(weight * 15);

  primaryTreatment.push({
    medication: `Paracetamol ${ageYears < 6 ? "Syrup (120mg/5mL)" : "Tablets (500mg)"}`,
    dosage: ageYears < 6 ? `${Math.round((paracetamolDose / 120) * 5)} mL (${paracetamolDose} mg)` : `${weight > 45 ? "1000mg (2 tabs)" : "500mg (1 tab)"}`,
    route: "Oral",
    frequency: "Every 6-8 hours as needed for temp > 38.0°C",
    duration: "3 days",
    isAvailableInFacility: true,
    alternativeIfStockout: "Ibuprofen syrup (only if well-hydrated and >=6 months)",
    counselingNotes: "Do not exceed 4 doses in 24 hours. Encourage abundant oral fluids.",
  });

  if (isSevere) {
    const artesunateDoseMg = Math.round(weight * 2.4);
    primaryTreatment.push({
      medication: "Injectable Artesunate (IV/IM)",
      dosage: `${artesunateDoseMg} mg (2.4 mg/kg body weight)`,
      route: isChps ? "IM / Rectal pre-referral" : "IV",
      frequency: "At 0 hours, 12 hours, 24 hours, then once daily",
      duration: "Minimum 24 hours (3 doses), then switch to full 3-day oral ACT once patient tolerates",
      isAvailableInFacility: !isChps,
      alternativeIfStockout: "IM Artemether 3.2 mg/kg stat then 1.6 mg/kg daily OR Rectal Artesunate capsule 100mg",
      counselingNotes: "Reconstitute with 5% sodium bicarbonate and saline strictly per GHS protocol.",
    });

    if (examination.neckStiffness || isSevere) {
      primaryTreatment.push({
        medication: "IV Ceftriaxone",
        dosage: `${Math.min(2000, Math.round(weight * (examination.neckStiffness ? 100 : 50)))} mg`,
        route: "IV",
        frequency: "Once daily (or divided BD for meningitis)",
        duration: "7 - 10 days",
        isAvailableInFacility: facilityLevel === "District Hospital" || facilityLevel === "Regional Hospital" || facilityLevel === "Regional/Teaching Hospital",
        alternativeIfStockout: "IV/IM Ampicillin + Gentamicin",
        counselingNotes: "Infuse over 30 minutes. Monitor IV site.",
      });
    }
  } else {
    // Uncomplicated ACT
    let actDose = "1 tablet (20/120mg) BD";
    if (weight >= 15 && weight < 25) actDose = "2 tablets (20/120mg) BD";
    else if (weight >= 25 && weight < 35) actDose = "3 tablets (20/120mg) BD";
    else if (weight >= 35) actDose = "4 tablets (20/120mg) BD";

    if (patient.isPregnant && patient.pregnancyTrimester === "1st") {
      primaryTreatment.push({
        medication: "Oral Quinine + Clindamycin",
        dosage: "Quinine 10mg/kg (max 600mg) TDS + Clindamycin 300mg BD",
        route: "Oral",
        frequency: "Three times daily",
        duration: "7 days",
        isAvailableInFacility: true,
        alternativeIfStockout: "Artemether-Lumefantrine (if Quinine unavailable in 1st trimester per GHS update)",
        counselingNotes: "1st trimester pregnancy recommendation per Ghana STG. Complete all 7 days.",
      });
    } else {
      primaryTreatment.push({
        medication: "Artemether-Lumefantrine (Coartem) 20/120mg",
        dosage: actDose,
        route: "Oral",
        frequency: "Twice daily (0h, 8h on Day 1; then BD on Days 2 & 3)",
        duration: "3 days (Total 6 doses)",
        isAvailableInFacility: true,
        alternativeIfStockout: "Artesunate-Amodiaquine (ASAQ) fixed-dose combination once daily for 3 days",
        counselingNotes: "MUST take with fatty food or milk for proper absorption of lumefantrine. Complete all 6 doses.",
      });
    }

    if (history.cough && isFastBreathing) {
      primaryTreatment.push({
        medication: "Amoxicillin Dispersible Tablets (250mg)",
        dosage: `${Math.round(weight * 40)} mg (approx. ${Math.max(1, Math.round(weight / 6))} tabs)`,
        route: "Oral",
        frequency: "Twice daily (every 12 hours)",
        duration: "5 days",
        isAvailableInFacility: true,
        alternativeIfStockout: "Amoxicillin/Clavulanate or Erythromycin",
        counselingNotes: "Disperse tablet in 5-10 mL of clean water or breastmilk before giving.",
      });
    }
  }

  const referralNeeded = isSevere && (isChps || facilityLevel === "Health Centre");

  return {
    redFlags,
    isSevere,
    requiresImmediateReferral: referralNeeded,
    suggestedNextQuestions: [
      {
        question: "Has the patient had any convulsions or rolling of eyes in the last 24 hours?",
        purpose: "Exclude cerebral complications / complex febrile seizures.",
        targetCondition: "Severe Malaria / Meningitis",
        importance: "HIGH",
      },
      {
        question: "Can the patient drink liquids or breastfeed, or do they vomit everything?",
        purpose: "Determine route of administration and need for IV therapy.",
        targetCondition: "IMNCI General Danger Signs",
        importance: "HIGH",
      },
      {
        question: "Have you noticed any neck stiffness, photophobia, or unusual shrill crying?",
        purpose: "Screen for meningococcal or pneumococcal meningitis.",
        targetCondition: "Acute Bacterial Meningitis",
        importance: "MEDIUM",
      },
      {
        question: "What medications, home treatments, or herbal syrups have already been administered?",
        purpose: "Prevent toxicity, identify prior failed ACT, or drug interactions.",
        targetCondition: "Treatment History & Resistance",
        importance: "MEDIUM",
      },
    ],
    suggestedExaminations: [
      {
        procedure: "Check for Neck Rigidity & Kernig's Sign",
        clinicalSignToLookFor: "Resistance to passive neck flexion or pain on knee extension.",
        rationale: "Crucial in Harmattan/Meningitis belt season and febrile toxic patients.",
      },
      {
        procedure: "Examine Palmar and Conjunctival Pallor",
        clinicalSignToLookFor: "Severe pale palmar creases (indicates severe anemia Hb < 5 g/dL).",
        rationale: "Severe malarial anemia is a primary cause of mortality in under-5s.",
      },
      {
        procedure: "Count Respiratory Rate for 60 Seconds & Look for Chest Indrawing",
        clinicalSignToLookFor: "Lower chest wall indraws when inhaling; fast breathing rate.",
        rationale: "Differentiates pneumonia vs compensation for metabolic acidosis.",
      },
    ],
    differentials,
    testingPlan,
    managementPlan: {
      primaryTreatment,
      supportiveCare: [
        "Encourage generous oral fluids (water, coconut water, ORS, breastmilk).",
        "Tepid sponging with lukewarm water for temperatures > 38.5°C.",
        "Sleep under insecticide-treated bed net (ITN).",
        "Nutrition: Continue feeding and offer frequent small nutritious meals.",
      ],
      monitoringParameters: [
        "Temperature checks every 4-6 hours.",
        "Assess resolution of fever within 48-72 hours of ACT.",
        "Return immediately if danger signs develop (convulsion, vomiting everything, difficulty breathing).",
      ],
      referralGuidance: {
        isReferralNeeded: referralNeeded,
        referralUrgency: isSevere ? "IMMEDIATE_EMERGENCY" : "NONE",
        targetFacilityLevel: isChps ? "Health Centre" : "District Hospital",
        preReferralStabilization: [
          "Administer single stat pre-referral dose of IM/Rectal Artesunate.",
          "Give first dose of IM Ampicillin/Ceftriaxone if bacterial sepsis or meningitis suspected.",
          "Give oral sugar water or IV 10% Dextrose (5 mL/kg) to prevent hypoglycemia during transit.",
          "Keep patient warm and arrange emergency transport.",
        ],
        sbarSummary: {
          situation: `${patient.name || "Patient"} (${patient.age || 5} ${patient.ageUnit || "years"}, ${weight} kg) presenting with acute fever (${temp}°C) and ${redFlags.map((r: any) => r.sign).join(", ") || "febrile symptoms"}.`,
          background: `Evaluated at ${facilityLevel} by ${cadre}. Weight ${weight}kg. Prior history: ${history.feverOnsetDays || 2} days of fever.`,
          assessment: `Suspected ${differentials[0]?.diagnosis || "Severe Febrile Illness"}. Severity: ${isSevere ? "SEVERE" : "Moderate"}.`,
          recommendation: referralNeeded ? `Immediate transfer to ${isChps ? "District Hospital" : "Regional Hospital"} for IV therapeutics, blood transfusion, and continuous monitoring.` : "Manage locally with close follow-up in 48 hours.",
        },
      },
    },
    cadreSpecificAdvice: `Guidance for ${cadre}: Ensure IMNCI red flags are thoroughly checked. Verify exact weight (${weight} kg) before dispensing medications. Record all pre-referral doses in GHS transfer book.`,
    cognitiveSummaryText: isSevere
      ? `🚨 RED FLAG DETECTED: This case meets criteria for ${differentials[0]?.diagnosis}. Prioritize airway, breathing, circulation, immediate parenteral stabilization, and referral.`
      : `✅ Manageable at ${facilityLevel}. Primary recommendation is ${differentials[0]?.diagnosis} protocol with weight-calculated ${primaryTreatment[1]?.medication || primaryTreatment[0]?.medication}.`,
  };
}

// Built-in Ghana STG Knowledge Base for instant search
const GHANA_LOCAL_KNOWLEDGE_TOPICS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["artemether", "lumefantrine", "coartem", "dosage", "weight", "act"],
    answer: `**Ghana STG Dosage for Artemether-Lumefantrine (20/120mg) by Weight:**
- **5 to < 15 kg**: 1 tablet BD for 3 days (Total 6 tablets)
- **15 to < 25 kg**: 2 tablets BD for 3 days (Total 12 tablets)
- **25 to < 35 kg**: 3 tablets BD for 3 days (Total 18 tablets)
- **≥ 35 kg / Adults**: 4 tablets BD for 3 days (Total 24 tablets)

*Timing*: Day 1: 0h and 8h; Day 2: Morning & Evening (12h apart); Day 3: Morning & Evening (12h apart).
*Important*: MUST be taken with fatty food or milk for lumefantrine bioavailability. If patient vomits within 30 minutes, repeat full dose.`
  },
  {
    keywords: ["pregnancy", "1st trimester", "trimester", "pregnant"],
    answer: `**Malaria in Pregnancy (Ghana National Guidelines):**
- **1st Trimester (Uncomplicated)**:
  - *First-line*: Oral Quinine 10 mg/kg (max 600mg) 8-hourly + Clindamycin 300mg 12-hourly for 7 days.
  - *Alternative (if Quinine unavailable)*: Artemether-Lumefantrine (AL) is approved if Quinine is unavailable.
- **2nd & 3rd Trimesters (Uncomplicated)**:
  - Artemether-Lumefantrine (AL) or Artesunate-Amodiaquine (ASAQ) for 3 days.
- **Severe Malaria (Any Trimester)**:
  - **IV Artesunate 2.4 mg/kg** at 0h, 12h, 24h, then daily. Saving the mother's life takes precedence. Do NOT withhold IV Artesunate.`
  },
  {
    keywords: ["pre-referral", "chps", "severe malaria", "rectal artesunate", "referral"],
    answer: `**Pre-Referral Protocol for Severe Malaria at CHPS / Health Centre:**
1. **Parenteral / Rectal Antimalarial**:
   - Give single stat dose of **Rectal Artesunate (100mg capsule)**:
     - 2 months to 1 year: 1 capsule (100mg)
     - 1 to 3 years: 2 capsules (200mg)
     - 4 to 5 years: 3 capsules (300mg)
   - Or administer single stat **IM Artesunate (2.4 mg/kg)**.
2. **Prevent Transit Hypoglycemia**: Give oral sugar water, breastmilk, or IV 10% Dextrose (5 mL/kg).
3. **Control Pyrexia**: Tepid sponge with lukewarm water, Paracetamol 15mg/kg.
4. **Transport**: Arrange immediate emergency referral with structured GHS SBAR handover notes.`
  },
  {
    keywords: ["fast breathing", "respiratory", "imnci", "pneumonia", "threshold", "breathing rate"],
    answer: `**GHS IMNCI Fast Breathing Thresholds (Counted for full 60 seconds in calm child):**
- **Age < 2 months**: ≥ 60 breaths per minute
- **Age 2 to 11 months**: ≥ 50 breaths per minute
- **Age 12 to 59 months (1 - 5 yrs)**: ≥ 40 breaths per minute
- **Age ≥ 5 years / Adults**: ≥ 28-30 breaths per minute

*Treatment (Non-severe Pneumonia)*: Amoxicillin dispersible tablets 80-90 mg/kg/day divided BD for 5 days.
*Chest Indrawing / SpO2 < 90%*: Severe Pneumonia -> Urgent IV Ampicillin + Gentamicin or Ceftriaxone + Oxygen.`
  },
  {
    keywords: ["meningitis", "ceftriaxone", "csf", "neck stiffness", "harmattan"],
    answer: `**Acute Bacterial Meningitis (GHS Protocol):**
- **Clinical Signs**: High fever, neck rigidity, positive Kernig/Brudzinski signs, bulging fontanelle, altered sensorium, petechial rash.
- **Immediate Treatment**:
  - **IV Ceftriaxone 100 mg/kg/day** (up to 4g daily in adults) given once daily or divided BD for 7-10 days.
  - Plus **IV Dexamethasone** 0.15 mg/kg 6-hourly for 4 days (given with or just before first antibiotic dose) to reduce hearing loss and neurological sequelae.
- **Diagnostic Action**: Lumbar Puncture for CSF microscopy, Gram stain, protein, glucose, and culture.`
  },
  {
    keywords: ["typhoid", "enteric", "widal", "salmonella"],
    answer: `**Enteric (Typhoid) Fever (GHS Standard Guidelines):**
- **Presentation**: Step-ladder fever (>5 days), dull headache, coated tongue, relative bradycardia (Faget's sign), abdominal pain/splenomegaly.
- **Diagnosis**: Blood culture (gold standard early in week 1-2), stool culture (week 2-3). *Widal test*: High false-positivity in endemic Ghana; single test is non-diagnostic unless TO/TH ≥ 1:160 with clinical correlation.
- **Treatment**:
  - *Adults (Uncomplicated)*: Ciprofloxacin 500mg BD x 7-10 days or Azithromycin 500mg OD x 7 days.
  - *Pediatrics*: Azithromycin 10-20 mg/kg OD x 7 days or Cefixime 10-20 mg/kg/day divided BD.
  - *Severe / Inpatient*: IV Ceftriaxone 2g daily for 10-14 days.`
  }
];

// RAG Search / Guidelines lookup endpoint
app.post("/api/gemini/rag-search", async (req, res) => {
  const { query, cadre } = req.body;
  const normalizedQuery = (query || "").toLowerCase();

  const cached = getCached(ragCache, normalizedQuery);
  if (cached) {
    return res.json({ success: true, source: "cache", answer: cached });
  }

  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `You are the Ghana Health Service Medical Guideline Assistant.
System Guidelines Knowledge:
${GHANA_GUIDELINES_RAG_CONTEXT}

User Cadre: ${cadre || "General Healthcare Provider in Ghana"}
User Clinical Query: "${query}"

Provide a concise, direct, authoritative answer quoting exact Ghana STG / IMNCI dosages, clinical thresholds, and referral criteria. Keep it clear, practical, and immediately actionable for a frontline health worker in Ghana.`,
      });

      const ans = response.text || "";
      if (ans.trim()) {
        setCached(ragCache, normalizedQuery, ans);
        return res.json({
          success: true,
          source: "gemini-ai",
          answer: ans,
        });
      }
    } catch (err: any) {
      console.log("Note: RAG using local Ghana knowledge base (Gemini fallback):", err?.status || err?.message || "fallback");
    }
  }

  // Local Ghana STG Knowledge Base Matching
  let bestMatch = GHANA_LOCAL_KNOWLEDGE_TOPICS.find((topic) =>
    topic.keywords.some((kw) => normalizedQuery.includes(kw))
  );

  let fallbackAnswer = bestMatch
    ? bestMatch.answer
    : `**Ghana Standard Treatment Guidelines Summary for "${query}":**
- **Uncomplicated Malaria**: Artemether-Lumefantrine (AL) 20/120mg twice daily with fatty food for 3 days. Mandatory mRDT confirmation prior to dispensing.
- **Severe Malaria**: IV Artesunate 2.4 mg/kg at 0h, 12h, 24h, then daily. Pre-referral at CHPS: single stat Rectal Artesunate (100mg capsule) or IM Artesunate.
- **Pediatric Fast Breathing**: <2 mos (≥60 bpm), 2-11 mos (≥50 bpm), 12-59 mos (≥40 bpm). Oral Amoxicillin dispersible tablets 80-90 mg/kg/day BD x 5d.
- **Enteric Fever (Typhoid)**: Blood culture confirmation. Ciprofloxacin 500mg BD or Azithromycin 500mg OD for 7 days.`;

  setCached(ragCache, normalizedQuery, fallbackAnswer);
  return res.json({
    success: true,
    source: "ghana-stg-rag",
    answer: fallbackAnswer,
  });
});

// Knowledge Base Direct Access Endpoints for Healthcare Professionals
app.get("/api/kb/guidelines", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "backend", "kb", "guidelines.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return res.json({ success: true, data });
    }
    return res.status(404).json({ success: false, message: "guidelines.json not found" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

app.get("/api/kb/chunks", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "backend", "kb", "chunks.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return res.json({ success: true, data });
    }
    return res.status(404).json({ success: false, message: "chunks.json not found" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

app.get("/api/kb/registry", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "backend", "kb", "registry.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return res.json({ success: true, data });
    }
    return res.status(404).json({ success: false, message: "registry.json not found" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

app.post("/api/kb/retrieve", (req, res) => {
  try {
    const retrieval = require("./backend/kb/retrieval.js");
    const result = retrieval.retrieve(req.body.encounter || req.body, req.body.options || {});
    return res.json({ success: true, result });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

app.post("/api/kb/vitals-assess", (req, res) => {
  try {
    const assessment = require("./backend/kb/vitals-assessment.js");
    const result = assessment.assessVitals(req.body.vitals || req.body, req.body.options || {});
    return res.json({ success: true, result });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// Vite middleware for dev or static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ghana Febrile CDSS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
