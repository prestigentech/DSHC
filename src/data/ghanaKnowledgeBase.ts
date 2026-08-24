// Ghana Standard Treatment Guidelines & Clinical Knowledge Base
// Grounded in Ghana STG 7th Ed. 2017, Ghana EML 2017, IDSR Guidelines, and IMCI

export interface KBCondition {
  id: string;
  name: string;
  priority: number;
  keywords: string[];
  supporting_features: string;
  discriminators: string;
  danger_signs: string[];
  confirmatory_test: string;
  first_line_management: string;
  stg_reference: string;
  medicines_cited?: string[];
  source_page?: number[];
  source_section?: string;
  extracted_from?: string | null;
}

export interface KBThreshold {
  id: string;
  label: string;
  applies_to: string;
  rule: string;
  note: string;
}

export interface KBRedFlag {
  id: string;
  label: string;
  action: string;
}

export interface KBSurveillanceCase {
  id: string;
  linked_condition: string;
  disease: string;
  case_definition: string;
  priority_category: string;
  notification_type: string;
  document_id: string;
  source_page?: number[];
  source_section?: string;
  extracted_from?: string;
  keywords: string[];
}

export interface KBEssentialMedicine {
  medicine: string;
  formulations: {
    form: string;
    strength: string | null;
    level_of_care: string | null;
    nhis_status: string;
    note?: string;
  }[];
  document_id: string;
  source_page: number[];
  extracted_from: string;
}

export const GHANA_KB_META = {
  title: "DSHC Febrile Illness Guideline Knowledge Base",
  scope: "Adult and paediatric febrile presentations in Ghanaian primary care",
  sources: [
    "Standard Treatment Guidelines, Ghana (Ministry of Health / GHS), 7th ed. 2017",
    "Ghana Essential Medicines List (EML), 7th ed. 2017",
    "Ghana Integrated Disease Surveillance and Response (IDSR) Technical Guidelines",
    "WHO Integrated Management of Childhood Illness (IMCI) chart booklet"
  ],
  version: "1.0.0",
  disclaimer: "Assistive decision support only. Grounded reference for healthcare professionals."
};

export const GHANA_KB_THRESHOLDS: KBThreshold[] = [
  {
    id: "temp_fever_adult",
    label: "Fever",
    applies_to: "all",
    rule: "Temperature >= 38.0 °C",
    note: "Axillary; confirm if borderline."
  },
  {
    id: "rr_high_adult",
    label: "Tachypnoea (adult)",
    applies_to: "adult",
    rule: "Respiratory rate >= 30/min",
    note: "Concerning; consider LRTI, sepsis, acidosis."
  },
  {
    id: "spo2_low",
    label: "Hypoxaemia",
    applies_to: "all",
    rule: "SpO2 < 94%",
    note: "< 90% is a danger sign requiring oxygen and referral."
  },
  {
    id: "hr_high_adult",
    label: "Tachycardia (adult)",
    applies_to: "adult",
    rule: "Heart rate >= 100/min at rest",
    note: "Interpret with fever and volume status."
  },
  {
    id: "sbp_low",
    label: "Hypotension",
    applies_to: "adult",
    rule: "Systolic BP < 90 mmHg",
    note: "Possible sepsis/shock — danger sign."
  },
  {
    id: "child_rr_fast",
    label: "Fast breathing (child)",
    applies_to: "child",
    rule: "IMCI age-banded: >=50/min (2-11mo), >=40/min (1-5y)",
    note: "Classifies pneumonia in IMCI."
  },
  {
    id: "child_crt",
    label: "Delayed capillary refill (child)",
    applies_to: "child",
    rule: "Capillary refill > 3 seconds",
    note: "Danger sign — impaired perfusion."
  }
];

