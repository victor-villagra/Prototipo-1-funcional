// Dashboard.jsx — Home screen with calorie ring, macro bars, meal log

// Meal style by name: each meal type gets a distinct emoji + color pair so
// the daily log is scannable at a glance. Matching is accent-insensitive and
// uses substring includes so "Almuerzo de oficina" still maps to lunch.
// First match wins, so put more specific keys (post-entreno) before generic
// ones (entreno).
const MEAL_TYPE_STYLES = [
  { keys: ['desayuno', 'breakfast'],
    icon: '🍳', color: 'var(--accent-gold-soft, #FFF3C4)',    iconColor: 'var(--accent-gold, #F5C030)' },
  { keys: ['media manana', 'media-manana', 'brunch'],
    icon: '🥐', color: 'var(--accent-carbs-soft, #FFE5CC)',   iconColor: 'var(--accent-carbs, #FFAB5E)' },
  { keys: ['post entreno', 'post-entreno', 'postentreno', 'pre entreno', 'pre-entreno', 'preentreno', 'entreno', 'workout'],
    icon: '💪', color: 'var(--accent-success-soft, #D8F5DB)', iconColor: 'var(--accent-success, #6BCB77)' },
  { keys: ['snack', 'colacion', 'picoteo', 'tentempie'],
    icon: '🍎', color: 'var(--accent-sugar-soft, #FFE8EF)',   iconColor: 'var(--accent-sugar, #FFB3C6)' },
  { keys: ['almuerzo', 'comida', 'lunch'],
    icon: '🍽️', color: 'var(--accent-carbs-soft, #FFE4DB)',   iconColor: 'var(--accent-carbs, #FF8C69)' },
  { keys: ['merienda', 'te', 'tea'],
    icon: '🍵', color: 'var(--accent-fat-soft, #EFE4FF)',     iconColor: 'var(--accent-fat, #C5A3FF)' },
  { keys: ['cena', 'dinner'],
    icon: '🌙', color: 'var(--accent-protein-soft, #DFF3FA)', iconColor: 'var(--accent-protein, #7EC8E3)' },
];

const MEAL_FALLBACK_STYLE = {
  icon: '🍴',
  color: 'var(--bg-card2, #F5EFE4)',
  iconColor: 'var(--color-sub, #7A6652)',
};

function getMealStyle(name) {
  const norm = (typeof normalizeText === 'function')
    ? normalizeText(name)
    : (name || '').toLowerCase();
  if (!norm) return MEAL_FALLBACK_STYLE;
  // Tokenize so very short keys ("te", "tea") match only as whole words and
  // don't bleed into longer ones like "comete" or "tentempie".
  const tokens = norm.split(/\s+/).filter(Boolean);
  for (const style of MEAL_TYPE_STYLES) {
    for (const key of style.keys) {
      const trimmed = key.trim();
      // Multi-word keys ("media manana", "post entreno") fall through to includes
      // since tokenization would split them.
      const isMultiword = trimmed.includes(' ') || trimmed.includes('-');
      if (isMultiword) {
        if (norm.includes(trimmed) || norm.replace(/-/g, ' ').includes(trimmed.replace(/-/g, ' '))) return style;
      } else if (tokens.includes(trimmed)) {
        return style;
      }
    }
  }
  return MEAL_FALLBACK_STYLE;
}

function CalorieRing({ consumed, goal }) {
  const safeGoal = (goal && goal > 0) ? goal : 2000;
  const pct = Math.min(consumed / safeGoal, 1);
  const r = 72, cx = 90, cy = 90;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const remaining = Math.max(safeGoal - consumed, 0);

  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 20 } },
    React.createElement('svg', { width: 180, height: 180, viewBox: '0 0 180 180' },
      React.createElement('circle', { cx, cy, r, fill: 'none', stroke: 'var(--border-color, #EAE0D0)', strokeWidth: 12 }),
      React.createElement('circle', {
        cx, cy, r, fill: 'none',
        stroke: consumed > safeGoal ? '#FF8C69' : '#F5C030', strokeWidth: 12,
        strokeDasharray: `${dash} ${circ - dash}`,
        strokeLinecap: 'round',
        transform: `rotate(-90 ${cx} ${cy})`,
        style: { transition: 'stroke-dasharray 0.6s ease-in-out' }
      }),
      React.createElement('text', { x: cx, y: cy - 10, textAnchor: 'middle', fontFamily: "'Nunito',sans-serif", fontSize: 30, fontWeight: 900, fill: 'var(--color-text, #1E1408)' }, consumed.toLocaleString()),
      React.createElement('text', { x: cx, y: cy + 10, textAnchor: 'middle', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fill: 'var(--color-sub, #7A6652)' }, 'kcal consumidas'),
    ),
    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', fontWeight: 500 } }, 'Meta'),
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--color-text, #1E1408)' } }, safeGoal.toLocaleString()),
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', fontWeight: 500 } }, 'Restante'),
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 800, color: remaining > 0 ? '#6BCB77' : '#FF8C69' } }, remaining.toLocaleString()),
      ),
      React.createElement('div', { style: { background: consumed > safeGoal ? 'var(--accent-danger-soft, #FFE0E0)' : 'var(--accent-gold-soft, #FFF3C4)', borderRadius: 999, padding: '4px 12px' } },
        React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: consumed > safeGoal ? 'var(--accent-danger-text, #C03030)' : 'var(--accent-gold-text, #9A6D00)' } }, `${Math.round(pct * 100)}% completado`)
      )
    )
  );
}

