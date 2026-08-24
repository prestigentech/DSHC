import { CadreRole } from '../types';

export interface RoleTheme {
  cadre: CadreRole;
  title: string;
  roleDescription: string;
  badgeLabel: string;
  
  // Tailwind color classes
  primaryBg: string;
  primaryBgHover: string;
  primaryText: string;
  primaryDarkText: string;
  primaryLightBg: string;
  primaryMediumBg: string;
  primaryBorder: string;
  primaryLightBorder: string;
  primaryRing: string;
  primaryBadge: string;
  primaryActiveTab: string;
  primaryIconBg: string;
  accentBar: string;
  headerTagBg: string;
  stepActiveBg: string;
  btnPrimary: string;
  btnOutline: string;
  subtleCardBg: string;
  calloutBg: string;
  calloutBorder: string;
  calloutText: string;

  // Hex codes for inline styling / dynamic components
  hexPrimary: string;
  hexLight: string;
  hexMedium: string;
  hexBorder: string;
}

export const ROLE_THEMES: Record<CadreRole, RoleTheme> = {
  'Doctor': {
    cadre: 'Doctor',
    title: 'Medical Officer / Doctor',
    roleDescription: 'Inpatient & Specialist Differential Diagnostics',
    badgeLabel: 'Doctor / MO (Clinical Sapphire)',
    primaryBg: 'bg-blue-600',
    primaryBgHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600',
    primaryDarkText: 'text-blue-900',
    primaryLightBg: 'bg-blue-50',
    primaryMediumBg: 'bg-blue-100',
    primaryBorder: 'border-blue-500',
    primaryLightBorder: 'border-blue-200',
    primaryRing: 'focus:ring-blue-500 focus:border-blue-500',
    primaryBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    primaryActiveTab: 'bg-blue-50 text-blue-800 border-blue-600',
    primaryIconBg: 'bg-blue-100 text-blue-700',
    accentBar: 'bg-blue-600',
    headerTagBg: 'bg-blue-50 text-blue-700 border border-blue-200',
    stepActiveBg: 'bg-blue-600 text-white shadow-blue-500/20',
    btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all',
    btnOutline: 'border border-blue-300 text-blue-700 hover:bg-blue-50',
    subtleCardBg: 'bg-blue-50/40',
    calloutBg: 'bg-blue-50/80',
    calloutBorder: 'border-blue-200',
    calloutText: 'text-blue-900',
    hexPrimary: '#2563eb',
    hexLight: '#eff6ff',
    hexMedium: '#dbeafe',
    hexBorder: '#bfdbfe',
  },
  'Physician Assistant': {
    cadre: 'Physician Assistant',
    title: 'Physician Assistant',
    roleDescription: 'Outpatient Clinical Diagnosis & Prescribing',
    badgeLabel: 'Physician Assistant (Medical Teal)',
    primaryBg: 'bg-teal-600',
    primaryBgHover: 'hover:bg-teal-700',
    primaryText: 'text-teal-600',
    primaryDarkText: 'text-teal-900',
    primaryLightBg: 'bg-teal-50',
    primaryMediumBg: 'bg-teal-100',
    primaryBorder: 'border-teal-500',
    primaryLightBorder: 'border-teal-200',
    primaryRing: 'focus:ring-teal-500 focus:border-teal-500',
    primaryBadge: 'bg-teal-50 text-teal-700 border-teal-200',
    primaryActiveTab: 'bg-teal-50 text-teal-800 border-teal-600',
    primaryIconBg: 'bg-teal-100 text-teal-700',
    accentBar: 'bg-teal-600',
    headerTagBg: 'bg-teal-50 text-teal-700 border border-teal-200',
    stepActiveBg: 'bg-teal-600 text-white shadow-teal-500/20',
    btnPrimary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all',
    btnOutline: 'border border-teal-300 text-teal-700 hover:bg-teal-50',
    subtleCardBg: 'bg-teal-50/40',
    calloutBg: 'bg-teal-50/80',
    calloutBorder: 'border-teal-200',
    calloutText: 'text-teal-900',
    hexPrimary: '#0d9488',
    hexLight: '#f0fdfa',
    hexMedium: '#ccfbf1',
    hexBorder: '#99f6e4',
  },
  'General Nurse': {
    cadre: 'General Nurse',
    title: 'General Nurse',
    roleDescription: 'Nursing Process, Vitals Triage & Acute Care',
    badgeLabel: 'General Nurse (Hospital Azure)',
    primaryBg: 'bg-sky-600',
    primaryBgHover: 'hover:bg-sky-700',
    primaryText: 'text-sky-600',
    primaryDarkText: 'text-sky-900',
    primaryLightBg: 'bg-sky-50',
    primaryMediumBg: 'bg-sky-100',
    primaryBorder: 'border-sky-500',
    primaryLightBorder: 'border-sky-200',
    primaryRing: 'focus:ring-sky-500 focus:border-sky-500',
    primaryBadge: 'bg-sky-50 text-sky-700 border-sky-200',
    primaryActiveTab: 'bg-sky-50 text-sky-800 border-sky-600',
    primaryIconBg: 'bg-sky-100 text-sky-700',
    accentBar: 'bg-sky-600',
    headerTagBg: 'bg-sky-50 text-sky-700 border border-sky-200',
    stepActiveBg: 'bg-sky-600 text-white shadow-sky-500/20',
    btnPrimary: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-all',
    btnOutline: 'border border-sky-300 text-sky-700 hover:bg-sky-50',
    subtleCardBg: 'bg-sky-50/40',
    calloutBg: 'bg-sky-50/80',
    calloutBorder: 'border-sky-200',
    calloutText: 'text-sky-900',
    hexPrimary: '#0284c7',
    hexLight: '#f0f9ff',
    hexMedium: '#e0f2fe',
    hexBorder: '#bae6fd',
  },
  'Community Health Nurse': {
    cadre: 'Community Health Nurse',
    title: 'Community Health Nurse (CHN)',
    roleDescription: 'CHPS IMNCI Protocol, Danger Signs & Pre-Referral Care',
    badgeLabel: 'CHN / CHPS (GHS Emerald)',
    primaryBg: 'bg-emerald-600',
    primaryBgHover: 'hover:bg-emerald-700',
    primaryText: 'text-emerald-600',
    primaryDarkText: 'text-emerald-900',
    primaryLightBg: 'bg-emerald-50',
    primaryMediumBg: 'bg-emerald-100',
    primaryBorder: 'border-emerald-500',
    primaryLightBorder: 'border-emerald-200',
    primaryRing: 'focus:ring-emerald-500 focus:border-emerald-500',
    primaryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    primaryActiveTab: 'bg-emerald-50 text-emerald-800 border-emerald-600',
    primaryIconBg: 'bg-emerald-100 text-emerald-700',
    accentBar: 'bg-emerald-600',
    headerTagBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    stepActiveBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all',
    btnOutline: 'border border-emerald-300 text-emerald-700 hover:bg-emerald-50',
    subtleCardBg: 'bg-emerald-50/40',
    calloutBg: 'bg-emerald-50/80',
    calloutBorder: 'border-emerald-200',
    calloutText: 'text-emerald-900',
    hexPrimary: '#059669',
    hexLight: '#ecfdf5',
    hexMedium: '#d1fae5',
    hexBorder: '#a7f3d0',
  },
  'Pharmacist': {
    cadre: 'Pharmacist',
    title: 'Clinical Pharmacist',
    roleDescription: 'Therapeutics, Dosage Calculation & Drug Interactions',
    badgeLabel: 'Pharmacist (Clinical Violet)',
    primaryBg: 'bg-purple-600',
    primaryBgHover: 'hover:bg-purple-700',
    primaryText: 'text-purple-600',
    primaryDarkText: 'text-purple-900',
    primaryLightBg: 'bg-purple-50',
    primaryMediumBg: 'bg-purple-100',
    primaryBorder: 'border-purple-500',
    primaryLightBorder: 'border-purple-200',
    primaryRing: 'focus:ring-purple-500 focus:border-purple-500',
    primaryBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    primaryActiveTab: 'bg-purple-50 text-purple-800 border-purple-600',
    primaryIconBg: 'bg-purple-100 text-purple-700',
    accentBar: 'bg-purple-600',
    headerTagBg: 'bg-purple-50 text-purple-700 border border-purple-200',
    stepActiveBg: 'bg-purple-600 text-white shadow-purple-500/20',
    btnPrimary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all',
    btnOutline: 'border border-purple-300 text-purple-700 hover:bg-purple-50',
    subtleCardBg: 'bg-purple-50/40',
    calloutBg: 'bg-purple-50/80',
    calloutBorder: 'border-purple-200',
    calloutText: 'text-purple-900',
    hexPrimary: '#7c3aed',
    hexLight: '#faf5ff',
    hexMedium: '#f3e8ff',
    hexBorder: '#e9d5ff',
  },
};

export function getRoleTheme(cadre: CadreRole): RoleTheme {
  return ROLE_THEMES[cadre] || ROLE_THEMES['Physician Assistant'];
}