export const GHANA_KB_RED_FLAGS: KBRedFlag[] = [
  {
    id: "rf_consciousness",
    label: "Altered consciousness / lethargy / unable to drink",
    action: "Stabilise and refer urgently. Consider severe malaria, meningitis, sepsis."
  },
  {
    id: "rf_neck",
    label: "Neck stiffness / bulging fontanelle / photophobia",
    action: "Treat as possible meningitis: first antibiotic dose, urgent referral."
  },
  {
    id: "rf_convulsion",
    label: "Convulsions / seizures",
    action: "Protect airway, treat convulsion, exclude hypoglycaemia; urgent referral."
  },
  {
    id: "rf_resp_distress",
    label: "Severe respiratory distress / SpO2 < 90%",
    action: "Give oxygen, first antibiotic dose if pneumonia, refer."
  },
  {
    id: "rf_shock",
    label: "Signs of shock (cold peripheries, weak pulse, SBP < 90)",
    action: "IV fluids per protocol, refer urgently."
  },
  {
    id: "rf_bleeding",
    label: "Spontaneous bleeding / petechiae",
    action: "Consider severe dengue, viral haemorrhagic fever, sepsis; refer."
  },
  {
    id: "rf_jaundice",
    label: "Jaundice with fever",
    action: "Consider severe malaria, viral hepatitis, leptospirosis; refer for investigation."
  }
];