function MacroBar({ label, val, goal, color, unit }) {
  const pct = Math.min((val / (goal || 1)) * 100, 100);
  const over = val > goal;
  return React.createElement('div', { style: { marginBottom: 10 } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 5 } },
      React.createElement('span', { style: { fontSize: 13, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, label),
      React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: over ? '#C03030' : 'var(--color-sub, #7A6652)', fontFamily: "'Nunito',sans-serif" } }, `${val.toFixed(0)} / ${goal}${unit}`)
    ),
    React.createElement('div', { style: { background: 'var(--border-color, #EAE0D0)', borderRadius: 999, height: 8, overflow: 'hidden' } },
      React.createElement('div', { style: { background: over ? '#FF8C69' : color, width: `${pct}%`, height: '100%', borderRadius: 999, transition: 'width 0.6s ease-in-out' } })
    )
  );
}

function MealCard({ meal, idx, onTap }) {
  const c = getMealStyle(meal.name);
  const items = meal.foods ? meal.foods.map(f => f.name) : (meal.items || []);
  const accessibleLabel = `${meal.name}, ${Math.round(meal.totalKcal || meal.kcal || 0)} kcal${meal.time ? ', ' + meal.time : ''}`;
  return React.createElement('button', {
    onClick: onTap,
    'aria-label': accessibleLabel,
    type: 'button',
    style: {
      width: '100%',
      background: 'var(--bg-card, white)', borderRadius: 16, padding: '14px 16px',
      boxShadow: '0 2px 12px rgba(30,20,8,0.07)',
      display: 'flex', alignItems: 'center', gap: 12,
      cursor: 'pointer', marginBottom: 10, userSelect: 'none',
      transition: 'transform 100ms',
      border: 'none', textAlign: 'left',
      color: 'inherit', font: 'inherit',
      minHeight: 64,
    },
    onMouseDown: e => e.currentTarget.style.transform = 'scale(0.98)',
    onMouseUp:   e => e.currentTarget.style.transform = 'scale(1)',
    onMouseLeave: e => e.currentTarget.style.transform = 'scale(1)',
  },
    React.createElement('div', {
      style: { width: 46, height: 46, borderRadius: 13, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24, lineHeight: 1 },
      'aria-hidden': 'true'
    }, c.icon),
    React.createElement('div', { style: { flex: 1, minWidth: 0 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 6 } },
        React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, meal.name),
        meal.time && React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', fontWeight: 500 } }, meal.time)
      ),
      React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        items.length > 0 ? items.slice(0, 2).join(' · ') + (items.length > 2 ? ` +${items.length - 2}` : '') : 'Sin alimentos'
      ),
    ),
    React.createElement('div', { style: { textAlign: 'right', flexShrink: 0 } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 17, fontWeight: 800, color: '#F5C030' } }, Math.round(meal.totalKcal || meal.kcal || 0)),
      React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)' } }, 'kcal'),
    )
  );
}

