// Progress.jsx — Weekly progress chart and history screen

const STATUS_STYLES = {
  success: { bg: '#D8F5DB', color: '#2A7D3A', label: 'En meta' },
  warning: { bg: '#FEF0D0', color: '#8A5C00', label: 'Bajo' },
  error:   { bg: '#FFE0E0', color: '#C03030', label: 'Excedido' },
};

function getStatus(kcal, goal) {
  if (kcal > goal * 1.05) return 'error';
  if (kcal < goal * 0.75) return 'warning';
  return 'success';
}

function WeekChart({ weekData, goalKcal }) {
  const goal = goalKcal || 2000;
  const maxKcal = Math.max(...weekData.map(d => d.kcal), goal * 1.1, 100);
  const chartH = 120;

  return React.createElement('div', { style: { background: 'var(--bg-card, white)', borderRadius: 20, padding: '18px 16px', boxShadow: '0 2px 12px rgba(30,20,8,0.08)', marginBottom: 14 } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)' } }, 'Esta semana'),
        React.createElement('div', { style: { fontSize: 12, color: 'var(--color-sub, #7A6652)', marginTop: 2 } },
          (() => { const logged = weekData.filter(d => d.logged); return logged.length > 0 ? `Promedio: ${Math.round(logged.reduce((s, d) => s + d.kcal, 0) / logged.length).toLocaleString()} kcal / día` : 'Sin datos registrados'; })()
        )
      ),
      React.createElement('div', { style: { background: '#FFF3C4', borderRadius: 999, padding: '4px 12px' } },
        React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: '#9A6D00' } }, 'Semana')
      )
    ),
    React.createElement('div', { style: { position: 'relative', marginBottom: 12 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: 8, height: chartH + 24, position: 'relative' } },
        weekData.map((d, i) => {
          const barH = Math.max(Math.round((d.kcal / maxKcal) * chartH), d.kcal > 0 ? 4 : 0);
          const isToday = i === weekData.length - 1;
          const over = d.kcal > goal;
          const barColor = !d.logged ? 'var(--bg-card2, #F5EFE4)' : over ? '#FF8C69' : isToday ? '#F5D040' : '#FFE682';
          return React.createElement('div', { key: d.day, style: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 } },
            React.createElement('div', { style: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: chartH } },
              React.createElement('div', { style: { width: '100%', background: barColor, borderRadius: '6px 6px 4px 4px', height: barH, position: 'relative', minHeight: d.logged ? 4 : 0 } },
                isToday && d.kcal > 0 && React.createElement('div', { style: { position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, background: '#F5D040', borderRadius: 999 } })
              )
            ),
            React.createElement('div', { style: { fontSize: 11, fontWeight: isToday ? 700 : 500, color: isToday ? '#F5C030' : 'var(--color-muted, #9A8878)' } }, d.day)
          );
        })
      ),
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
    React.createElement('div', { style: { display: 'flex', gap: 14, flexWrap: 'wrap' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 5 } },
        React.createElement('div', { style: { width: 12, height: 4, background: '#F5D040', borderRadius: 2 } }),
        React.createElement('span', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)' } }, 'En meta')
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 5 } },
        React.createElement('div', { style: { width: 12, height: 4, background: '#FF8C69', borderRadius: 2 } }),
        React.createElement('span', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)' } }, 'Excedido')
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 5 } },
        React.createElement('div', { style: { width: 14, height: 0, borderTop: '1.5px dashed var(--color-muted, #B8A898)' } }),
        React.createElement('span', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)' } }, 'Meta diaria')
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 5 } },
        React.createElement('div', { style: { width: 12, height: 4, background: 'var(--bg-card2, #F5EFE4)', borderRadius: 2, border: '1px dashed var(--border-color, #D4C8B4)' } }),
        React.createElement('span', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)' } }, 'Sin registro')
      )
    )
  );
}

function HistoryRow({ entry, goal }) {
  const status = getStatus(entry.kcal, goal || 2000);
  const s = STATUS_STYLES[status];
  return React.createElement('div', {
    style: { background: 'var(--bg-card, white)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 8px rgba(30,20,8,0.06)', marginBottom: 8 }
  },
    React.createElement('div', { style: { flex: 1 } },
      React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, entry.date),
      React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 2 } }, `${entry.kcal.toLocaleString()} kcal · ${Math.round((entry.kcal / (goal || 2000)) * 100)}% de meta`)
    ),
    React.createElement('div', { style: { background: s.bg, borderRadius: 999, padding: '3px 10px' } },
      React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: s.color } }, s.label)
    )
  );
}