export const GHANA_KB_CONDITIONS: KBCondition[] = [
  {
    id: "malaria",
    name: "Malaria",
    priority: 1,
    keywords: ["fever", "chills", "rigors", "sweating", "headache", "body pains", "myalgia", "malaise", "vomiting", "loss of appetite", "anaemia", "splenomegaly", "travel"],
    supporting_features: "Fever, chills, rigors, sweating, headache, generalized body and joint pain, nausea and/or vomiting, loss of appetite, abdominal pain (especially in children), irritability and refusal to feed (in infants). Signs: fever, mild pallor, mild jaundice, splenomegaly.",
    discriminators: "Very common cause of fever in an endemic setting; a negative RDT does not exclude malaria if suspicion remains — repeat testing or microscopy. Investigations: microscopy (thick and thin films), RDT, FBC.",
    danger_signs: [
      "Poor oral intake (e.g. breast milk in children)",
      "Repeated profuse vomiting",
      "Dark or cola-coloured urine (haemoglobinuria)",
      "Passing very little urine (oliguria)",
      "Difficulty breathing / rapid breathing (tachypnoea)",
      "Generalised weakness, inability to walk or sit without assistance",
      "Altered consciousness (change of behaviour, confusion, delirium, coma)",
      "Repeated generalized convulsions",
      "Hyperpyrexia (axillary temperature > 38.5°C)",
      "Extreme pallor / severe anaemia (Hb < 5 g/dl)",
      "Circulatory collapse or shock (cold limbs, weak rapid pulse)"
    ],
    confirmatory_test: "Rapid diagnostic test; blood film for malaria parasites (thick and thin); FBC; sickling test; random blood glucose; U&E and creatinine; lumbar puncture in the convulsing/comatose patient to exclude meningitis.",
    first_line_management: "Uncomplicated malaria: per Ghana STG artemisinin-based combination therapy tables (e.g. Artesunate + Amodiaquine co-blistered, weight/age-banded dosing over 3 days). Severe malaria — pre-referral treatment [A]: Artesunate IM 2.4 mg/kg (adults and children >20 kg) or 3 mg/kg (children <20 kg); or Artemether IM 3.2 mg/kg; or rectal Artesunate 10 mg/kg (preferred in children under 6 years, weight-banded suppository doses); or IM Quinine (10 mg/kg = 0.2 ml of 50 mg/ml dilution, 8-hourly, weight-banded volumes for children; 10 mg/kg 8-hourly by deep IM to max 600 mg in adults). Start pre-referral treatment without delay once severe malaria is suspected — do not wait for confirmation.",
    stg_reference: "Ghana STG 2017, 7th Ed. — Ch.18 Infectious Diseases and Infestations, §186–188 Malaria / Severe Malaria",
    source_page: [482, 483, 486, 487, 488],
    source_section: "Chapter 18: Infectious Diseases and Infestations — 186–188. Malaria / Uncomplicated Malaria / Severe Malaria",
    extracted_from: "GHANA-STG-2017-1__2_.pdf (7th Edition 2017)",
    medicines_cited: [
      "artesunate",
      "artesunate + amodiaquine",
      "artemether",
      "artemether + lumefantrine",
      "dihydroartemisinin + piperaquine",
      "quinine",
      "sulfadoxine + pyrimethamine"
    ]
  },
  {
    id: "typhoid",
    name: "Typhoid (enteric) fever",
    priority: 2,
    keywords: ["fever", "abdominal pain", "abdominal tenderness", "constipation", "diarrhea", "diarrhoea", "headache", "malaise", "loss of appetite", "stepwise fever", "relative bradycardia", "rose spots"],
    supporting_features: "Fever that increases gradually to a high fever and persists for weeks, not responding to antimalarials. Constipation in early stages; abdominal pain and diarrhoea in the second week. Severe headache, dry cough, psychosis/confusion may occur. Signs: high fever with relatively slow pulse (occasionally fast, e.g. with myocarditis or perforation), abdominal tenderness, tender hepato-splenomegaly, confusion, signs of chest infection.",
    discriminators: "Diagnosis is based on strong clinical suspicion plus culture: blood culture positive in the first 10 days of fever, stool culture positive from day 10 to week 4-5, urine culture positive in weeks 2-3. These are superior to the Widal test, which is unreliable and rarely useful.",
    danger_signs: [
      "Intestinal perforation with peritonitis",
      "Bloody stools",
      "Acute psychosis",
      "Severe intravascular haemolysis leading to acute kidney injury (especially in G6PD deficiency)"
    ],
    confirmatory_test: "FBC with differential; RDT/blood film for malaria (to exclude); blood culture; stool culture; urine culture.",
    first_line_management: "1st line [B]: Ciprofloxacin oral, adults 500 mg 12-hourly for 10-14 days, children 10 mg/kg 12-hourly for 10-14 days; or Ciprofloxacin IV (over 60 min), adults 400 mg 8-12-hourly for 10-14 days, children 10 mg/kg (max 400 mg) 12-hourly for 10-14 days. At first sign of tendon pain/inflammation, discontinue and switch (e.g. Azithromycin/Ceftriaxone). 2nd line [B]: Ceftriaxone IV, adults 2-4 g daily for 7-10 days, children 100 mg/kg daily for 7-10 days; or Azithromycin oral, adults 500 mg daily for 7 days, children 10-20 mg/kg for 7 days.",
    stg_reference: "Ghana STG 2017, 7th Ed. — Ch.18 Infectious Diseases and Infestations, §185 Typhoid Fever",
    source_page: [479, 480, 481],
    source_section: "Chapter 18: Infectious Diseases and Infestations — 185. Typhoid Fever",
    extracted_from: "GHANA-STG-2017-1__2_.pdf (7th Edition 2017)",
    medicines_cited: ["ciprofloxacin", "ceftriaxone", "azithromycin"]
  },
  {
    id: "lrti_pneumonia",
    name: "Lower respiratory tract infection / Pneumonia",
    priority: 2,
    keywords: ["fever", "cough", "difficulty breathing", "fast breathing", "shortness of breath", "chest pain", "sputum", "crackles", "decreased breath sounds", "tachypnoea", "respiratory"],
    supporting_features: "Fever with short history, productive cough, sputum (rusty/blood-stained/yellow/green), pleuritic chest pain worse on deep breathing/coughing, breathlessness, sweating, muscle aches. Elderly/immunocompromised may have minimal or no symptoms. Signs: rapid breathing, grunting (children), accessory muscle use and nasal flaring, lower chest wall indrawing (children), restricted chest movement, fever, rapid pulse, low BP possible, signs of consolidation/pleural effusion, restlessness/confusion/drowsiness, SpO2 < 92%.",
    discriminators: "Severity assessed by CURB-65 (confusion; BUN >7 mmol/L; RR ≥30/min adults or ≥50/min children; systolic BP <90 or diastolic <60; age <5 or ≥65y) — 1 point each, max 5. 0-1: consider home treatment. 2-3: consider short inpatient admission. >3: admit, consider ICU. Any of these also mandates hospitalisation: coexisting chronic lung/heart/renal disease, multilobe involvement, SpO2 <92% on room air, severe tachycardia.",
    danger_signs: [
      "CURB-65 score > 3",
      "SpO2 < 92% on room air",
      "Restricted chest movement with signs of consolidation or pleural effusion",
      "Restlessness, confusion, or drowsiness"
    ],
    confirmatory_test: "FBC; CRP; chest X-ray; sputum gram stain, culture and sensitivity; Ziehl-Neelsen stain (to exclude TB); blood culture and sensitivity; blood urea and electrolytes.",
    first_line_management: "Ambulatory (severity score <2), 1st line [A]: Amoxicillin oral, adults 1 g 8-hourly for 7 days, weight/age-banded paediatric doses, plus Azithromycin oral 500 mg daily for 6 days (children 10 mg/kg daily for 6 days); or Erythromycin if penicillin-allergic. 2nd line [A]: Cefuroxime oral or Doxycycline oral (not in pregnancy, lactation, or children <8y). Hospitalised (severity score ≥2 or additional factors): oxygen to maintain SpO2 >92%, IV fluids, Paracetamol, plus Amoxicillin+Clavulanic Acid IV and Azithromycin (oral or IV, step down to oral 500 mg daily once stable to complete 7 days) — IV azithromycin not used for paediatric pneumonia.",
    stg_reference: "Ghana STG 2017, 7th Ed. — Ch.8 Disorders of the Respiratory System, §59 Pneumonia",
    source_page: [169, 170, 171, 172, 173],
    source_section: "Chapter 8: Disorders of the Respiratory System — 59. Pneumonia",
    extracted_from: "GHANA-STG-2017-1__2_.pdf (7th Edition 2017)",
    medicines_cited: ["amoxicillin", "azithromycin", "erythromycin", "cefuroxime", "doxycycline", "amoxicillin + clavulanic acid", "paracetamol", "oxygen"]
  },
  {
    id: "meningitis",
    name: "Meningitis",
    priority: 1,
    keywords: ["fever", "headache", "neck stiffness", "photophobia", "altered consciousness", "confusion", "seizures", "convulsions", "bulging fontanelle", "irritability", "rash", "neurological"],
    supporting_features: "Adults and children >5 years: fever, neck pain, severe headache, photophobia, change in behaviour, convulsions, vomiting. Children <1 year: fever, irritability, refusal to eat, poor sucking, vomiting, drowsiness and weak cry, focal or generalized convulsions, lethargy, bulging fontanelle. Signs (>5y): fever, neck stiffness, positive Kernig's sign, altered consciousness, coma. Signs (<1y): neck retraction, presence/absence of neck stiffness or fever, bulging fontanelle, coma, hypo/hypertonia, convulsion.",
    discriminators: "Cerebrospinal Meningitis (Neisseria meningitidis) is common in Northern and Upper regions of Ghana, usually in epidemics during harmattan season. Presentation may be confused with cerebral malaria — investigate for both.",
    danger_signs: [
      "Meningitis is a medical emergency in itself",
      "Altered consciousness or coma",
      "Positive Kernig's sign with fever and neck stiffness",
      "Focal or generalized convulsions",
      "Bulging fontanelle (infants)"
    ],
    confirmatory_test: "FBC; RDT and blood film for malaria (to exclude cerebral malaria); lumbar puncture (only after excluding raised intracranial pressure); blood culture and sensitivity.",
    first_line_management: "Bacterial meningitis 1st line [A]: Ceftriaxone IV/deep IM, adults 2-4 g daily for 7-10 days, children >12y 2-4 g daily for 7-10 days, <12y 50-80 mg/kg for 10-14 days, neonates 20-50 mg/kg once daily for 21 days, and Vancomycin IV 15 mg/kg (adults and children >1 month, dosing interval by age, 7-14 days; not recommended <1 month). Alternative [B]: Benzylpenicillin IV + Chloramphenicol IV. Dexamethasone IV 4-10 mg 6-hourly for 5-7 days started with the first antibiotic dose reduces hearing loss and death. Prophylaxis for close contacts and pre-discharge: Ciprofloxacin oral single dose or Ceftriaxone IM single dose. Notify regional/district health authorities immediately in epidemic meningitis.",
    stg_reference: "Ghana STG 2017, 7th Ed. — Ch.18 Infectious Diseases and Infestations, §191 Meningitis",
    source_page: [495, 496, 497, 498],
    source_section: "Chapter 18: Infectious Diseases and Infestations — 191. Meningitis",
    extracted_from: "GHANA-STG-2017-1__2_.pdf (7th Edition 2017)",
    medicines_cited: ["ceftriaxone", "vancomycin", "benzyl penicillin", "chloramphenicol", "clindamycin", "dexamethasone", "ciprofloxacin", "cefotaxime"]
  },
  {
    id: "uti",
    name: "Urinary tract infection",
    priority: 3,
    keywords: ["fever", "dysuria", "burning urination", "frequency", "urgency", "flank pain", "loin pain", "suprapubic pain", "cloudy urine", "haematuria", "urinary"],
    supporting_features: "Frequent painful urination (dysuria), haematuria, cloudy or foul-smelling urine, vomiting, suprapubic pain. Fever may be persistent and unexplained, especially in children. Signs: fever, loin tenderness, suprapubic tenderness, foul-smelling urine.",
    discriminators: "Congenital genitourinary abnormalities predispose children to UTI; proven or recurrent UTI in a child requires further urogenital evaluation. In children, symptoms can be non-specific (feeding problems, diarrhoea, failure to thrive). Definitive treatment depends on culture and sensitivity; empirical treatment may be started while awaiting the report.",
    danger_signs: [],
    confirmatory_test: "FBC; mid-stream urine specimen for microscopy, culture and sensitivity (re-culture after treatment); abdominal ultrasound in children if indicated.",
    first_line_management: "Uncomplicated UTI — 1st line: Ciprofloxacin oral, adults 500 mg 12-hourly for 7 days (female), 10-14 days (male); children 15-20 mg/kg 12-hourly (max 750 mg/day in 2 divided doses). Or Cefuroxime oral, adults 250-500 mg 12-hourly for 5-7 days (female), 10-14 days (male); children 12-18y 250 mg 12-hourly for 5-7 days, 2-12y 15 mg/kg 12-hourly (max 250 mg) for 5-7 days, 3mo-2y 10 mg/kg 12-hourly (max 125 mg) for 5-7 days. Complicated UTI (catheter-related, stones, prostate enlargement, urologic abnormality, pregnancy) — IV therapy: Ciprofloxacin IV 400 mg 8-12-hourly for 7 days (adults, over 60 min); or Gentamicin IV (if renal function normal); or Ceftriaxone IV 1-2 g daily for 7 days (adults). Non-pharmacological: liberal oral fluids, personal hygiene/cleaning after defaecation.",
    stg_reference: "Ghana STG 2017, 7th Ed. — Ch.14 Disorders of the Kidney and Genitourinary System, §139 Urinary Tract Infection",
    source_page: [401, 402, 403],
    source_section: "Chapter 14: Disorders of the Kidney and Genitourinary System — 139. Urinary Tract Infection",
    extracted_from: "GHANA-STG-2017-1__2_.pdf (7th Edition 2017)",
    medicines_cited: ["ciprofloxacin", "cefuroxime", "gentamicin", "ceftriaxone"]
  },
  {
    id: "measles",
    name: "Measles",
    priority: 3,
    keywords: ["fever", "rash", "maculopapular rash", "cough", "coryza", "runny nose", "conjunctivitis", "red eyes", "koplik", "child"],
    supporting_features: "Runny nose, cough, red eyes, sore mouth, high fever present before the rash appears, maculo-papular rash starting on face and neck, diarrhoea, generally miserable child. Signs: fever, conjunctivitis, Koplik spots (white grain-like spots on buccal mucosa, 2 days before rash), itchy generalised maculo-papular rash.",
    discriminators: "Occurs mainly in unimmunised or incompletely immunised children 6 months–3 years. Infectious from up to 7 days before to 5 days after the rash appears. Diagnosis is mainly clinical; disease is uncommon where immunisation coverage is high. Report all cases to the District Disease Control Officer.",
    danger_signs: [
      "Black (haemorrhagic) rash",
      "Stridor",
      "Pneumonia",
      "Coma",
      "Great difficulty eating or drinking",
      "Dehydration or malnutrition"
    ],
    confirmatory_test: "Usually none required; Measles IgM antibody assay if confirmation is needed.",
    first_line_management: "Supportive — no specific antiviral treatment; antibiotics not required except for specific complications. Paracetamol for pain/fever [C], age-banded dosing. Vitamin A oral [A] to prevent eye complications: >1y 200,000 units daily for 2 days; 6-11mo 100,000 units daily for 2 days; <6mo 50,000 units daily for 2 days. Tepid sponging, oral hygiene, soft high-calorie feeding, eye washing with clean water, calamine lotion for skin irritation. Manage associated diarrhoea and pneumonia/otitis media per their own sections.",
    stg_reference: "Ghana STG 2017, 7th Ed. — Ch.5 Immunisable Diseases, §24 Measles",
    source_page: [82, 83, 84],
    source_section: "Chapter 5: Immunisable Diseases — 24. Measles",
    extracted_from: "GHANA-STG-2017-1__2_.pdf (7th Edition 2017)",
    medicines_cited: ["paracetamol", "retinol (vitamin a)"]
  }
];

