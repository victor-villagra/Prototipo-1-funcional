// Constants.jsx — Shared constants, theme tokens, and helpers used across screens.

const COLORS = {
  primary:        '#F5D040',
  primaryDark:    '#F5C030',
  primarySoft:    '#FFF3C4',
  text:           '#1E1408',
  sub:            '#7A6652',
  muted:          '#9A8878',
  border:         '#EAE0D0',
  borderSoft:     '#F5EFE4',
  bgMain:         '#FEFAF3',
  bgCard:         '#ffffff',
  bgCard2:        '#F5EFE4',
  protein:        '#7EC8E3',
  proteinBg:      '#DFF3FA',
  fat:            '#C5A3FF',
  fatBg:          '#EFE4FF',
  carbs:          '#FF8C69',
  carbsBg:        '#FFE4DB',
  sugar:          '#FFB3C6',
  sugarBg:        '#FFE8EF',
  success:        '#6BCB77',
  successBg:      '#D8F5DB',
  successText:    '#2A7D3A',
  warning:        '#FFAB5E',
  warningBg:      '#FEF0D0',
  warningText:    '#8A5C00',
  danger:         '#FF6B6B',
  dangerBg:       '#FFE0E0',
  dangerText:     '#C03030',
  goldText:       '#9A6D00',
};

// Single source of truth for goal labels across the app.
const GOAL_LABELS = {
  lose_fat:     'Perder grasa',
  gain_muscle:  'Ganar músculo',
  maintain:     'Mantener peso',
  performance:  'Mejorar rendimiento',
};

const ACTIVITY_LABELS = {
  sedentary:   'Sedentario',
  light:       'Ligero',
  moderate:    'Moderado',
  active:      'Activo',
  very_active: 'Muy activo',
};

const ACTIVITY_DESCRIPTIONS = {
  sedentary:   'Sin ejercicio o muy poco',
  light:       '1–2 días/semana',
  moderate:    '3–4 días/semana',
  active:      '5–6 días/semana',
  very_active: 'Ejercicio intenso diario',
};

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9,
};

const LIFESTYLE_LABELS = {
  desk:     'Sentado todo el día',
  mixed:    'Mezcla de pie/sentado',
  standing: 'De pie la mayor parte',
  walking:  'Caminando todo el día',
};

const LIFESTYLE_DESCRIPTIONS = {
  desk:     'Oficina, home office, estudio',
  mixed:    'Me muevo de vez en cuando',
  standing: 'Trabajo físico ligero',
  walking:  'Trabajo físico activo',
};

const TRAINING_LABELS = { strength: 'Fuerza', cardio: 'Cardio', mixed: 'Mixto', rest: 'Descanso' };
const TRAINING_COLORS = { strength: '#7EC8E3', cardio: '#FF8C69', mixed: '#C5A3FF', rest: '#D4C8B4' };
const TRAINING_BG     = { strength: '#DFF3FA', cardio: '#FFE4DB', mixed: '#EFE4FF', rest: '#F5EFE4' };

const DAYS_ES_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAYS_ES_FULL  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']; // indexed by Date.getDay()

const DEFAULT_DAILY_GOALS = { kcal: 2000, protein: 80, fat: 70, carbs: 300, sugar: 50 };

