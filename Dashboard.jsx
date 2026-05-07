// Dashboard.jsx — Home screen with calorie ring, macro bars, meal log

const MEAL_COLORS = [
  { color: '#FFF3C4', iconColor: '#F5C030' },
  { color: '#FFE5CC', iconColor: '#FFAB5E' },
  { color: '#FFE8EF', iconColor: '#FFB3C6' },
  { color: '#DFF3FA', iconColor: '#7EC8E3' },
  { color: '#EFE4FF', iconColor: '#C5A3FF' },
];

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
      React.createElement('div', { style: { background: consumed > safeGoal ? '#FFE0E0' : '#FFF3C4', borderRadius: 999, padding: '4px 12px' } },
        React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: consumed > safeGoal ? '#C03030' : '#9A6D00' } }, `${Math.round(pct * 100)}% completado`)
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
  const c = MEAL_COLORS[idx % MEAL_COLORS.length];
  const items = meal.foods ? meal.foods.map(f => f.name) : (meal.items || []);
  return React.createElement('div', {
    onClick: onTap,
    style: {
      background: 'var(--bg-card, white)', borderRadius: 16, padding: '14px 16px',
      boxShadow: '0 2px 12px rgba(30,20,8,0.07)',
      display: 'flex', alignItems: 'center', gap: 12,
      cursor: 'pointer', marginBottom: 10, userSelect: 'none',
      transition: 'transform 100ms',
    },
    onMouseDown: e => e.currentTarget.style.transform = 'scale(0.98)',
    onMouseUp:   e => e.currentTarget.style.transform = 'scale(1)',
    onMouseLeave: e => e.currentTarget.style.transform = 'scale(1)',
  },
    React.createElement('div', {
      style: { width: 46, height: 46, borderRadius: 13, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
    },
      React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: c.iconColor, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('path', { d: 'M3 2l1.578 10.5A2 2 0 0 0 6.561 14H9v7a1 1 0 0 0 2 0v-7h2v7a1 1 0 0 0 2 0v-7h2.439a2 2 0 0 0 1.983-1.5L21 2' }),
        React.createElement('line', { x1: 12, y1: 2, x2: 12, y2: 7 })
      )
    ),
    React.createElement('div', { style: { flex: 1 } },
      React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, meal.name),
      React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 2 } },
        items.length > 0 ? items.slice(0, 2).join(' · ') + (items.length > 2 ? ` +${items.length - 2}` : '') : 'Sin alimentos'
      ),
    ),
    React.createElement('div', { style: { textAlign: 'right', flexShrink: 0 } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 17, fontWeight: 800, color: '#F5C030' } }, Math.round(meal.totalKcal || meal.kcal || 0)),
      React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)' } }, 'kcal'),
    )
  );
}

function MealDetailSheet({ meal, onClose, onDelete }) {
  const foods = meal.foods || [];
  const MACRO_COLORS = { protein: '#7EC8E3', fat: '#C5A3FF', carbs: '#FF8C69', sugar: '#FFB3C6' };

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '80%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 0' } }),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 10px' } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)' } }, meal.name),
        meal.time && React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 2 } }, meal.time)
      ),
      React.createElement('div', { onClick: onClose, style: { cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #7A6652)' } }, 'Cerrar')
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
    React.createElement('button', {
      onClick: onDelete,
      style: { width: '100%', background: '#FFE0E0', border: 'none', borderRadius: 999, padding: '13px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: '#C03030', cursor: 'pointer' }
    }, 'Eliminar comida')
  );
}

function Dashboard({ onNavigate, userData, todayMeals, dailyGoals, unreadCount, onDeleteMeal }) {
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
      React.createElement('div', {
        style: { width: 42, height: 42, borderRadius: 999, background: '#FFF3C4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' },
        onClick: () => onNavigate('notifications'),
      },
        React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#F5C030', strokeWidth: 1.8, strokeLinecap: 'round' },
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
      React.createElement('div', {
        onClick: () => onNavigate('add', ''),
        style: {
          border: '1.5px dashed var(--border-color, #D4C8B4)', borderRadius: 16, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          justifyContent: 'center', marginTop: 4,
        }
      },
        React.createElement('div', { style: { width: 28, height: 28, background: '#FFF3C4', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#F5C030', strokeWidth: 2.2, strokeLinecap: 'round' },
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
      }
    })
  );
}

Object.assign(window, { Dashboard });
