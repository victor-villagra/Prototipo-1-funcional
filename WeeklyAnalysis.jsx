// WeeklyAnalysis.jsx — Weekly analysis + next week goal adjustment.
// Training labels/colors come from Constants.jsx so they stay in sync with Onboarding.
// Local fallbacks are kept in case Constants.jsx isn't loaded for some reason.
const TRAINING_COLORS = (typeof window !== 'undefined' && window.TRAINING_COLORS) || { strength: '#7EC8E3', cardio: '#FF8C69', rest: '#D4C8B4', mixed: '#C5A3FF' };
const TRAINING_LABELS = (typeof window !== 'undefined' && window.TRAINING_LABELS) || { strength: 'Fuerza', cardio: 'Cardio', rest: 'Descanso', mixed: 'Mixto' };

function WeekChart2({ weekSummary, goalKcal }) {
  // Use the user's actual goal (with 10% headroom) to scale the chart. The
  // previous version pinned the y-axis at 2400 kcal regardless of the user's
  // goal, which made the bars meaningless for anyone whose target wasn't
  // close to that number.
  const goal = goalKcal || 2000;
  const maxKcal = Math.max(...weekSummary.map(d => d.kcal), goal * 1.1, 100);
  const chartH = 88;

  return React.createElement('div', { style: { background: 'var(--bg-card, white)', borderRadius: 20, padding: '16px', boxShadow: '0 2px 12px rgba(30,20,8,0.08)', marginBottom: 14 } },
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--color-text, #1E1408)', marginBottom: 12 } }, 'Calorías esta semana'),
    React.createElement('div', { style: { position: 'relative' } },
      React.createElement('div', { style: { display: 'flex', gap: 6, alignItems: 'flex-end', height: chartH + 24, position: 'relative' } },
        weekSummary.map((d, i) => {
          const h = Math.max(Math.round((d.kcal / maxKcal) * chartH), d.kcal > 0 ? 3 : 0);
          const over = d.kcal > goal;
          const logged = d.kcal > 0;
          const isToday = i === weekSummary.length - 1;
          return React.createElement('div', { key: d.day, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 } },
            React.createElement('div', { style: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: chartH } },
              React.createElement('div', {
                style: {
                  width: '100%',
                  background: !logged ? 'var(--bg-card2, #F5EFE4)' : over ? '#FF8C69' : '#F5D040',
                  borderRadius: '5px 5px 3px 3px',
                  height: h, minHeight: logged ? 3 : 0,
                  position: 'relative',
                }
              },
                isToday && React.createElement('div', { style: { position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, background: '#F5C030', borderRadius: 999, boxShadow: '0 0 0 2px var(--bg-card, white)' } })
              )
            ),
            React.createElement('div', { style: { fontSize: 10, fontWeight: isToday ? 800 : 600, color: isToday ? '#F5C030' : 'var(--color-muted, #9A8878)' } }, isToday ? 'Hoy' : d.day),
            React.createElement('div', { style: { width: 8, height: 8, borderRadius: 999, background: TRAINING_COLORS[d.training] || '#D4C8B4' } })
          );
        })
      ),
      // Goal reference line — same visual idiom as Progress's chart so users
      // can read both charts the same way.
      React.createElement('div', {
        style: {
          position: 'absolute',
          top: chartH - Math.round((goal / maxKcal) * chartH),
          left: 0, right: 0, height: 0,
          borderTop: '1.5px dashed var(--color-muted, #B8A898)',
          zIndex: 2, pointerEvents: 'none',
        }
      }),
      React.createElement('div', {
        style: {
          position: 'absolute',
          top: chartH - Math.round((goal / maxKcal) * chartH) - 16,
          right: 0,
          fontSize: 10, fontWeight: 600, color: 'var(--color-muted, #9A8878)',
          background: 'var(--bg-card, white)', padding: '1px 6px', borderRadius: 6,
          border: '1px solid var(--border-color, #EAE0D0)', zIndex: 3,
        }
      }, `${goal.toLocaleString()} kcal`)
    ),
    React.createElement('div', { style: { marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' } },
      Object.entries(TRAINING_LABELS).map(([k, v]) =>
        React.createElement('div', { key: k, style: { display: 'flex', alignItems: 'center', gap: 4 } },
          React.createElement('div', { style: { width: 8, height: 8, borderRadius: 999, background: TRAINING_COLORS[k] } }),
          React.createElement('span', { style: { fontSize: 10, color: 'var(--color-muted, #9A8878)' } }, v)
        )
      )
    )
  );
}