export const GHANA_KB_SURVEILLANCE: KBSurveillanceCase[] = [
  {
    id: "meningitis_idsr",
    linked_condition: "meningitis",
    disease: "Meningitis (IDSR suspected case)",
    case_definition: "Any person with sudden onset of fever (>38.5°C rectal or >38.0°C axillary) and one of the following signs: neck stiffness, altered consciousness or other meningeal signs.",
    priority_category: "Epidemic-prone disease",
    notification_type: "Immediate (within 24h)",
    document_id: "GH-IDSR",
    source_page: [121],
    source_section: "Annex 2: Case Definitions for Priority Diseases — Epidemic-prone diseases",
    keywords: ["fever", "neck stiffness", "altered consciousness", "meningeal signs", "sudden onset"]
  },
  {
    id: "measles_idsr",
    linked_condition: "measles",
    disease: "Measles (IDSR suspected case)",
    case_definition: "Any person with fever and maculopapular (non-vesicular) generalized rash and cough, coryza or conjunctivitis (red eyes); or any person in whom a clinician suspects measles.",
    priority_category: "Epidemic-prone disease",
    notification_type: "Immediate (within 24h)",
    document_id: "GH-IDSR",
    source_page: [121],
    source_section: "Annex 2: Case Definitions for Priority Diseases — Epidemic-prone diseases",
    keywords: ["fever", "rash", "maculopapular", "cough", "coryza", "conjunctivitis", "red eyes"]
  },
  {
    id: "malaria_uncomplicated_idsr",
    linked_condition: "malaria",
    disease: "Uncomplicated malaria (IDSR suspected/lab-confirmed case)",
    case_definition: "Suspected: any person with fever, or fever with headache, back pain, chills, sweats, myalgia, nausea and vomiting, diagnosed clinically as malaria (managed on an outpatient basis). Young children may have abdominal pain and poor feeding alone or in addition. Lab-confirmed: as above, plus laboratory confirmation by malaria blood film or other diagnostic test for malaria parasites.",
    priority_category: "Disease of special public health focus",
    notification_type: "Routine weekly/monthly",
    document_id: "GH-IDSR",
    source_page: [122],
    source_section: "Annex 2: Case Definitions — Malaria",
    keywords: ["fever", "headache", "back pain", "chills", "sweats", "myalgia", "nausea", "vomiting"]
  },
  {
    id: "malaria_severe_idsr",
    linked_condition: "malaria",
    disease: "Severe malaria (IDSR case definition)",
    case_definition: "Any person hospitalized with primary diagnosis of malaria and confirmed by a positive blood smear or other diagnostic test for malaria, with any of: change in behaviour (confusion or drowsiness), altered consciousness, general weakness (prostration), convulsions, hypoglycaemia (blood sugar < 2.2 mmol/l), difficulty breathing, renal failure (reduced urine output), severe anaemia/pallor (Hb < 5 g/dl), coca-cola dark urine, jaundice/yellow urine, hyperpyrexia (temp > 39.5°C), spontaneous bleeding (DIC).",
    priority_category: "Disease of special public health focus",
    notification_type: "Routine weekly/monthly",
    document_id: "GH-IDSR",
    source_page: [122],
    source_section: "Annex 2: Case Definitions — Malaria",
    keywords: ["fever", "confusion", "drowsiness", "altered consciousness", "prostration", "convulsions", "hypoglycaemia", "difficulty breathing", "reduced urine output", "severe anaemia", "pallor", "dark urine"]
  },
  {
    id: "pneumonia_u5_idsr",
    linked_condition: "lrti_pneumonia",
    disease: "Pneumonia in children under 5 (IDSR case definition)",
    case_definition: "Pneumonia: any child 2 months to 5 years with cough or difficult breathing and breathing ≥50 breaths/min (2mo-1y) or ≥40 breaths/min (1-5y). Infants <2 months with ≥60 breaths/min are referred for serious bacterial infection. Severe pneumonia: any child 2 months to 5 years with cough or difficult breathing and any general danger sign (unable to drink/breastfeed, vomits everything, convulsions, lethargy or unconsciousness), or chest indrawing, or stridor in a calm child.",
    priority_category: "Other disease of public health importance",
    notification_type: "Routine weekly/monthly",
    document_id: "GH-IDSR",
    source_page: [124],
    source_section: "Annex 2: Case Definitions — Pneumonia in children < 5y",
    keywords: ["cough", "difficult breathing", "fast breathing", "chest indrawing", "stridor", "unable to drink", "vomits everything"]
  }
];