// Strip accents and lowercase for accent-insensitive search and matching.
// "Plátano" and "platano" both normalize to "platano" so a Spanish-speaking
// user can type without diacritics and still find foods. The regex targets
// the Unicode "combining diacritical marks" block (U+0300–U+036F).
function normalizeText(s) {
  return (s || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Local-timezone date key as "YYYY-MM-DD". Used as the canonical date for meals
// instead of Date.toDateString(), which produces locale-dependent strings like
// "Mon May 09 2026" and shifts when the device timezone changes. This format is
// stable, sortable, and tied to the user's local day boundary.
function localDateKey(d) {
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Returns a sensible meal name based on the current hour, so quick-add entries
// don't all collapse to the generic word "Comida" in the daily log.
function defaultMealNameForHour(hour) {
  if (hour >= 5  && hour < 11) return 'Desayuno';
  if (hour >= 11 && hour < 13) return 'Snack';
  if (hour >= 13 && hour < 16) return 'Almuerzo';
  if (hour >= 16 && hour < 19) return 'Merienda';
  if (hour >= 19 && hour < 23) return 'Cena';
  return 'Snack nocturno';
}

// Computes BMR, TDEE, and a personalized calorie target.
// Adjustment scales with body size AND with the gap to target weight, so a user
// who wants to lose 20 kg gets a larger (but capped) deficit than one losing 2 kg.
function computeNutritionTargets({ weight, height, age, sex, activity, goal, targetWeight }) {
  const w = parseFloat(weight) || 70;
  const h = parseFloat(height) || 170;
  const a = parseFloat(age)    || 25;
  const tw = parseFloat(targetWeight);
  const gap = !isNaN(tw) ? (w - tw) : 0; // >0 = wants to lose, <0 = wants to gain

  // Harris-Benedict has only male/female formulas. For "Otro" or unspecified,
  // average the two so the user isn't silently treated as male (which would
  // overestimate BMR by ~250-400 kcal).
  const bmrMale   = 88.36 + 13.4 * w + 4.8 * h - 5.7 * a;
  const bmrFemale = 447.6 + 9.25 * w + 3.1 * h - 4.33 * a;
  const bmr = sex === 'Masculino' ? bmrMale
            : sex === 'Femenino'  ? bmrFemale
            : (bmrMale + bmrFemale) / 2;
  const tdee = Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity] || 1.55));

  // Scale adjustment by % of TDEE so it's proportional to body size and metabolism,
  // then nudge the % up/down based on how far the user is from their target weight.
  // Clamp ranges keep the deficit/surplus in physiologically safe territory.
  let adjustment = 0;
  if (goal === 'lose_fat') {
    // gap of 0 → 14% (mild), 10 kg → 19%, 20+ kg → cap 22%
    const pct = Math.max(0.12, Math.min(0.22, 0.14 + Math.max(0, gap) * 0.005));
    adjustment = -Math.max(300, Math.min(800, Math.round(tdee * pct)));
  }
  if (goal === 'gain_muscle') {
    // gap of 0 → 10% (lean bulk), -5 kg (gain 5) → 12.5%, -10+ → cap 15%
    const pct = Math.max(0.08, Math.min(0.15, 0.10 + Math.max(0, -gap) * 0.005));
    adjustment = Math.max(200, Math.min(550, Math.round(tdee * pct)));
  }
  if (goal === 'performance') adjustment = Math.max(100, Math.min(300, Math.round(tdee * 0.07)));

  const targetKcal = Math.max(1200, tdee + adjustment);
  const proteinPerKg = goal === 'gain_muscle' ? 2.0 : goal === 'lose_fat' ? 1.8 : 1.6;
  const protein = Math.round(w * proteinPerKg);
  const fat     = Math.round(targetKcal * 0.25 / 9);
  const carbs   = Math.max(50, Math.round((targetKcal - protein * 4 - fat * 9) / 4));

  return { bmr: Math.round(bmr), tdee, targetKcal, suggestedGoals: { kcal: targetKcal, protein, fat, carbs, sugar: 50 } };
}

// Toggle a CSS class on document.body while `active` is true. Used to hide
// the bottom nav while a sheet/modal is open so the sheet's action buttons
// don't collide with the floating FAB. Cleans up on unmount or deactivation.
function useBodyClass(className, active) {
  React.useEffect(() => {
    if (!active) return;
    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  }, [className, active]);
}

// Subscribe to the Escape key while `active` is true. Components use this to
// dismiss bottom sheets and modal dialogs without each one wiring up its own
// keydown listener.
function useEscapeKey(onEscape, active = true) {
  React.useEffect(() => {
    if (!active) return;
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (typeof onEscape === 'function') onEscape();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onEscape]);
}

// Monotonic-ish unique id. Date.now() collides if two entries are created in
// the same millisecond (e.g. quick double-tap or restoring a saved cart). The
// suffix is a 4-char base36 chunk so the id stays sortable by creation order
// while staying unique within a ms. Result still parses to a number-like string
// at the head, but consumers should treat the whole thing as opaque.
function uniqueId() {
  return Date.now().toString() + '_' + Math.random().toString(36).slice(2, 6);
}

// Numeric input helper used by edit sheets — clamps to [min, max] but allows
// the user to clear the field while typing (returns '' for an empty value).
function parseClampedNumber(raw, min, max, allowFloat = true) {
  if (raw === '' || raw === null || raw === undefined) return '';
  const v = allowFloat ? parseFloat(raw) : parseInt(raw, 10);
  if (isNaN(v)) return null;
  if (min !== null && min !== undefined && v < min) return null;
  if (max !== null && max !== undefined && v > max) return null;
  return v;
}

Object.assign(window, {
  COLORS,
  GOAL_LABELS,
  ACTIVITY_LABELS, ACTIVITY_DESCRIPTIONS, ACTIVITY_MULTIPLIERS,
  LIFESTYLE_LABELS, LIFESTYLE_DESCRIPTIONS,
  TRAINING_LABELS, TRAINING_COLORS, TRAINING_BG,
  DAYS_ES_SHORT, DAYS_ES_FULL,
  DEFAULT_DAILY_GOALS,
  normalizeText,
  localDateKey,
  defaultMealNameForHour,
  computeNutritionTargets,
  parseClampedNumber,
  uniqueId,
  useEscapeKey,
  useBodyClass,
});
