// WeeklyAnalysis.jsx — Weekly analysis + next week goal adjustment

const TRAINING_COLORS = { strength: '#7EC8E3', cardio: '#FF8C69', rest: '#D4C8B4', mixed: '#C5A3FF' };
const TRAINING_LABELS = { strength: 'Fuerza', cardio: 'Cardio', rest: 'Descanso', mixed: 'Mixto' };

function WeekChart2({ weekSummary }) {
  const maxKcal = Math.max(...weekSummary.map(d => d.kcal), 2400, 100);
  return React.createElement('div', { style: { background: 'white', borderRadius: 20, padding: '16px', boxShadow: '0 2px 12px rgba(30,20,8,0.08)', marginBottom: 14 } },
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 700, color: '#1E1408', marginBottom: 12 } }, 'Calorías esta semana'),
    React.createElement('div', { style: { display: 'flex', gap: 6, alignItems: 'flex-end', height: 100 } },
      weekSummary.map(d => {
        const h = Math.max(Math.round((d.kcal / maxKcal) * 88), d.kcal > 0 ? 3 : 0);
        const over = d.kcal > (d.goal || 2000);
        const logged = d.kcal > 0;
        return React.createElement('div', { key: d.day, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 } },
          React.createElement('div', { style: { width: '100%', background: !logged ? '#F5EFE4' : over ? '#FF8C69' : '#F5D040', borderRadius: '5px 5px 3px 3px', height: h, minHeight: logged ? 3 : 0 } }),
          React.createElement('div', { style: { fontSize: 10, fontWeight: 600, color: '#9A8878' } }, d.day),
          React.createElement('div', { style: { width: 8, height: 8, borderRadius: 999, background: TRAINING_COLORS[d.training] || '#D4C8B4' } })
        );
      })
    ),
    React.createElement('div', { style: { marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' } },
      Object.entries(TRAINING_LABELS).map(([k, v]) =>
        React.createElement('div', { key: k, style: { display: 'flex', alignItems: 'center', gap: 4 } },
          React.createElement('div', { style: { width: 8, height: 8, borderRadius: 999, background: TRAINING_COLORS[k] } }),
          React.createElement('span', { style: { fontSize: 10, color: '#9A8878' } }, v)
        )
      )
    )
  );
}

function InsightCard({ type, text }) {
  const styles = {
    tip:     { bg: '#FFF3C4', border: '#F5D040', color: '#7A5800', icon: '💡' },
    success: { bg: '#D8F5DB', border: '#6BCB77', color: '#2A7D3A', icon: '✓' },
    warning: { bg: '#FEF0D0', border: '#F5A623', color: '#8A5C00', icon: '⚠' },
  };
  const s = styles[type] || styles.tip;
  return React.createElement('div', { style: { background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: '12px 14px', marginBottom: 8, display: 'flex', gap: 10 } },
    React.createElement('span', { style: { fontSize: 16 } }, s.icon),
    React.createElement('span', { style: { fontSize: 13, color: s.color, lineHeight: 1.5 } }, text)
  );
}

function NextWeekGoals({ goals, onChange }) {
  return React.createElement('div', { style: { background: 'white', borderRadius: 20, padding: '16px', boxShadow: '0 2px 12px rgba(30,20,8,0.08)', marginBottom: 14 } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 700, color: '#1E1408' } }, 'Metas semana siguiente'),
      React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: '#F5D040', background: '#FFF3C4', padding: '3px 10px', borderRadius: 999 } }, 'Sugerido por IA')
    ),
    goals.map((g, i) =>
      React.createElement('div', { key: g.day, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < goals.length - 1 ? '1px solid #F5EFE4' : 'none' } },
        React.createElement('div', { style: { width: 28, textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#7A6652' } }, g.day),
        React.createElement('div', { style: { width: 8, height: 8, borderRadius: 999, background: TRAINING_COLORS[g.type] || '#D4C8B4', flexShrink: 0 } }),
        React.createElement('div', { style: { flex: 1, fontSize: 12, color: '#9A8878' } }, TRAINING_LABELS[g.type] || g.type),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 4 } },
          React.createElement('button', {
            onClick: () => onChange(i, g.kcal - 50),
            style: { width: 24, height: 24, borderRadius: 999, border: '1px solid #EAE0D0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#7A6652' }
          }, '−'),
          React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800, color: '#1E1408', minWidth: 44, textAlign: 'center' } }, g.kcal),
          React.createElement('button', {
            onClick: () => onChange(i, g.kcal + 50),
            style: { width: 24, height: 24, borderRadius: 999, background: '#F5D040', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }
          }, '+')
        )
      )
    )
  );
}