function InsightCard({ type, text }) {
  // Backgrounds use the theme's soft-accent CSS variables so dark mode darkens
  // the cards instead of leaving them as bright pastel splotches. The border
  // and text colors are kept as hex because they're tuned to meet WCAG AA on
  // both the light and dark variants of their respective soft backgrounds.
  const styles = {
    tip:     { bg: 'var(--accent-gold-soft, #FFF3C4)',    border: '#F5D040', color: 'var(--accent-gold-text, #5C4200)',    icon: '💡' },
    success: { bg: 'var(--accent-success-soft, #D8F5DB)', border: '#6BCB77', color: 'var(--accent-success-text, #1F5F2A)', icon: '✓' },
    warning: { bg: 'var(--accent-carbs-soft, #FEF0D0)',   border: '#F5A623', color: '#6A4500',                              icon: '⚠' },
  };
  const s = styles[type] || styles.tip;
  return React.createElement('div', { style: { background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: '12px 14px', marginBottom: 8, display: 'flex', gap: 10 } },
    React.createElement('span', { style: { fontSize: 16 } }, s.icon),
    React.createElement('span', { style: { fontSize: 13, color: s.color, lineHeight: 1.5 } }, text)
  );
}

function NextWeekGoals({ goals, onChange }) {
  return React.createElement('div', { style: { background: 'var(--bg-card, white)', borderRadius: 20, padding: '16px', boxShadow: '0 2px 12px rgba(30,20,8,0.08)', marginBottom: 14 } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--color-text, #1E1408)' } }, 'Metas semana siguiente'),
      // "Sugerido" — the previous label "Sugerido por IA" was inaccurate
      // (these are heuristic bumps based on training type, not an AI/model),
      // and overclaiming AI capabilities is a common dark-pattern users
      // notice. Stay honest.
      React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: 'var(--accent-gold-text, #9A6D00)', background: 'var(--accent-gold-soft, #FFF3C4)', padding: '3px 10px', borderRadius: 999 } }, 'Sugerido')
    ),
    React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginBottom: 12, lineHeight: 1.4 } },
      'Ajustes sugeridos según tu rutina: días de fuerza/cardio suben kcal y días de descanso bajan.'
    ),
    goals.map((g, i) =>
      React.createElement('div', { key: g.day, style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < goals.length - 1 ? '1px solid var(--border-color, #F5EFE4)' : 'none' } },
        React.createElement('div', { style: { width: 28, textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--color-sub, #7A6652)' } }, g.day),
        React.createElement('div', { style: { width: 8, height: 8, borderRadius: 999, background: TRAINING_COLORS[g.type] || '#D4C8B4', flexShrink: 0 } }),
        React.createElement('div', { style: { flex: 1, fontSize: 12, color: 'var(--color-muted, #9A8878)' } }, TRAINING_LABELS[g.type] || g.type),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
          React.createElement('button', {
            onClick: () => onChange(i, g.kcal - 50),
            disabled: g.kcal <= 1000,
            'aria-label': `Reducir 50 kcal el ${g.day}`,
            type: 'button',
            style: { width: 36, height: 36, borderRadius: 999, border: '1px solid var(--border-color, #EAE0D0)', background: 'var(--bg-card, white)', cursor: g.kcal <= 1000 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: g.kcal <= 1000 ? '#D4C8B4' : 'var(--color-sub, #7A6652)', opacity: g.kcal <= 1000 ? 0.5 : 1, padding: 0 }
          }, '−'),
          React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 800, color: 'var(--color-text, #1E1408)', minWidth: 44, textAlign: 'center' } }, g.kcal),
          React.createElement('button', {
            onClick: () => onChange(i, g.kcal + 50),
            disabled: g.kcal >= 4000,
            'aria-label': `Aumentar 50 kcal el ${g.day}`,
            type: 'button',
            style: { width: 36, height: 36, borderRadius: 999, background: g.kcal >= 4000 ? '#EAE0D0' : '#F5D040', border: 'none', cursor: g.kcal >= 4000 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, opacity: g.kcal >= 4000 ? 0.5 : 1, padding: 0 }
          }, '+')
        )
      )
    )
  );
}

