import React, { useState } from 'react';
import { ResourceInventory, FacilityLevel } from '../types';
import { 
  DEFAULT_FACILITY_RESOURCES, 
  FACILITY_UI_PROFILES, 
  HEFRA_DIAGNOSTIC_EQUIPMENT_MATRIX 
} from '../data/ghanaMedicalData';
import { 
  X, 
  Sliders, 
  FlaskConical, 
  Pill, 
  RotateCcw,
  Building2,
  TableProperties,
  Info,
  CheckCircle2,
  Search,
  AlertCircle,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

interface ResourceInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityLevel: FacilityLevel;
  setFacilityLevel?: (level: FacilityLevel) => void;
  resources: ResourceInventory;
  setResources: React.Dispatch<React.SetStateAction<ResourceInventory>>;
}

export const ResourceInventoryModal: React.FC<ResourceInventoryModalProps> = ({
  isOpen,
  onClose,
  facilityLevel,
  setFacilityLevel,
  resources,
  setResources,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'matrix' | 'guide'>('config');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const currentProfile = FACILITY_UI_PROFILES[facilityLevel] || FACILITY_UI_PROFILES['Health Centre'];

  const handleResetToTierDefaults = () => {
    setResources(DEFAULT_FACILITY_RESOURCES[facilityLevel]);
  };

  const handleFacilityChange = (newLevel: FacilityLevel) => {
    if (setFacilityLevel) {
      setFacilityLevel(newLevel);
    }
    setResources(DEFAULT_FACILITY_RESOURCES[newLevel]);
  };

  const toggleDiagnostic = (key: keyof ResourceInventory['diagnostics']) => {
    setResources({
      ...resources,
      diagnostics: {
        ...resources.diagnostics,
        [key]: !resources.diagnostics[key],
      },
    });
  };

  const toggleMedication = (key: keyof ResourceInventory['medications']) => {
    setResources({
      ...resources,
      medications: {
        ...resources.medications,
        [key]: !resources.medications[key],
      },
    });
  };

  const toggleEquipment = (key: keyof NonNullable<ResourceInventory['equipment']>) => {
    const currentEq = resources.equipment || DEFAULT_FACILITY_RESOURCES[facilityLevel].equipment || {};
    setResources({
      ...resources,
      equipment: {
        ...currentEq,
        [key]: !(currentEq as any)[key],
      },
    });
  };

  const toggleClinicLab = () => {
    const nextVal = !resources.isClinicLabEquipped;
    setResources({
      ...resources,
      isClinicLabEquipped: nextVal,
      diagnostics: {
        ...resources.diagnostics,
        microscopy: nextVal,
        fbc: nextVal,
        bloodCulture: nextVal,
      },
    });
  };

  const togglePharmacyMrdt = () => {
    const nextVal = !resources.isPharmacyAuthorisedMrdt;
    setResources({
      ...resources,
      isPharmacyAuthorisedMrdt: nextVal,
      diagnostics: {
        ...resources.diagnostics,
        mrdt: nextVal,
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes('core')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Core</span>;
    }
    if (lower.includes('desirable')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Desirable</span>;
    }
    if (lower.includes('referral') || lower.includes('send-out') || lower.includes('transport')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">Referral / Send-out</span>;
    }
    if (lower.includes('if authorised') || lower.includes('authorised')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">If Authorised</span>;
    }
    if (lower.includes('child services') || lower.includes('service') || lower.includes('sometimes')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">{status}</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">{status}</span>;
  };

  const filteredMatrix = HEFRA_DIAGNOSTIC_EQUIPMENT_MATRIX.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clinicalUtility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['ALL', ...Array.from(new Set(HEFRA_DIAGNOSTIC_EQUIPMENT_MATRIX.map(i => i.category)))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                Diagnostic Equipment & Resource Manager (HeFRA Standards)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Ghana Health Facilities Regulatory Agency (HeFRA) Service-Level Implementation Guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Facility Profile Bar & Quick Tabs */}
        <div className="bg-white px-4 pt-3 pb-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Facility Tier Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Facility:</span>
            <div className="relative">
              <select
                value={facilityLevel}
                onChange={(e) => handleFacilityChange(e.target.value as FacilityLevel)}
                className="bg-slate-50 border border-slate-300 font-bold text-slate-900 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="District Hospital">Hospital (District / General)</option>
                <option value="Regional/Teaching Hospital">Regional / Teaching Hospital</option>
                <option value="Health Centre">Health Centre (Sub-District)</option>
                <option value="Clinic">Clinic (Primary Care)</option>
                <option value="Maternity Home">Maternity Home</option>
                <option value="CHPS Compound">CHPS Compound</option>
                <option value="Community Pharmacy">Community Pharmacy</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-xs transition ${
                activeTab === 'config'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Facility Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-xs transition ${
                activeTab === 'matrix'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>HeFRA Matrix Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-xs transition ${
                activeTab === 'guide'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Implementation Notes</span>
            </button>
          </div>
        </div>

        {/* Current Facility Profile Summary Banner */}
        <div className="px-4 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold text-blue-900">{currentProfile.name}: </span>
              <span className="text-blue-800 text-[11px]">{currentProfile.uiProfile} — {currentProfile.shortDesc}</span>
            </div>
          </div>
          <button
            onClick={handleResetToTierDefaults}
            className="flex items-center gap-1 text-[11px] text-blue-700 hover:text-blue-800 font-semibold px-2.5 py-1 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition shadow-2xs shrink-0 ml-2"
          >
            <RotateCcw className="w-3 h-3" /> Reset Defaults
          </button>
        </div>

        {/* Modal Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-xs bg-slate-50/40">
          
          {/* TAB 1: Configurable Inventory */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              
              {/* Conditional Facility Attribute Overrides */}
              {facilityLevel === 'Clinic' && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      Clinic Laboratory Licensing Attribute
                    </div>
                    <p className="text-[11px] text-purple-700">
                      Does this primary clinic operate an on-site licensed laboratory with qualified biomedical scientist / lab technician?
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer shrink-0 ml-3">
                    <input
                      type="checkbox"
                      checked={!!resources.isClinicLabEquipped}
                      onChange={toggleClinicLab}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-purple-300"
                    />
                    <span className="font-bold text-xs text-purple-900">
                      {resources.isClinicLabEquipped ? 'Licensed Lab Active' : 'No Lab (Send-out)'}
                    </span>
                  </label>
                </div>
              )}

              {facilityLevel === 'Community Pharmacy' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Pharmacy mRDT Authorization & Training
                    </div>
                    <p className="text-[11px] text-emerald-700">
                      Is this community pharmacy officially authorised and staff trained by GHS/NMCP to perform malaria rapid diagnostic testing on-site?
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer shrink-0 ml-3">
                    <input
                      type="checkbox"
                      checked={!!resources.isPharmacyAuthorisedMrdt}
                      onChange={togglePharmacyMrdt}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-emerald-300"
                    />
                    <span className="font-bold text-xs text-emerald-900">
                      {resources.isPharmacyAuthorisedMrdt ? 'Authorised for mRDT' : 'Not Authorised'}
                    </span>
                  </label>
                </div>
              )}

              {/* Physical Clinical Assessment Equipment */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <Stethoscope className="w-4 h-4 text-indigo-600" />
                  Physical Examination & Vital Signs Equipment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { key: 'digitalThermometer', label: 'Digital Thermometer', desc: 'Core vital sign monitoring' },
                    { key: 'bpMonitor', label: 'Blood-Pressure Monitor', desc: 'Adult & pediatric cuffs' },
                    { key: 'stethoscope', label: 'Stethoscope', desc: 'Chest & cardiac auscultation' },
                    { key: 'pulseOximeter', label: 'Pulse Oximeter', desc: 'Oxygen saturation (SpO2)' },
                    { key: 'weighingScale', label: 'Weighing Scale', desc: 'Precise mg/kg dosing math' },
                    { key: 'infantScale', label: 'Infant Weighing Scale', desc: 'Pediatric accurate scale' },
                    { key: 'heightBoard', label: 'Height Board / Stadiometer', desc: 'Growth monitoring' },
                    { key: 'muacTape', label: 'MUAC Tape', desc: 'Acute malnutrition screening' },
                    { key: 'examLight', label: 'Exam Light / Torch', desc: 'Throat & pupillary check' },
                    { key: 'fetalDoppler', label: 'Fetal Doppler / Fetoscope', desc: 'Obstetric fetal heart rate' },
                    { key: 'ultrasound', label: 'Ultrasound Scanner', desc: 'Obstetric / abdominal scan' },
                    { key: 'xray', label: 'Digital X-Ray System', desc: 'Chest & skeletal imaging' },
                  ].map((eq) => {
                    const currentEq = resources.equipment || DEFAULT_FACILITY_RESOURCES[facilityLevel].equipment || {};
                    const isAvail = (currentEq as any)[eq.key] ?? false;
                    return (
                      <label
                        key={eq.key}
                        className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition ${
                          isAvail
                            ? 'bg-white border-indigo-400 text-slate-900 shadow-2xs ring-1 ring-indigo-400/20'
                            : 'bg-slate-100/70 border-slate-200 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isAvail}
                          onChange={() => toggleEquipment(eq.key as any)}
                          className="mt-0.5 w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 bg-white cursor-pointer"
                        />
                        <div className="min-w-0">
                          <span className={`font-semibold text-xs block truncate ${isAvail ? 'text-slate-900' : 'text-slate-500'}`}>
                            {eq.label}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">{eq.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Laboratory & Diagnostic Tests Section */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <FlaskConical className="w-4 h-4 text-cyan-600" />
                  Diagnostic Tests & Laboratory Capacity
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { key: 'mrdt', label: 'Malaria RDT (mRDT)', desc: 'Pf HRP2 / Pan cassettes' },
                    { key: 'pregnancyTest', label: 'Urine Pregnancy hCG', desc: 'Rapid cassette test' },
                    { key: 'glucometer', label: 'Blood Glucose (RBG)', desc: 'Hypoglycemia screen' },
                    { key: 'urineDipstick', label: 'Urine Dipsticks', desc: 'Leukocytes, nitrites, protein' },
                    { key: 'hemocueHb', label: 'HemoCue POC Hb', desc: 'Instant Hb photometer' },
                    { key: 'microscopy', label: 'Blood Film Microscopy', desc: 'Thick & thin parasite count' },
                    { key: 'fbc', label: 'Full Blood Count (FBC)', desc: 'Automated 3/5-part analyzer' },
                    { key: 'bloodCulture', label: 'Blood Culture & Sens.', desc: 'Bacteriology bottles' },
                    { key: 'chestXray', label: 'Chest Radiography', desc: 'Radiology service' },
                    { key: 'lumbarPunctureKit', label: 'Lumbar Puncture Kit', desc: 'Sterile CSF collection' },
                    { key: 'widalTest', label: 'Widal Serology', desc: 'Salmonella agglutination' },
                    { key: 'dengueRdt', label: 'Dengue Duo RDT', desc: 'NS1 + IgM/IgG rapid screen' },
                  ].map((diag) => {
                    const isAvail = (resources.diagnostics as any)[diag.key];
                    return (
                      <label
                        key={diag.key}
                        className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition ${
                          isAvail
                            ? 'bg-white border-cyan-500 text-slate-900 shadow-2xs ring-1 ring-cyan-500/20'
                            : 'bg-slate-100/70 border-slate-200 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isAvail}
                          onChange={() => toggleDiagnostic(diag.key as any)}
                          className="mt-0.5 w-3.5 h-3.5 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 bg-white cursor-pointer"
                        />
                        <div className="min-w-0">
                          <span className={`font-semibold text-xs block truncate ${isAvail ? 'text-slate-900' : 'text-slate-500'}`}>
                            {diag.label}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">{diag.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Medications Section */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  In-Stock Medications (Ghana Essential Medicines List)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { key: 'artemetherLumefantrine', label: 'Artemether-Lumefantrine (AL)', desc: 'Oral 1st line ACT' },
                    { key: 'artesunateAmodiaquine', label: 'Artesunate-Amodiaquine (ASAQ)', desc: 'Oral alternative ACT' },
                    { key: 'artesunateIVorIM', label: 'Injectable Artesunate (IV/IM)', desc: 'Severe malaria stat/treatment' },
                    { key: 'rectalArtesunate', label: 'Rectal Artesunate (100mg)', desc: 'Pre-referral community dose' },
                    { key: 'quinineOral', label: 'Oral Quinine + Clindamycin', desc: '1st trimester pregnancy' },
                    { key: 'amoxicillinDispersible', label: 'Amoxicillin Dispersible DT', desc: 'Pneumonia dispersible' },
                    { key: 'ceftriaxoneIV', label: 'IV Ceftriaxone', desc: 'Severe sepsis / meningitis' },
                    { key: 'ciprofloxacin', label: 'Ciprofloxacin Tablets', desc: 'Adult enteric fever' },
                    { key: 'azithromycin', label: 'Azithromycin (500mg/syrup)', desc: 'Typhoid alternative' },
                    { key: 'paracetamolOral', label: 'Oral Paracetamol', desc: 'Antipyretic / analgesic' },
                    { key: 'ivFluidsRingersNormalSaline', label: 'IV Fluids (Ringers/Saline)', desc: 'Resuscitation fluids' },
                    { key: 'oxygenTherapy', label: 'Oxygen Concentrator/Cylinder', desc: 'Hypoxia management' },
                    { key: 'bloodTransfusion', label: 'Blood Transfusion Capacity', desc: 'Severe anemia Hb < 5' },
                  ].map((med) => {
                    const isAvail = (resources.medications as any)[med.key];
                    return (
                      <label
                        key={med.key}
                        className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition ${
                          isAvail
                            ? 'bg-white border-emerald-500 text-slate-900 shadow-2xs ring-1 ring-emerald-500/20'
                            : 'bg-slate-100/70 border-slate-200 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isAvail}
                          onChange={() => toggleMedication(med.key as any)}
                          className="mt-0.5 w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 bg-white cursor-pointer"
                        />
                        <div className="min-w-0">
                          <span className={`font-semibold text-xs block truncate ${isAvail ? 'text-slate-900' : 'text-slate-500'}`}>
                            {med.label}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">{med.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Ghana HeFRA Diagnostic Equipment Matrix Guide */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              {/* Filter & Search Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search equipment, clinical utility, tests..."
                    className="w-full bg-slate-50 pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[11px] text-slate-500 font-medium">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-700 font-semibold focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reference Table */}
              <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                      <th className="p-2.5 min-w-[180px]">Equipment / Test</th>
                      <th className="p-2.5">Hospital</th>
                      <th className="p-2.5">Health Centre</th>
                      <th className="p-2.5">Clinic</th>
                      <th className="p-2.5">Maternity</th>
                      <th className="p-2.5">CHPS</th>
                      <th className="p-2.5">Pharmacy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMatrix.map((item) => (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-slate-50/80 transition">
                          <td className="p-2.5 font-semibold text-slate-900">
                            <div>{item.name}</div>
                            <span className="text-[10px] text-slate-500 font-normal">{item.category}</span>
                          </td>
                          <td className="p-2.5">{getStatusBadge(item.hospitalStatus)}</td>
                          <td className="p-2.5">{getStatusBadge(item.healthCentreStatus)}</td>
                          <td className="p-2.5">{getStatusBadge(item.clinicStatus)}</td>
                          <td className="p-2.5">{getStatusBadge(item.maternityHomeStatus)}</td>
                          <td className="p-2.5">{getStatusBadge(item.chpsStatus)}</td>
                          <td className="p-2.5">{getStatusBadge(item.pharmacyStatus)}</td>
                        </tr>
                        <tr className="bg-slate-50/40 text-[11px] border-b border-slate-100">
                          <td colSpan={7} className="px-3 py-1.5 text-slate-600">
                            <span className="font-bold text-slate-700">Clinical Utility:</span> {item.clinicalUtility}
                            <span className="mx-2 text-slate-300">|</span>
                            <span className="font-bold text-slate-700">Referral / Alternative:</span> {item.referralOrAlternativeNote}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Implementation & HeFRA Guidelines */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Service-Level Implementation Principles (HeFRA & GHS Standards)
                </h4>
                <p className="text-slate-700 text-xs leading-relaxed">
                  This implementation guide provides operational decision support across all 6 tiers of healthcare delivery in Ghana. Actual test availability depends on facility licensing, staffing, laboratory accreditation, and current national standards.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <strong className="text-slate-900 text-xs block">1. Availability vs. Cadre Authorisation</strong>
                    <p className="text-slate-600 text-[11px]">
                      A diagnostic test being present at a facility does not mean every cadre is permitted to perform or interpret it. For example, Lumbar Puncture kits at a hospital require medical officers, while mRDTs are nurse and CHN operable.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <strong className="text-slate-900 text-xs block">2. Configurable Facility Attributes</strong>
                    <p className="text-slate-600 text-[11px]">
                      Equipment availability is captured as a dynamic, configurable facility attribute (e.g. licensed laboratory at a clinic, or mRDT training in community pharmacy) rather than inferred purely from tier labels.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <strong className="text-slate-900 text-xs block">3. WHO & NMCP "Test Before Treat"</strong>
                    <p className="text-slate-600 text-[11px]">
                      Every suspected febrile patient must receive parasitological confirmation (mRDT or Microscopy) prior to ACT dispensation. If mRDT is negative, antimalarials must NOT be given; investigate for alternative causes (pneumonia, UTI, sepsis).
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <strong className="text-slate-900 text-xs block">4. Referral Network & Pre-Referral Stabilization</strong>
                    <p className="text-slate-600 text-[11px]">
                      When severe danger signs or unavailable diagnostic modalities occur, the CDSS initiates structured SBAR communication and pre-referral stabilization (e.g., Rectal/IM Artesunate, 10% Dextrose, oxygen).
                    </p>
                  </div>
                </div>
              </div>

              {/* Facility UI Profiles Overview */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Summary of Expected Equipment Profiles across the 6 Tiers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {Object.entries(FACILITY_UI_PROFILES).map(([key, prof]) => (
                    <div key={key} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-900 text-xs">{prof.name}</div>
                      <div className="text-[11px] text-blue-700 font-semibold">{prof.uiProfile}</div>
                      <p className="text-[10px] text-slate-500 leading-tight">{prof.shortDesc}</p>
                      <div className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded border border-amber-200">
                        {prof.referralNote}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            Modifications update the clinical decision support engine in real time.
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs ml-auto"
          >
            Apply & Return to Patient
          </button>
        </div>

      </div>
    </div>
  );
};