function WeeklyAnalysis({ onBack, dailyLog, dailyGoals, userData }) {
  const goalKcal = dailyGoals ? dailyGoals.kcal : 2000;

  // Build week data from dailyLog
  const today = new Date();
  const DAYS_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const DAYS_FULL  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const weekSummary = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const dayMeals = (dailyLog || []).filter(m => m.date === dateStr);
    const kcal = Math.round(dayMeals.reduce((s, m) => s + (m.totalKcal || 0), 0));
    const routine = userData && userData.routine ? userData.routine : {};
    const dayName = DAYS_FULL[d.getDay()];
    const routineDay = Object.keys(routine).find(k => k.startsWith(dayName.slice(0, 3)));
    return { day: DAYS_SHORT[d.getDay()], kcal, goal: goalKcal, training: routineDay ? routine[routineDay] : 'rest', logged: dayMeals.length > 0 };
  });

  const totalKcal    = weekSummary.filter(d => d.logged).reduce((s, d) => s + d.kcal, 0);
  const daysLogged   = weekSummary.filter(d => d.logged).length;
  const avgKcal      = daysLogged > 0 ? Math.round(totalKcal / daysLogged) : 0;
  const daysOnTarget = weekSummary.filter(d => d.logged && d.kcal <= goalKcal).length;
  const daysOver     = weekSummary.filter(d => d.logged && d.kcal > goalKcal).length;

  // Generate next-week suggestions
  const [nextWeek, setNextWeek] = React.useState(() => {
    const routine = userData && userData.routine ? userData.routine : {};
    const NEXT_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return NEXT_DAYS.map(d => {
      const type = routine[d] || 'rest';
      const base = goalKcal;
      const bump = type === 'strength' ? 100 : type === 'cardio' ? 50 : type === 'rest' ? -100 : 0;
      return { day: d, type, kcal: Math.max(1200, base + bump) };
    });
  });

  function updateGoal(idx, val) {
    setNextWeek(prev => prev.map((g, i) => i === idx ? { ...g, kcal: Math.max(1000, Math.min(4000, val)) } : g));
  }

  // Auto-generate insights
  const insights = [];
  if (daysOnTarget > 0) {
    insights.push({ type: 'success', text: `Cumpliste tu meta ${daysOnTarget} de ${daysLogged || 7} días registrados. ¡Buen trabajo!` });
  }
  if (daysOver > 0) {
    insights.push({ type: 'warning', text: `Excediste tu meta calórica ${daysOver} día${daysOver > 1 ? 's' : ''}. Considera redistribuir las calorías.` });
  }
  if (daysLogged === 0) {
    insights.push({ type: 'tip', text: 'Empieza a registrar tus comidas para obtener un análisis personalizado de tu semana.' });
  } else {
    if (daysLogged < 7) {
      const sinRegistro = 7 - daysLogged;
      insights.push({ type: 'tip', text: `${sinRegistro} día${sinRegistro > 1 ? 's' : ''} sin registro esta semana. Recuerda registrar tus comidas para un análisis más preciso.` });
    }
    insights.push({ type: 'tip', text: 'Mantener una ingesta consistente de proteína es clave para preservar la masa muscular.' });
  }

  const [confirmed, setConfirmed] = React.useState(false);

  if (confirmed) {
    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 24 } },
      React.createElement('div', { style: { width: 64, height: 64, background: '#D8F5DB', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
        React.createElement('svg', { width: 32, height: 32, viewBox: '0 0 24 24', fill: 'none', stroke: '#6BCB77', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '20 6 9 17 4 12' })
        )
      ),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: '#1E1408', textAlign: 'center' } }, '¡Metas actualizadas!'),
      React.createElement('div', { style: { fontSize: 14, color: '#7A6652', textAlign: 'center' } }, 'Tus metas para la próxima semana han sido guardadas.'),
      React.createElement('button', {
        onClick: onBack,
        style: { marginTop: 8, background: '#F5D040', border: 'none', borderRadius: 999, padding: '14px 32px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer' }
      }, 'Volver al progreso')
    );
  }

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement('div', { style: { padding: '12px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 } },
      React.createElement('div', { onClick: onBack, style: { cursor: 'pointer', padding: 4 } },
        React.createElement(Icon, { name: 'back' })
      ),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 800, color: '#1E1408' } }, 'Análisis semanal')
    ),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 16px 20px' } },
      React.createElement('div', { style: { display: 'flex', gap: 10, marginBottom: 14 } },
        [
          { label: 'Total semana', val: totalKcal > 0 ? totalKcal.toLocaleString() : '—', unit: 'kcal', color: '#F5D040' },
          { label: 'Promedio/día', val: avgKcal > 0 ? avgKcal.toLocaleString() : '—', unit: 'kcal', color: '#FFAB5E' },
          { label: 'Días en meta', val: `${daysOnTarget}/${daysLogged || 7}`, unit: '', color: '#6BCB77' },
        ].map(s =>
          React.createElement('div', { key: s.label, style: { flex: 1, background: 'white', borderRadius: 14, padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(30,20,8,0.07)' } },
            React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 900, color: s.color } }, s.val),
            s.unit && React.createElement('div', { style: { fontSize: 9, color: '#9A8878', fontWeight: 500 } }, s.unit),
            React.createElement('div', { style: { fontSize: 10, color: '#7A6652', marginTop: 2 } }, s.label)
          )
        )
      ),
      React.createElement(WeekChart2, { weekSummary }),
      React.createElement('div', { style: { marginBottom: 14 } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 700, color: '#1E1408', marginBottom: 10 } }, 'Observaciones'),
        insights.map((ins, i) => React.createElement(InsightCard, { key: i, ...ins }))
      ),
      React.createElement(NextWeekGoals, { goals: nextWeek, onChange: updateGoal }),
      React.createElement('button', {
        onClick: () => setConfirmed(true),
        style: { width: '100%', background: '#F5D040', border: 'none', borderRadius: 999, padding: '15px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, color: '#1E1408', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.35)' }
      }, 'Confirmar metas para la próxima semana')
    )
  );
}

Object.assign(window, { WeeklyAnalysis });