function WeeklyAnalysis({ onBack, dailyLog, dailyGoals, userData, onUpdateGoals }) {
  // Coerce corrupted dailyGoals.kcal (string from a stale localStorage entry,
  // NaN, undefined) to the safe default rather than letting it propagate into
  // arithmetic that would produce NaN heights/positions and (under React
  // production) silently blank the whole screen. This was the likely root
  // cause of the "weekly analysis goes blank" report.
  const goalKcal = (dailyGoals && Number.isFinite(Number(dailyGoals.kcal)) && Number(dailyGoals.kcal) > 0)
    ? Number(dailyGoals.kcal)
    : 2000;

  useEscapeKey(() => { if (onBack) onBack(); }, true);

  // Build week data from dailyLog
  const today = new Date();
  const DAYS_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  const DAYS_FULL  = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const _key = (typeof localDateKey === 'function') ? localDateKey : (d => d.toDateString());
  // Coerce each meal's totalKcal to a finite number; a single bad row
  // (string "NaN", undefined, null) would otherwise poison the entire sum
  // and produce NaN bar heights downstream.
  const _safeNum = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
  const weekSummary = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = _key(d);
    const dayMeals = (Array.isArray(dailyLog) ? dailyLog : []).filter(m => m && m.date === dateStr);
    const kcal = Math.round(dayMeals.reduce((s, m) => s + _safeNum(m.totalKcal), 0));
    const routine = userData && userData.routine ? userData.routine : {};
    const dayName = DAYS_FULL[d.getDay()];
    const training = routine[dayName] || 'rest';
    return { day: DAYS_SHORT[d.getDay()], kcal, goal: goalKcal, training, logged: dayMeals.length > 0 };
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

  const KCAL_MIN = 1000;
  const KCAL_MAX = 4000;
  function updateGoal(idx, val) {
    setNextWeek(prev => prev.map((g, i) => i === idx ? { ...g, kcal: Math.max(KCAL_MIN, Math.min(KCAL_MAX, val)) } : g));
  }

  // Auto-generate insights based on the actual week data, not generic boilerplate.
  const insights = [];
  if (daysLogged === 0) {
    insights.push({ type: 'tip', text: 'Empieza a registrar tus comidas para obtener un análisis personalizado de tu semana.' });
  } else {
    if (daysOnTarget > 0 && daysOnTarget === daysLogged) {
      insights.push({ type: 'success', text: `Cumpliste tu meta los ${daysLogged} día${daysLogged > 1 ? 's' : ''} registrados. ¡Excelente consistencia!` });
    } else if (daysOnTarget > 0) {
      insights.push({ type: 'success', text: `Cumpliste tu meta ${daysOnTarget} de ${daysLogged} día${daysLogged > 1 ? 's' : ''} registrados. ¡Buen trabajo!` });
    }

    if (daysOver > 0) {
      insights.push({ type: 'warning', text: `Excediste tu meta calórica ${daysOver} día${daysOver > 1 ? 's' : ''}. Considera redistribuir las calorías o ajustar las porciones.` });
    }

    if (daysLogged < 7) {
      const sinRegistro = 7 - daysLogged;
      insights.push({ type: 'tip', text: `${sinRegistro} día${sinRegistro > 1 ? 's' : ''} sin registro esta semana. Registrar a diario hace que el análisis sea más preciso.` });
    }

    // Compute protein average from actual logged meals to give a real insight.
    // "Last 7 days" rolling window matches what the WeekChart above visualizes.
    // Note: this is intentionally different from getWeekStartKey (Monday-of-this-week);
    // the chart shows the rolling window so the insight follows the same data.
    const weekStartDate = new Date(today); weekStartDate.setDate(today.getDate() - 6); weekStartDate.setHours(0, 0, 0, 0);
    const weekStartKey = _key(weekStartDate);
    // m.date is now a sortable "YYYY-MM-DD" key, so string comparison gives the
    // same result as date comparison without paying for parsing each row.
    const weekMeals = (Array.isArray(dailyLog) ? dailyLog : []).filter(m => m && m.date >= weekStartKey);
    const totalProtein = weekMeals.reduce((s, m) => s + _safeNum(m.totalProtein), 0);
    const avgProtein   = daysLogged > 0 ? Math.round(totalProtein / daysLogged) : 0;
    const protGoal     = (dailyGoals && dailyGoals.protein) || 80;

    if (avgProtein > 0 && avgProtein < protGoal * 0.7) {
      insights.push({ type: 'warning', text: `Tu promedio de proteína (${avgProtein}g) está por debajo de tu meta (${protGoal}g). Suma fuentes como pollo, huevo, lácteos o legumbres.` });
    } else if (avgProtein >= protGoal) {
      insights.push({ type: 'success', text: `Promedio de proteína: ${avgProtein}g/día. Estás cumpliendo tu meta — clave para preservar masa muscular.` });
    }

    // Variability insight: if some days are very high and others very low,
    // suggest spreading calories more evenly.
    const loggedKcals = weekSummary.filter(d => d.logged).map(d => d.kcal);
    if (loggedKcals.length >= 3) {
      const mn = Math.min(...loggedKcals);
      const mx = Math.max(...loggedKcals);
      if (mx - mn > goalKcal * 0.5) {
        insights.push({ type: 'tip', text: `Variación de ${mx - mn} kcal entre tu día más alto y más bajo. Comer de forma más uniforme ayuda al metabolismo.` });
      }
    }

    if (insights.length === 0) {
      insights.push({ type: 'tip', text: 'Buen ritmo esta semana. Sigue registrando para detectar patrones y oportunidades de mejora.' });
    }
  }

  const [confirmed, setConfirmed] = React.useState(false);

  // Average of the per-day suggestions. We surface this number in the
  // confirm button label and in the "confirmed" screen because the actual
  // dailyGoals.kcal stored is a single number, not seven — saving a flat
  // average is the most honest version of "apply these suggestions" we can
  // do without expanding the schema. Earlier copy hid this and the user
  // saw seven different targets but the global goal only moved by the avg.
  const avgKcalNext = Math.round(nextWeek.reduce((s, d) => s + d.kcal, 0) / nextWeek.length);

  if (confirmed) {
    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 24, background: 'var(--bg-main, #FEFAF3)' } },
      React.createElement('div', { style: { width: 64, height: 64, background: 'var(--accent-success-soft, #D8F5DB)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
        React.createElement('svg', { width: 32, height: 32, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--accent-success, #6BCB77)', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '20 6 9 17 4 12' })
        )
      ),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--color-text, #1E1408)', textAlign: 'center' } }, '¡Meta actualizada!'),
      React.createElement('div', { style: { fontSize: 14, color: 'var(--color-sub, #7A6652)', textAlign: 'center', lineHeight: 1.5, maxWidth: 320 } },
        `Tu meta calórica diaria se ajustó a ${avgKcalNext.toLocaleString()} kcal (promedio de las sugerencias por día).`
      ),
      React.createElement('button', {
        onClick: onBack,
        style: { marginTop: 8, background: '#F5D040', border: 'none', borderRadius: 999, padding: '14px 32px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.35)' }
      }, 'Volver al progreso')
    );
  }

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-main, #FEFAF3)' } },
    React.createElement('div', { style: { padding: '8px 12px 12px', display: 'flex', alignItems: 'center', gap: 8 } },
      React.createElement(IconButton, { onClick: onBack, ariaLabel: 'Volver' },
        React.createElement(Icon, { name: 'back' })
      ),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--color-text, #1E1408)' } }, 'Análisis semanal')
    ),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 16px 20px' } },
      React.createElement('div', { style: { display: 'flex', gap: 10, marginBottom: 14 } },
        [
          { label: 'Total semana', val: totalKcal > 0 ? totalKcal.toLocaleString() : '—', unit: 'kcal', color: '#F5D040' },
          { label: 'Promedio/día', val: avgKcal > 0 ? avgKcal.toLocaleString() : '—', unit: 'kcal', color: '#FFAB5E' },
          { label: 'Días en meta', val: daysLogged > 0 ? `${daysOnTarget}/${daysLogged}` : '—', unit: '', color: '#6BCB77' },
        ].map(s =>
          React.createElement('div', { key: s.label, style: { flex: 1, background: 'var(--bg-card, white)', borderRadius: 14, padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(30,20,8,0.07)' } },
            React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 900, color: s.color } }, s.val),
            s.unit && React.createElement('div', { style: { fontSize: 9, color: 'var(--color-muted, #9A8878)', fontWeight: 500 } }, s.unit),
            React.createElement('div', { style: { fontSize: 10, color: 'var(--color-sub, #7A6652)', marginTop: 2 } }, s.label)
          )
        )
      ),
      React.createElement(WeekChart2, { weekSummary, goalKcal }),
      React.createElement('div', { style: { marginBottom: 14 } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--color-text, #1E1408)', marginBottom: 10 } }, 'Observaciones'),
        insights.map((ins, i) => React.createElement(InsightCard, { key: i, ...ins }))
      ),
      React.createElement(NextWeekGoals, { goals: nextWeek, onChange: updateGoal }),
      // Honesty note: the schema stores a single global daily kcal goal, so
      // the seven per-day numbers above can't all be applied. Make the
      // tradeoff visible instead of silently saving the average.
      React.createElement('div', {
        style: {
          background: 'var(--accent-protein-soft, #DFF3FA)', borderRadius: 12,
          padding: '10px 12px', marginBottom: 10, fontSize: 11,
          color: 'var(--color-sub, #5A4838)', lineHeight: 1.4,
          display: 'flex', alignItems: 'flex-start', gap: 8,
        }
      },
        React.createElement('span', { style: { fontSize: 14, flexShrink: 0 } }, 'ℹ️'),
        React.createElement('span', null,
          'Al confirmar se guardará el ', React.createElement('strong', null, 'promedio'),
          ` (${avgKcalNext.toLocaleString()} kcal/día) como tu meta diaria. La distribución por día es solo una guía visual.`
        )
      ),
      React.createElement('button', {
        onClick: () => {
          if (onUpdateGoals) {
            onUpdateGoals({ ...dailyGoals, kcal: avgKcalNext });
          }
          setConfirmed(true);
        },
        style: { width: '100%', background: '#F5D040', border: 'none', borderRadius: 999, padding: '15px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, color: '#1E1408', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.35)' }
      }, `Aplicar ${avgKcalNext.toLocaleString()} kcal/día`)
    )
  );
}

Object.assign(window, { WeeklyAnalysis });