function MealDetailSheet({ meal, onClose, onDelete, onEdit }) {
  const foods = meal.foods || [];
  const MACRO_COLORS = { protein: '#7EC8E3', fat: '#C5A3FF', carbs: '#FF8C69', sugar: '#FFB3C6' };
  const mealStyle = getMealStyle(meal.name);

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '80%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 0' } }),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 10px', gap: 12 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 } },
        React.createElement('div', {
          style: { width: 44, height: 44, borderRadius: 13, background: mealStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24, lineHeight: 1 },
          'aria-hidden': 'true'
        }, mealStyle.icon),
        React.createElement('div', { style: { minWidth: 0 } },
          React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, meal.name),
          meal.time && React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 2 } }, meal.time)
        )
      ),
      React.createElement('button', {
        onClick: onClose,
        'aria-label': 'Cerrar detalles de comida',
        type: 'button',
        style: { cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #7A6652)', background: 'transparent', border: 'none', padding: '8px 12px', minHeight: 44, font: 'inherit' }
      }, 'Cerrar')
    ),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 } },
      [
        { label: 'Calorías', val: Math.round(meal.totalKcal || 0), unit: 'kcal', color: '#F5D040' },
        { label: 'Proteína', val: (meal.totalProtein || 0).toFixed(0), unit: 'g', color: MACRO_COLORS.protein },
        { label: 'Grasa', val: (meal.totalFat || 0).toFixed(0), unit: 'g', color: MACRO_COLORS.fat },
        { label: 'Carbos', val: (meal.totalCarbs || 0).toFixed(0), unit: 'g', color: MACRO_COLORS.carbs },
      ].map(m =>
        React.createElement('div', { key: m.label, style: { background: m.color + '22', borderRadius: 12, padding: '10px 12px' } },
          React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: m.color } }, m.label),
          React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 900, color: 'var(--color-text, #1E1408)', marginTop: 2 } }, `${m.val} ${m.unit}`)
        )
      )
    ),
    foods.length > 0 && React.createElement('div', { style: { marginBottom: 14 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 8 } }, 'Alimentos'),
      foods.map((f, i) =>
        React.createElement('div', {
          key: i,
          style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)' }
        },
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, f.name),
            f.qtyLabel && React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 1 } }, f.qtyLabel)
          ),
          React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 700, color: '#F5C030' } }, `${Math.round(f.totalKcal || 0)} kcal`)
        )
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: 8 } },
      onEdit && React.createElement('button', {
        onClick: onEdit,
        style: { flex: 2, background: '#F5D040', border: 'none', borderRadius: 999, padding: '13px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: '#1E1408', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.3)' }
      }, 'Editar comida'),
      React.createElement('button', {
        onClick: onDelete,
        style: { flex: 1, background: '#FFE0E0', border: 'none', borderRadius: 999, padding: '13px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: '#C03030', cursor: 'pointer' }
      }, 'Eliminar')
    )
  );
}

