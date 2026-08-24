/**
 * vitals-assessment.js - Single source of truth for vitals interpretation.
 *
 * Given a raw vitals record (as written by the vitals page), returns a
 * consistent assessment used by the vitals UI:
 *   - per-vital status badges (normal / warning / high / low)
 *   - an overall triage level (green/yellow/orange/red) with message
 *   - danger_signals_present (matches the adaptation engine's dangerFromVitals)
 *   - a first-aid suggestion tied to the triage level
 *
 * Thresholds are grounded in the guideline KB (Ghana STG / WHO IMCI) and are
 * applied per-vital so a value like temp = 3 is correctly flagged as an
 * implausible/critical LOW reading rather than "Normal", and the triage,
 * danger banner and first-aid box can never contradict each other (they are
 * all derived here, not in three separate places).
 *
 * Age-awareness: when an age is supplied, paediatric respiratory bands are
 * used; otherwise adult bands apply.
 */

function num(x) {
  if (x === null || x === undefined || String(x).trim() === '') return null;
  const n = parseFloat(x);
  return isNaN(n) ? null : n;
}

function parseBP(v) {
  if (!v) return { sys: null, dia: null };
  const parts = String(v).split('/');
  return { sys: num(parts[0]), dia: num(parts[1]) };
}

// Per-vital status. Returns { level: 'normal'|'warning'|'high'|'low', label }.
function statusTemp(t) {
  if (t == null) return { level: 'none', label: '--' };
  if (t < 35 || t > 43) return { level: 'low', label: t < 35 ? 'Low (hypothermia)' : 'Implausible' };
  if (t >= 39.5) return { level: 'high', label: 'High fever' };
  if (t >= 38.0) return { level: 'warning', label: 'Fever' };
  if (t < 36.0) return { level: 'warning', label: 'Low' };
  return { level: 'normal', label: 'Normal' };
}
function statusPulse(p) {
  if (p == null) return { level: 'none', label: '--' };
  if (p >= 130 || p < 40) return { level: 'high', label: p >= 130 ? 'Very high' : 'Very low' };
  if (p >= 100) return { level: 'warning', label: 'Tachycardia' };
  if (p < 50) return { level: 'warning', label: 'Bradycardia' };
  return { level: 'normal', label: 'Normal' };
}
function statusResp(r, isChild) {
  if (r == null) return { level: 'none', label: '--' };
  if (r >= 30 || r < 8) return { level: 'high', label: r >= 30 ? 'Very fast' : 'Very slow' };
  const fastCut = isChild ? 40 : 24;
  if (r >= fastCut) return { level: 'warning', label: 'Fast' };
  if (r < 12) return { level: 'warning', label: 'Slow' };
  return { level: 'normal', label: 'Normal' };
}
function statusSpo2(s) {
  if (s == null) return { level: 'none', label: '--' };
  if (s < 90) return { level: 'high', label: 'Critical' };
  if (s < 94) return { level: 'warning', label: 'Low' };
  return { level: 'normal', label: 'Normal' };
}
function statusBP(sys, dia) {
  if (sys == null && dia == null) return { level: 'none', label: '--' };
  if ((sys != null && sys < 90) || (dia != null && dia < 60)) return { level: 'low', label: 'Low (hypotension)' };
  if ((sys != null && sys >= 180) || (dia != null && dia >= 110)) return { level: 'high', label: 'Very high' };
  if ((sys != null && sys >= 140) || (dia != null && dia >= 90)) return { level: 'warning', label: 'Raised' };
  return { level: 'normal', label: 'Normal' };
}

// Danger — kept identical to engine.dangerFromVitals so the banner never
// disagrees with the triage level.
function dangerPresent(t, hr, rr, spo2, sys) {
  if (spo2 != null && spo2 > 0 && spo2 < 90) return true;
  if (rr != null && (rr >= 30 || rr < 8)) return true;
  if (t != null && (t >= 40 || (t > 0 && t < 35))) return true;
  if (hr != null && (hr >= 130 || (hr > 0 && hr < 40))) return true;
  if (sys != null && sys > 0 && sys < 90) return true;
  return false;
}

const FIRST_AID = {
  red: { icon: 'fa-ambulance', title: 'Emergency First Aid', lines: ['Call emergency response immediately', 'Maintain airway, breathing, circulation', 'Administer oxygen if available'] },
  orange: { icon: 'fa-hand-holding-heart', title: 'Urgent First Aid', lines: ['Immediate medical review required', 'Monitor vital signs closely'] },
  yellow: { icon: 'fa-clinic-medical', title: 'First Aid Suggestion', lines: ['Schedule for priority consultation', 'Repeat vitals in 30 minutes'] },
  green: { icon: 'fa-hand-holding-heart', title: 'First Aid Suggestion', lines: ['Routine medical care', 'Continue monitoring vitals'] },
};

const TRIAGE_MSG = {
  red: 'CRITICAL: Patient requires immediate medical attention. Call the emergency response team.',
  orange: 'VERY URGENT: Patient needs urgent medical attention within 10-15 minutes.',
  yellow: 'URGENT: Patient requires medical attention within 1 hour.',
  green: 'STABLE: Patient is stable. Routine care recommended.',
};
const TRIAGE_LABEL = {
  red: 'RED - Emergency / Critical', orange: 'ORANGE - Very Urgent', yellow: 'YELLOW - Urgent', green: 'GREEN - Stable',
};

function assessVitals(v, opts) {
  opts = opts || {};
  const isChild = opts.age != null && num(opts.age) != null && num(opts.age) < 12;
  const t = num(v.temperature), p = num(v.heartRate), r = num(v.respiratoryRate), s = num(v.oxygenSaturation);
  const bp = parseBP(v.bloodPressure);

  const statuses = {
    temperature: statusTemp(t),
    heartRate: statusPulse(p),
    respiratoryRate: statusResp(r, isChild),
    bloodPressure: statusBP(bp.sys, bp.dia),
    oxygenSaturation: statusSpo2(s),
  };

  const anyEntered = [t, p, r, s, bp.sys, bp.dia].some((x) => x != null);
  if (!anyEntered) {
    return { entered: false, statuses, triage: null, danger: false, first_aid: null };
  }

  const danger = dangerPresent(t, p, r, s, bp.sys);

  // Triage level from the collected per-vital severities, guideline-aligned.
  let level = 'green';
  const anyHigh = Object.values(statuses).some((st) => st.level === 'high' || st.level === 'low');
  const anyWarn = Object.values(statuses).some((st) => st.level === 'warning');
  if (danger || anyHigh) {
    // distinguish red vs orange: red for immediately life-threatening bands
    const red = (s != null && s > 0 && s < 85) || (r != null && (r >= 35 || r < 8)) ||
      (t != null && (t >= 40.5 || (t > 0 && t < 34))) || (p != null && (p >= 140 || (p > 0 && p < 40))) ||
      (bp.sys != null && bp.sys > 0 && bp.sys < 80);
    level = red ? 'red' : 'orange';
  } else if (anyWarn) {
    level = 'yellow';
  }

  return {
    entered: true,
    statuses,
    danger,
    triage: { level, label: TRIAGE_LABEL[level], message: TRIAGE_MSG[level] },
    first_aid: FIRST_AID[level],
  };
}

module.exports = { assessVitals };
