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
// Adjustment scales with weight so a 120kg user loses faster than a 60kg one.
function computeNutritionTargets({ weight, height, age, sex, activity, goal }) {
  const w = parseFloat(weight) || 70;
  const h = parseFloat(height) || 170;
  const a = parseFloat(age)    || 25;

  // Harris-Benedict has only male/female formulas. For "Otro" or unspecified,
  // average the two so the user isn't silently treated as male (which would
  // overestimate BMR by ~250-400 kcal).
  const bmrMale   = 88.36 + 13.4 * w + 4.8 * h - 5.7 * a;
  const bmrFemale = 447.6 + 9.25 * w + 3.1 * h - 4.33 * a;
  const bmr = sex === 'Masculino' ? bmrMale
            : sex === 'Femenino'  ? bmrFemale
            : (bmrMale + bmrFemale) / 2;
  const tdee = Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity] || 1.55));

  // Scale adjustment by % of TDEE so it's proportional to body size and metabolism.
  // Clamp so adjustments stay in physiologically safe ranges.
  let adjustment = 0;
  if (goal === 'lose_fat')    adjustment = -Math.max(300, Math.min(700, Math.round(tdee * 0.18)));
  if (goal === 'gain_muscle') adjustment =  Math.max(200, Math.min(500, Math.round(tdee * 0.12)));
  if (goal === 'performance') adjustment =  Math.max(100, Math.min(300, Math.round(tdee * 0.07)));

  const targetKcal = Math.max(1200, tdee + adjustment);
  const proteinPerKg = goal === 'gain_muscle' ? 2.0 : goal === 'lose_fat' ? 1.8 : 1.6;
  const protein = Math.round(w * proteinPerKg);
  const fat     = Math.round(targetKcal * 0.25 / 9);
  const carbs   = Math.max(50, Math.round((targetKcal - protein * 4 - fat * 9) / 4));

  return { bmr: Math.round(bmr), tdee, targetKcal, suggestedGoals: { kcal: targetKcal, protein, fat, carbs, sugar: 50 } };
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
  defaultMealNameForHour,
  computeNutritionTargets,
  parseClampedNumber,
});
