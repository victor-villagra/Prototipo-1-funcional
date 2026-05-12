// WaterTracker.jsx — Daily water intake tracker for the Dashboard.
// Two states: compact (single row) and expanded (quick-add chips + glass row).
// Compact is the default to keep Dashboard scroll length the same as before.

const WATER_BLUE      = '#3A8FB7';
const WATER_BLUE_SOFT = 'var(--accent-protein-soft, #DFF3FA)';

// Quick-add presets cover the common containers people drink from. The custom
// stepper in the expanded view handles any other amount in 50 ml increments.
const WATER_PRESETS = [
  { label: 'Vaso',     ml: 250, icon: '🥤' },
  { label: 'Botella',  ml: 500, icon: '🍶' },
  { label: 'Taza',     ml: 200, icon: '☕' },
  { label: 'Lata',     ml: 330, icon: '🥫' },
  { label: 'Botellón', ml: 750, icon: '🧴' },
  { label: 'Litro',    ml: 1000, icon: '💧' },
];

const WATER_MIN_ML = 25;
const WATER_MAX_ML = 3000;
const WATER_STEP   = 50;

function _fmtL(ml) {
  // Below 1000 ml show "750 ml"; above, show "1.5 L" with one decimal so the
  // ring/headline stay compact instead of "1500 ml".
  if (ml < 1000) return `${Math.round(ml)} ml`;
  const l = ml / 1000;
  return `${l.toFixed(l >= 10 ? 0 : 1)} L`;
}

function WaterDropIcon({ size = 20, fill = WATER_BLUE }) {
  return React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24', fill, stroke: 'none',
  },
    React.createElement('path', { d: 'M12 2.5c-1 1.5-6 8-6 12.5a6 6 0 0 0 12 0c0-4.5-5-11-6-12.5z' })
  );
}

// Visual row of glass icons. Each glass represents `goal / count` ml. Filled
// glasses reflect actual intake; the partially-filled glass shows fractional
// progress so the user can see "almost done with the 5th glass".
function GlassesRow({ consumed, goal, count = 8 }) {
  const perGlass = goal / count;
  return React.createElement('div', {
    style: { display: 'flex', gap: 6, justifyContent: 'space-between', marginTop: 4 }
  },
    Array.from({ length: count }, (_, i) => {
      const filledMl = Math.max(0, Math.min(perGlass, consumed - i * perGlass));
      const pct = Math.round((filledMl / perGlass) * 100);
      return React.createElement('div', {
        key: i,
        style: {
          flex: 1, height: 32, borderRadius: 6,
          border: `1.5px solid ${pct > 0 ? WATER_BLUE : 'var(--border-color, #EAE0D0)'}`,
          background: 'var(--bg-card, white)',
          position: 'relative', overflow: 'hidden',
        }
      },
        React.createElement('div', {
          style: {
            position: 'absolute', left: 0, right: 0, bottom: 0,
            height: `${pct}%`, background: WATER_BLUE,
            transition: 'height 0.4s ease-out',
          }
        })
      );
    })
  );
}