function Progress({ dailyLog, dailyGoals }) {
  const goalKcal = dailyGoals ? dailyGoals.kcal : 2000;

  // Build week data from dailyLog
  const today = new Date();
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const dayMeals = (dailyLog || []).filter(m => m.date === dateStr);
    const kcal = dayMeals.reduce((s, m) => s + (m.totalKcal || 0), 0);
    const dayLabel = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][d.getDay()];
    return { day: dayLabel, kcal: Math.round(kcal), goal: goalKcal, date: dateStr, logged: dayMeals.length > 0 };
  });

  const daysLogged   = weekData.filter(d => d.logged).length;
  const avg = daysLogged > 0 ? Math.round(weekData.filter(d => d.logged).reduce((s, d) => s + d.kcal, 0) / daysLogged) : 0;
  const daysOnTarget = weekData.filter(d => d.logged && d.kcal <= d.goal).length;

  // History: last 7 days with data
  const historyDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return d;
  });

  const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const historyEntries = historyDates.map((d, i) => {
    const dateStr = d.toDateString();
    const dayMeals = (dailyLog || []).filter(m => m.date === dateStr);
    const kcal = Math.round(dayMeals.reduce((s, m) => s + (m.totalKcal || 0), 0));
    const label = i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : `${DAYS_ES[d.getDay()]} ${d.getDate()}`;
    return { date: label, kcal, dateStr };
  }).filter(e => e.kcal > 0);

  return React.createElement('div', { style: { padding: '0 0 16px', background: 'var(--bg-main, #FEFAF3)' } },
    React.createElement('div', { style: { padding: '16px 24px 16px' } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 26, fontWeight: 800, color: 'var(--color-text, #1E1408)' } }, 'Tu progreso')
    ),
    React.createElement('div', { style: { padding: '0 16px', display: 'flex', gap: 10, marginBottom: 14 } },
      React.createElement('div', { style: { flex: 1, background: 'var(--bg-card, white)', borderRadius: 16, padding: 14, boxShadow: '0 2px 12px rgba(30,20,8,0.07)', textAlign: 'center' } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 26, fontWeight: 900, color: '#F5D040' } }, avg > 0 ? avg.toLocaleString() : '—'),
        React.createElement('div', { style: { fontSize: 11, color: 'var(--color-sub, #7A6652)', marginTop: 2, fontWeight: 500 } }, 'kcal promedio')
      ),
      React.createElement('div', { style: { flex: 1, background: 'var(--bg-card, white)', borderRadius: 16, padding: 14, boxShadow: '0 2px 12px rgba(30,20,8,0.07)', textAlign: 'center' } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 26, fontWeight: 900, color: '#6BCB77' } }, `${daysOnTarget}/${daysLogged || 7}`),
        React.createElement('div', { style: { fontSize: 11, color: 'var(--color-sub, #7A6652)', marginTop: 2, fontWeight: 500 } }, 'días en meta')
      ),
      React.createElement('div', { style: { flex: 1, background: 'var(--bg-card, white)', borderRadius: 16, padding: 14, boxShadow: '0 2px 12px rgba(30,20,8,0.07)', textAlign: 'center' } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 26, fontWeight: 900, color: '#FFAB5E' } }, daysLogged),
        React.createElement('div', { style: { fontSize: 11, color: 'var(--color-sub, #7A6652)', marginTop: 2, fontWeight: 500 } }, 'días registrados')
      )
    ),
    React.createElement('div', { style: { padding: '0 16px' } },
      React.createElement(WeekChart, { weekData, goalKcal })
    ),
    React.createElement('div', { style: { padding: '0 16px' } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)', marginBottom: 10 } }, 'Historial reciente'),
      historyEntries.length > 0
        ? historyEntries.map((e, i) => React.createElement(HistoryRow, { key: i, entry: e, goal: goalKcal }))
        : React.createElement('div', { style: { background: 'var(--bg-card, white)', borderRadius: 14, padding: '20px', textAlign: 'center', boxShadow: '0 1px 8px rgba(30,20,8,0.06)' } },
            React.createElement('div', { style: { fontSize: 28, marginBottom: 8 } }, '📊'),
            React.createElement('div', { style: { fontSize: 14, color: 'var(--color-sub, #7A6652)' } }, 'Aún no hay datos esta semana'),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 4 } }, 'Empieza a registrar comidas para ver tu progreso')
          )
    )
  );
}

Object.assign(window, { Progress });