function Dashboard({ onNavigate, userData, todayMeals, dailyGoals, unreadCount, onDeleteMeal, onEditMeal, todayWaterMl = 0, waterGoal = 2000, onAddWater, onUndoLastWater, onUpdateWaterGoal }) {
  const goals = dailyGoals || { kcal: 2000, protein: 80, fat: 70, carbs: 300, sugar: 50 };
  const [selectedMeal, setSelectedMeal] = React.useState(null);

  const totals = (todayMeals || []).reduce((acc, meal) => {
    acc.kcal    += meal.totalKcal    || 0;
    acc.protein += meal.totalProtein || 0;
    acc.fat     += meal.totalFat     || 0;
    acc.carbs   += meal.totalCarbs   || 0;
    acc.sugar   += meal.totalSugar   || 0;
    return acc;
  }, { kcal: 0, protein: 0, fat: 0, carbs: 0, sugar: 0 });

  const macros = [
    { label: 'Proteína', val: totals.protein, goal: goals.protein, color: '#7EC8E3', unit: 'g' },
    { label: 'Grasa',    val: totals.fat,     goal: goals.fat,     color: '#C5A3FF', unit: 'g' },
    { label: 'Carbos',   val: totals.carbs,   goal: goals.carbs,   color: '#FF8C69', unit: 'g' },
    { label: 'Azúcar',   val: totals.sugar,   goal: goals.sugar,   color: '#FFB3C6', unit: 'g' },
  ];

  const userName = userData ? userData.name : 'Víctor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return React.createElement('div', { style: { padding: '0 0 16px', position: 'relative', background: 'var(--bg-main, #FEFAF3)' } },
    React.createElement('div', { style: { padding: '16px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 14, color: 'var(--color-sub, #7A6652)', fontWeight: 500 } }, greeting + ','),
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 26, fontWeight: 800, color: 'var(--color-text, #1E1408)', lineHeight: 1.2 } }, (userName || 'Usuario') + ' 👋'),
      ),
      React.createElement('button', {
        'aria-label': (unreadCount || 0) > 0 ? `Notificaciones, ${unreadCount} sin leer` : 'Notificaciones',
        type: 'button',
        style: { width: 44, height: 44, borderRadius: 999, background: 'var(--accent-gold-soft, #FFF3C4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', border: 'none', padding: 0 },
        onClick: () => onNavigate('notifications'),
      },
        React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--accent-gold, #F5C030)', strokeWidth: 1.8, strokeLinecap: 'round' },
          React.createElement('path', { d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' }),
          React.createElement('path', { d: 'M13.73 21a2 2 0 0 1-3.46 0' })
        ),
        (unreadCount || 0) > 0 && React.createElement('div', {
          style: { position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 999, background: '#FF6B6B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid var(--bg-main, #FEFAF3)' }
        },
          React.createElement('span', { style: { fontSize: 10, fontWeight: 800, color: 'white', lineHeight: 1 } }, unreadCount > 9 ? '9+' : unreadCount)
        )
      )
    ),
    React.createElement('div', { style: { margin: '16px 16px 0', background: 'var(--bg-card, white)', borderRadius: 24, padding: '20px 16px', boxShadow: '0 2px 12px rgba(30,20,8,0.08)' } },
      React.createElement(CalorieRing, { consumed: Math.round(totals.kcal), goal: goals.kcal })
    ),
    typeof WaterTracker !== 'undefined' && React.createElement(WaterTracker, {
      consumed: todayWaterMl,
      goal: waterGoal,
      onAdd: onAddWater,
      onUndo: onUndoLastWater,
      onEditGoal: onUpdateWaterGoal,
    }),
    React.createElement('div', { style: { margin: '14px 16px 0', background: 'var(--bg-card, white)', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(30,20,8,0.07)' } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)', marginBottom: 14 } }, 'Macronutrientes'),
      macros.map(m => React.createElement(MacroBar, { key: m.label, ...m }))
    ),
    React.createElement('div', { style: { margin: '14px 16px 0' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)' } }, 'Comidas de hoy'),
        todayMeals && todayMeals.length > 0 && React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: '#F5C030' } },
          `${todayMeals.length} registradas`
        )
      ),
      (todayMeals && todayMeals.length > 0)
        ? todayMeals.map((m, i) => React.createElement(MealCard, { key: m.id || i, meal: m, idx: i, onTap: () => setSelectedMeal(m) }))
        : React.createElement('div', {
            style: { background: 'var(--bg-card, white)', borderRadius: 16, padding: '20px 16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(30,20,8,0.07)', marginBottom: 10 }
          },
            React.createElement('div', { style: { fontSize: 32, marginBottom: 8 } }, '🍽️'),
            React.createElement('div', { style: { fontSize: 14, color: 'var(--color-sub, #7A6652)', fontWeight: 500 } }, 'Aún no has registrado comidas hoy'),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 4 } }, 'Toca + para agregar tu primera comida')
          ),
      React.createElement('button', {
        onClick: () => onNavigate('add', ''),
        'aria-label': 'Agregar comida',
        type: 'button',
        style: {
          width: '100%',
          border: '1.5px dashed var(--border-color, #D4C8B4)', borderRadius: 16, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          justifyContent: 'center', marginTop: 4,
          background: 'transparent', color: 'inherit', font: 'inherit',
          minHeight: 56,
        }
      },
        React.createElement('div', { style: { width: 28, height: 28, background: 'var(--accent-gold-soft, #FFF3C4)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--accent-gold, #F5C030)', strokeWidth: 2.2, strokeLinecap: 'round' },
            React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
            React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
          )
        ),
        React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: 'var(--color-sub, #7A6652)' } }, 'Agregar comida')
      )
    ),
    selectedMeal && React.createElement('div', {
      onClick: () => setSelectedMeal(null),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 50 }
    }),
    selectedMeal && React.createElement(MealDetailSheet, {
      meal: selectedMeal,
      onClose: () => setSelectedMeal(null),
      onDelete: () => {
        if (onDeleteMeal) onDeleteMeal(selectedMeal.id);
        setSelectedMeal(null);
      },
      onEdit: onEditMeal ? () => {
        const m = selectedMeal;
        setSelectedMeal(null);
        onEditMeal(m);
      } : null,
    })
  );
}

Object.assign(window, { Dashboard });