function WaterTracker({ consumed, goal, onAdd, onUndo, onEditGoal }) {
  const [expanded, setExpanded] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState(false);
  const [goalDraft, setGoalDraft] = React.useState(String(goal));
  // Custom-amount input. Defaults to 250 (a typical glass) so the user can
  // bump it up/down with the stepper instead of typing every time.
  const [customMl, setCustomMl] = React.useState(250);
  const [customDraft, setCustomDraft] = React.useState('250');
  const safeGoal = goal && goal > 0 ? goal : 2000;
  const pct = Math.min((consumed / safeGoal) * 100, 100);
  const reachedGoal = consumed >= safeGoal;

  React.useEffect(() => { setGoalDraft(String(goal)); }, [goal]);

  useEscapeKey(() => setEditingGoal(false), editingGoal);

  function commitGoal() {
    const n = parseInt(goalDraft, 10);
    if (!isNaN(n) && n >= 500 && n <= 6000 && onEditGoal) onEditGoal(n);
    setEditingGoal(false);
  }

  function setCustom(ml) {
    const clamped = Math.max(WATER_MIN_ML, Math.min(WATER_MAX_ML, ml));
    setCustomMl(clamped);
    setCustomDraft(String(clamped));
  }
  function commitCustomDraft() {
    const n = parseInt(customDraft, 10);
    if (isNaN(n)) { setCustomDraft(String(customMl)); return; }
    setCustom(n);
  }
  function addCustom() {
    if (customMl > 0 && onAdd) onAdd(customMl);
  }

  return React.createElement('div', {
    style: {
      margin: '14px 16px 0',
      background: 'var(--bg-card, white)',
      borderRadius: 20,
      padding: '14px 16px',
      boxShadow: '0 2px 12px rgba(30,20,8,0.07)',
    }
  },
    // ── Compact row (always visible) ──
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
      React.createElement('div', {
        style: {
          width: 38, height: 38, borderRadius: 12, background: WATER_BLUE_SOFT,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }
      }, React.createElement(WaterDropIcon, { size: 22, fill: WATER_BLUE })),
      React.createElement('div', { style: { flex: 1, minWidth: 0 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 6 } },
          React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--color-text, #1E1408)' } }, 'Agua'),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', fontWeight: 500 } },
            `${_fmtL(consumed)} / ${_fmtL(safeGoal)}`
          ),
          reachedGoal && React.createElement('span', {
            style: { fontSize: 10, fontWeight: 700, color: 'var(--accent-success-text, #2A7D3A)', background: 'var(--accent-success-soft, #D8F5DB)', padding: '1px 7px', borderRadius: 999 }
          }, '¡META!')
        ),
        React.createElement('div', {
          style: { background: 'var(--border-color, #EAE0D0)', borderRadius: 999, height: 6, overflow: 'hidden', marginTop: 5 }
        },
          React.createElement('div', {
            style: { background: WATER_BLUE, width: `${pct}%`, height: '100%', borderRadius: 999, transition: 'width 0.5s ease-out' }
          })
        )
      ),
      // Quick "+250" button — biggest single-tap action
      React.createElement('button', {
        onClick: () => onAdd && onAdd(250),
        'aria-label': 'Añadir 250 mililitros de agua',
        type: 'button',
        style: {
          width: 44, height: 44, borderRadius: 999, background: WATER_BLUE, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
          boxShadow: '0 2px 8px rgba(58,143,183,0.35)', padding: 0,
        }
      },
        React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: 2.5, strokeLinecap: 'round' },
          React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
          React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
        )
      ),
      React.createElement('button', {
        onClick: () => setExpanded(e => !e),
        'aria-label': expanded ? 'Colapsar agua' : 'Expandir agua',
        'aria-expanded': expanded,
        type: 'button',
        style: {
          width: 32, height: 44, background: 'transparent', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, flexShrink: 0,
        }
      },
        React.createElement('svg', {
          width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none',
          stroke: 'var(--color-muted, #9A8878)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
          style: { transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }
        },
          React.createElement('polyline', { points: '6 9 12 15 18 9' })
        )
      )
    ),

    // ── Expanded panel ──
    expanded && React.createElement('div', {
      style: { marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-color, #F5EFE4)' }
    },
      // 8-glass row
      React.createElement(GlassesRow, { consumed, goal: safeGoal, count: 8 }),

      // ── Custom amount: stepper + numeric input + add button ──
      React.createElement('div', {
        style: { marginTop: 14, padding: '10px 12px', background: WATER_BLUE_SOFT, borderRadius: 14 }
      },
        React.createElement('div', { style: { fontSize: 11, fontWeight: 700, color: WATER_BLUE, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 } }, 'Cantidad personalizada'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('button', {
            onClick: () => setCustom(customMl - WATER_STEP),
            'aria-label': `Reducir ${WATER_STEP} mililitros`,
            disabled: customMl <= WATER_MIN_ML,
            type: 'button',
            style: {
              width: 40, height: 40, borderRadius: 999,
              border: '1.5px solid var(--border-color, #EAE0D0)',
              background: 'var(--bg-card, white)',
              cursor: customMl <= WATER_MIN_ML ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: 'var(--color-text, #1E1408)',
              opacity: customMl <= WATER_MIN_ML ? 0.4 : 1,
              padding: 0, flexShrink: 0,
            }
          }, '−'),
          React.createElement('div', { style: { flex: 1, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' } },
            React.createElement('input', {
              type: 'number', inputMode: 'numeric',
              value: customDraft,
              onChange: e => setCustomDraft(e.target.value),
              onBlur: commitCustomDraft,
              onKeyDown: e => {
                if (e.key === 'Enter') { commitCustomDraft(); addCustom(); }
              },
              min: WATER_MIN_ML, max: WATER_MAX_ML, step: WATER_STEP,
              'aria-label': 'Cantidad de agua en mililitros',
              style: {
                width: 80, textAlign: 'center', padding: '8px 4px',
                fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800,
                color: 'var(--color-text, #1E1408)', background: 'var(--bg-card, white)',
                border: `1.5px solid ${WATER_BLUE}55`, borderRadius: 10, outline: 'none',
              }
            }),
            React.createElement('span', { style: { fontSize: 13, color: WATER_BLUE, fontWeight: 700 } }, 'ml')
          ),
          React.createElement('button', {
            onClick: () => setCustom(customMl + WATER_STEP),
            'aria-label': `Aumentar ${WATER_STEP} mililitros`,
            disabled: customMl >= WATER_MAX_ML,
            type: 'button',
            style: {
              width: 40, height: 40, borderRadius: 999, border: 'none',
              background: WATER_BLUE,
              cursor: customMl >= WATER_MAX_ML ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: 'white',
              opacity: customMl >= WATER_MAX_ML ? 0.4 : 1,
              padding: 0, flexShrink: 0,
            }
          }, '+'),
          React.createElement('button', {
            onClick: addCustom,
            'aria-label': `Añadir ${customMl} mililitros`,
            type: 'button',
            style: {
              padding: '10px 14px', borderRadius: 999, border: 'none',
              background: WATER_BLUE, color: 'white',
              fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
              cursor: 'pointer', minHeight: 40, flexShrink: 0,
              boxShadow: '0 2px 6px rgba(58,143,183,0.3)',
            }
          }, 'Añadir')
        )
      ),

      // Preset chips
      React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: 'var(--color-muted, #9A8878)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 14, marginBottom: 6 } }, 'Atajos'),
      React.createElement('div', {
        style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }
      },
        WATER_PRESETS.map(p =>
          React.createElement('button', {
            key: p.label,
            onClick: () => onAdd && onAdd(p.ml),
            'aria-label': `Añadir ${p.label}, ${p.ml} mililitros`,
            type: 'button',
            style: {
              padding: '10px 6px', borderRadius: 12,
              background: WATER_BLUE_SOFT, border: '1.5px solid transparent',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2, font: 'inherit',
              minHeight: 56,
            }
          },
            React.createElement('span', { style: { fontSize: 18 } }, p.icon),
            React.createElement('span', { style: { fontSize: 11, fontWeight: 700, color: WATER_BLUE } }, p.label),
            React.createElement('span', { style: { fontSize: 10, color: 'var(--color-muted, #9A8878)' } }, `${p.ml} ml`)
          )
        )
      ),
      // Goal editor + undo row
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 8 }
      },
        editingGoal
          ? React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6, flex: 1 } },
              React.createElement('span', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)' } }, 'Meta:'),
              React.createElement('input', {
                type: 'number', value: goalDraft,
                onChange: e => setGoalDraft(e.target.value),
                onBlur: commitGoal,
                onKeyDown: e => { if (e.key === 'Enter') commitGoal(); },
                min: 500, max: 6000, step: 100,
                autoFocus: true,
                'aria-label': 'Meta diaria de agua en mililitros',
                style: {
                  width: 80, padding: '6px 8px', borderRadius: 8,
                  border: `1.5px solid ${WATER_BLUE}`, background: 'var(--bg-input, white)',
                  fontSize: 13, fontWeight: 700, color: 'var(--color-text, #1E1408)',
                  fontFamily: "'Nunito',sans-serif", outline: 'none',
                }
              }),
              React.createElement('span', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)' } }, 'ml')
            )
          : React.createElement('button', {
              onClick: () => setEditingGoal(true),
              'aria-label': `Cambiar meta de agua, actualmente ${safeGoal} mililitros`,
              type: 'button',
              style: {
                background: 'transparent', border: 'none',
                fontSize: 11, color: 'var(--color-muted, #9A8878)',
                cursor: 'pointer', padding: '4px 0', font: 'inherit',
              }
            }, `Meta: ${_fmtL(safeGoal)} ✎`),
        consumed > 0 && React.createElement('button', {
          onClick: () => onUndo && onUndo(),
          'aria-label': 'Deshacer último registro de agua',
          type: 'button',
          style: {
            background: 'transparent', border: '1px solid var(--border-color, #EAE0D0)',
            borderRadius: 999, padding: '6px 12px',
            fontSize: 11, fontWeight: 600, color: 'var(--color-sub, #7A6652)',
            cursor: 'pointer', font: 'inherit',
          }
        }, '↶ Deshacer')
      )
    )
  );
}

Object.assign(window, { WaterTracker });
