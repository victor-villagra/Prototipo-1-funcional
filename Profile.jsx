// Profile.jsx — User profile, goals, and settings screen.
// Labels reuse the shared maps from Constants.jsx so all screens stay in sync.

const GOAL_LABELS_MAP = (typeof GOAL_LABELS      !== 'undefined') ? GOAL_LABELS      : {};
const ACTIVITY_MAP    = (typeof ACTIVITY_LABELS  !== 'undefined') ? ACTIVITY_LABELS  : {};
const LIFESTYLE_MAP   = (typeof LIFESTYLE_LABELS !== 'undefined') ? LIFESTYLE_LABELS : {};

function EditRoutineSheet({ userData, onClose, onSave }) {
  const ROUTINE_DAYS = (typeof DAYS_ES_SHORT !== 'undefined' && DAYS_ES_SHORT) || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const TYPES = [
    { id: 'strength', label: 'Fuerza' },
    { id: 'cardio',   label: 'Cardio' },
    { id: 'mixed',    label: 'Mixto' },
    { id: 'rest',     label: 'Descanso' },
  ];
  const T_COLORS = (typeof TRAINING_COLORS !== 'undefined' && TRAINING_COLORS) || { strength: '#7EC8E3', cardio: '#FF8C69', mixed: '#C5A3FF', rest: '#D4C8B4' };
  const T_BG     = (typeof TRAINING_BG     !== 'undefined' && TRAINING_BG)     || { strength: '#DFF3FA', cardio: '#FFE4DB', mixed: '#EFE4FF', rest: '#F5EFE4' };

  const [routine, setRoutine] = React.useState(() => {
    const base = (userData && userData.routine) || {};
    const next = {};
    ROUTINE_DAYS.forEach(d => { next[d] = base[d] || 'rest'; });
    return next;
  });

  const allSet = ROUTINE_DAYS.every(d => routine[d]);

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '85%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', marginBottom: 4 } }, 'Tu rutina semanal'),
    React.createElement('div', { style: { fontSize: 13, color: 'var(--color-sub, #7A6652)', marginBottom: 16 } }, 'Indica el tipo de actividad de cada día.'),
    ROUTINE_DAYS.map(day =>
      React.createElement('div', { key: day, style: { marginBottom: 10 } },
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 6 } }, day),
        React.createElement('div', { style: { display: 'flex', gap: 6 } },
          TYPES.map(t =>
            React.createElement('div', {
              key: t.id,
              onClick: () => setRoutine(r => ({ ...r, [day]: t.id })),
              style: {
                flex: 1, padding: '8px 4px', borderRadius: 10, textAlign: 'center',
                border: `1.5px solid ${routine[day] === t.id ? T_COLORS[t.id] : 'var(--border-color, #EAE0D0)'}`,
                background: routine[day] === t.id ? T_BG[t.id] : 'var(--bg-card, white)',
                cursor: 'pointer', fontSize: 11, fontWeight: 600,
                color: routine[day] === t.id ? T_COLORS[t.id] : 'var(--color-muted, #9A8878)',
                transition: 'all 0.12s',
              }
            }, t.label)
          )
        )
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 14 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--color-sub, #7A6652)', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: () => allSet && onSave({ routine }),
        style: { flex: 2, padding: '14px', background: allSet ? '#F5D040' : '#EAE0D0', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: allSet ? '#1E1408' : '#B8A898', cursor: allSet ? 'pointer' : 'not-allowed' }
      }, 'Guardar')
    )
  );
}

function EditActivitySheet({ userData, onClose, onSave }) {
  const [activity,  setActivity]  = React.useState(userData ? userData.activity  || '' : '');
  const [lifestyle, setLifestyle] = React.useState(userData ? userData.lifestyle || '' : '');

  const activityOptions = [
    { id: 'sedentary',   label: 'Sedentario',   desc: 'Sin ejercicio o muy poco' },
    { id: 'light',       label: 'Ligero',       desc: '1–2 días/semana' },
    { id: 'moderate',    label: 'Moderado',     desc: '3–4 días/semana' },
    { id: 'active',      label: 'Activo',       desc: '5–6 días/semana' },
    { id: 'very_active', label: 'Muy activo',   desc: 'Ejercicio intenso diario' },
  ];
  const lifestyleOptions = [
    { id: 'desk',      label: 'Sentado todo el día',   desc: 'Oficina, home office, estudio' },
    { id: 'mixed',     label: 'Mezcla de pie/sentado', desc: 'Me muevo de vez en cuando' },
    { id: 'standing',  label: 'De pie la mayor parte', desc: 'Trabajo físico ligero' },
    { id: 'walking',   label: 'Caminando todo el día', desc: 'Trabajo físico activo' },
  ];

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '85%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', marginBottom: 16 } }, 'Nivel de actividad'),
    activityOptions.map(a =>
      React.createElement('div', {
        key: a.id, onClick: () => setActivity(a.id),
        style: { border: `2px solid ${activity === a.id ? '#F5D040' : 'var(--border-color, #EAE0D0)'}`, background: activity === a.id ? '#FFF3C4' : 'var(--bg-card, white)', borderRadius: 14, padding: '11px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.15s' }
      },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, a.label),
          React.createElement('div', { style: { fontSize: 11, color: 'var(--color-sub, #7A6652)', marginTop: 1 } }, a.desc)
        ),
        activity === a.id && React.createElement('div', { style: { width: 20, height: 20, borderRadius: 999, background: '#F5D040', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } },
          React.createElement('svg', { width: 11, height: 11, viewBox: '0 0 24 24', fill: 'none', stroke: '#1E1408', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' },
            React.createElement('polyline', { points: '20 6 9 17 4 12' })
          )
        )
      )
    ),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)', margin: '16px 0 10px' } }, 'Estilo de vida diario'),
    lifestyleOptions.map(l =>
      React.createElement('div', {
        key: l.id, onClick: () => setLifestyle(l.id),
        style: { border: `2px solid ${lifestyle === l.id ? '#FFAB5E' : 'var(--border-color, #EAE0D0)'}`, background: lifestyle === l.id ? '#FFE5CC' : 'var(--bg-card, white)', borderRadius: 14, padding: '11px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.15s' }
      },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, l.label),
          React.createElement('div', { style: { fontSize: 11, color: 'var(--color-sub, #7A6652)', marginTop: 1 } }, l.desc)
        ),
        lifestyle === l.id && React.createElement('div', { style: { width: 18, height: 18, borderRadius: 999, background: '#FFAB5E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } },
          React.createElement('svg', { width: 10, height: 10, viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' },
            React.createElement('polyline', { points: '20 6 9 17 4 12' })
          )
        )
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 8 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--color-sub, #7A6652)', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: () => activity && lifestyle && onSave({ activity, lifestyle }),
        style: { flex: 2, padding: '14px', background: (activity && lifestyle) ? '#F5D040' : '#EAE0D0', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: (activity && lifestyle) ? '#1E1408' : '#B8A898', cursor: (activity && lifestyle) ? 'pointer' : 'not-allowed' }
      }, 'Guardar')
    )
  );
}

function GoalRow({ goal, onEdit }) {
  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)' }
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
      React.createElement('div', { style: { width: 10, height: 10, borderRadius: 999, background: goal.color, flexShrink: 0 } }),
      React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, goal.label)
    ),
    React.createElement('div', {
      onClick: onEdit,
      style: { background: goal.bg, borderRadius: 999, padding: '4px 12px', cursor: onEdit ? 'pointer' : 'default' }
    },
      React.createElement('span', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 700, color: '#5A4838' } }, `${goal.val} ${goal.unit}`)
    )
  );
}

function EditGoalsSheet({ goals, waterGoal, onClose, onSave }) {
  // values holds macro goals + water; on save we split them back so water
  // doesn't pollute the dailyGoals shape that Dashboard reads.
  const [values, setValues] = React.useState({ ...goals, water: waterGoal || 2000 });

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '80%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', marginBottom: 16 } }, 'Editar metas diarias'),
    [
      { key: 'kcal',    label: 'Calorías (kcal)', color: '#F5D040', min: 1000, max: 6000, step: 50 },
      { key: 'protein', label: 'Proteína (g)',     color: '#7EC8E3', min: 20,   max: 400,  step: 5  },
      { key: 'fat',     label: 'Grasa (g)',        color: '#C5A3FF', min: 10,   max: 300,  step: 5  },
      { key: 'carbs',   label: 'Carbohidratos (g)',color: '#FF8C69', min: 20,   max: 800,  step: 5  },
      { key: 'sugar',   label: 'Azúcar (g)',       color: '#FFB3C6', min: 0,    max: 300,  step: 5  },
      { key: 'water',   label: 'Agua (ml)',        color: '#3A8FB7', min: 500,  max: 6000, step: 100 },
    ].map(f =>
      React.createElement('div', { key: f.key, style: { marginBottom: 12 } },
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 5 } }, f.label),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('button', {
            onClick: () => setValues(v => ({ ...v, [f.key]: Math.max(f.min, (v[f.key] || 0) - f.step) })),
            style: { width: 36, height: 36, borderRadius: 999, border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-card, white)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-text, #1E1408)' }
          }, '−'),
          React.createElement('input', {
            type: 'number',
            value: values[f.key] !== undefined && values[f.key] !== null ? values[f.key] : 0,
            min: f.min, max: f.max,
            onChange: e => {
              const raw = e.target.value;
              if (raw === '') { setValues(prev => ({ ...prev, [f.key]: f.min })); return; }
              const v = parseFloat(raw);
              if (isNaN(v) || v < 0 || v > f.max) return;
              setValues(prev => ({ ...prev, [f.key]: v }));
            },
            style: { flex: 1, textAlign: 'center', padding: '10px', borderRadius: 12, border: `1.5px solid ${f.color}44`, fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', background: 'var(--bg-input, white)', outline: 'none' }
          }),
          React.createElement('button', {
            onClick: () => setValues(v => ({ ...v, [f.key]: Math.min(f.max, (v[f.key] || 0) + f.step) })),
            style: { width: 36, height: 36, borderRadius: 999, background: '#F5D040', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }
          }, '+')
        )
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 16 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--color-sub, #7A6652)', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: () => {
          const { water, ...macros } = values;
          onSave(macros, water);
        },
        style: { flex: 2, padding: '14px', background: '#F5D040', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#1E1408', cursor: 'pointer' }
      }, 'Guardar metas')
    )
  );
}

function EditProfileSheet({ userData, onClose, onSave }) {
  const [form, setForm] = React.useState({
    name:         userData ? userData.name         || '' : '',
    age:          userData ? userData.age          || '' : '',
    weight:       userData ? userData.weight       || '' : '',
    targetWeight: userData ? userData.targetWeight || '' : '',
    height:       userData ? userData.height       || '' : '',
  });
  const [errors, setErrors] = React.useState({});

  function update(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const fields = [
    { key: 'name',         label: 'Nombre',            type: 'text',   placeholder: 'Tu nombre',  min: null, max: null, required: true  },
    { key: 'age',          label: 'Edad',               type: 'number', placeholder: 'Años',       min: 10,   max: 110, required: true  },
    { key: 'weight',       label: 'Peso actual (kg)',   type: 'number', placeholder: 'kg',         min: 20,   max: 500, required: true  },
    { key: 'targetWeight', label: 'Peso objetivo (kg)', type: 'number', placeholder: 'kg',         min: 20,   max: 500, required: false },
    { key: 'height',       label: 'Altura (cm)',        type: 'number', placeholder: 'cm',         min: 50,   max: 300, required: true  },
  ];

  function validate() {
    const errs = {};
    fields.forEach(f => {
      const v = form[f.key];
      if (f.required && (v === '' || v === null || v === undefined)) {
        errs[f.key] = 'Requerido';
        return;
      }
      if (f.type === 'number' && v !== '') {
        const n = parseFloat(v);
        if (isNaN(n))               errs[f.key] = 'Número inválido';
        else if (n < f.min)          errs[f.key] = `Mínimo ${f.min}`;
        else if (n > f.max)          errs[f.key] = `Máximo ${f.max}`;
      }
    });
    return errs;
  }

  function handleSave() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave(form);
  }

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '80%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', marginBottom: 16 } }, 'Editar perfil'),
    fields.map(f =>
      React.createElement('div', { key: f.key, style: { marginBottom: 14 } },
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 5 } }, f.label + (f.required ? ' *' : '')),
        React.createElement('input', {
          type: f.type, placeholder: f.placeholder, value: form[f.key],
          min: f.min !== null ? f.min : undefined,
          max: f.max !== null ? f.max : undefined,
          onChange: e => {
            if (errors[f.key]) setErrors(prev => { const n = { ...prev }; delete n[f.key]; return n; });
            if (f.type === 'number') {
              if (e.target.value === '') { update(f.key, ''); return; }
              const v = parseFloat(e.target.value);
              if (isNaN(v)) return;
              // Allow typing values out of range but flag with errors instead of blocking input.
              if (f.max !== null && v > f.max) return;
              update(f.key, v);
            } else {
              update(f.key, e.target.value.slice(0, 60));
            }
          },
          style: { width: '100%', padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${errors[f.key] ? '#FF6B6B' : 'var(--border-color, #EAE0D0)'}`, background: 'var(--bg-input, white)', fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'var(--color-text, #1E1408)', outline: 'none' }
        }),
        errors[f.key] && React.createElement('div', { style: { fontSize: 11, color: '#C03030', marginTop: 4, fontWeight: 500 } }, errors[f.key])
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 8 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--color-sub, #7A6652)', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: handleSave,
        style: { flex: 2, padding: '14px', background: '#F5D040', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#1E1408', cursor: 'pointer' }
      }, 'Guardar')
    )
  );
}

function ConsumptionLimitsSheet({ limits, onClose, onSave }) {
  const [localLimits, setLocalLimits] = React.useState(limits || []);
  const [newIcon,     setNewIcon]     = React.useState('⚡');
  const [newName,     setNewName]     = React.useState('');
  const [newMax,      setNewMax]      = React.useState('');
  const [newPeriod,   setNewPeriod]   = React.useState('weekly');

  function addLimit() {
    const max = parseInt(newMax, 10);
    if (!newName.trim() || isNaN(max) || max < 1) return;
    const entry = {
      id:     (typeof uniqueId === 'function') ? uniqueId() : Date.now().toString(),
      icon:   newIcon || '⚡',
      name:   newName.trim().slice(0, 40),
      limit:  max,
      period: newPeriod,
    };
    setLocalLimits(prev => [...prev, entry]);
    setNewIcon('⚡'); setNewName(''); setNewMax(''); setNewPeriod('weekly');
  }

  function removeLimit(id) {
    setLocalLimits(prev => prev.filter(l => l.id !== id));
  }

  const PERIOD_LABELS = { daily: 'Diario', weekly: 'Semanal' };

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '85%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', marginBottom: 4 } }, 'Límites de consumo'),
    React.createElement('div', { style: { fontSize: 13, color: 'var(--color-sub, #7A6652)', marginBottom: 16 } }, 'Define un máximo de consumo diario o semanal para cualquier producto.'),

    // Existing limits list
    localLimits.length > 0 && React.createElement('div', { style: { marginBottom: 16 } },
      localLimits.map(l =>
        React.createElement('div', {
          key: l.id,
          style: {
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', marginBottom: 6,
            background: 'var(--bg-card2, #F5EFE4)', borderRadius: 14,
          }
        },
          React.createElement('span', { style: { fontSize: 20 } }, l.icon),
          React.createElement('div', { style: { flex: 1, minWidth: 0 } },
            React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--color-text, #1E1408)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, l.name),
            React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 1 } },
              `Máx. ${l.limit} · ${PERIOD_LABELS[l.period] || l.period}`
            )
          ),
          React.createElement('button', {
            onClick: () => removeLimit(l.id),
            'aria-label': `Eliminar límite ${l.name}`,
            type: 'button',
            style: {
              width: 28, height: 28, borderRadius: 999, border: 'none',
              background: 'var(--accent-danger-soft, #FFE0E0)',
              color: 'var(--accent-danger-text, #C03030)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 14, fontWeight: 700, flexShrink: 0,
            }
          }, '×')
        )
      )
    ),

    // Add new limit form
    React.createElement('div', { style: { background: 'var(--bg-card2, #F5EFE4)', borderRadius: 14, padding: '14px' } },
      React.createElement('div', { style: { fontSize: 12, fontWeight: 700, color: 'var(--color-sub, #5A4838)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 } }, 'Nuevo límite'),
      React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 10 } },
        React.createElement('input', {
          type: 'text', value: newIcon,
          onChange: e => setNewIcon(e.target.value.slice(0, 2)),
          placeholder: '⚡',
          'aria-label': 'Emoji',
          style: { width: 48, textAlign: 'center', padding: '10px 4px', borderRadius: 10, border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-card, white)', fontSize: 18, outline: 'none' }
        }),
        React.createElement('input', {
          type: 'text', value: newName,
          onChange: e => setNewName(e.target.value.slice(0, 40)),
          placeholder: 'Ej: Bebida energética',
          'aria-label': 'Nombre del límite',
          style: { flex: 1, padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-card, white)', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--color-text, #1E1408)', outline: 'none' }
        })
      ),
      React.createElement('div', { style: { display: 'flex', gap: 8, marginBottom: 10 } },
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 5 } }, 'Máximo'),
          React.createElement('input', {
            type: 'number', inputMode: 'numeric',
            value: newMax, min: 1, max: 999,
            onChange: e => setNewMax(e.target.value),
            placeholder: 'Ej: 2',
            'aria-label': 'Cantidad máxima',
            style: { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-card, white)', fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)', outline: 'none' }
          })
        ),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 5 } }, 'Período'),
          React.createElement('div', { style: { display: 'flex', gap: 4 } },
            ['daily', 'weekly'].map(p =>
              React.createElement('button', {
                key: p, type: 'button',
                onClick: () => setNewPeriod(p),
                style: {
                  flex: 1, padding: '10px 4px', borderRadius: 10, cursor: 'pointer', font: 'inherit',
                  fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${newPeriod === p ? '#F5D040' : 'var(--border-color, #EAE0D0)'}`,
                  background: newPeriod === p ? '#FFF3C4' : 'var(--bg-card, white)',
                  color: newPeriod === p ? '#9A6D00' : 'var(--color-muted, #9A8878)',
                }
              }, PERIOD_LABELS[p])
            )
          )
        )
      ),
      React.createElement('button', {
        onClick: addLimit, type: 'button',
        style: {
          width: '100%', padding: '12px', borderRadius: 999, border: 'none',
          background: newName.trim() && parseInt(newMax, 10) > 0 ? '#F5D040' : '#EAE0D0',
          fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
          color: newName.trim() && parseInt(newMax, 10) > 0 ? '#1E1408' : '#B8A898',
          cursor: newName.trim() && parseInt(newMax, 10) > 0 ? 'pointer' : 'not-allowed',
        }
      }, 'Agregar límite')
    ),

    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 16 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--color-sub, #7A6652)', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: () => onSave(localLimits),
        style: { flex: 2, padding: '14px', background: '#F5D040', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#1E1408', cursor: 'pointer' }
      }, 'Guardar')
    )
  );
}

function ToggleSwitch({ active, onToggle }) {
  return React.createElement('div', {
    onClick: onToggle,
    style: {
      width: 44, height: 24, borderRadius: 999, cursor: 'pointer',
      background: active ? '#F5D040' : '#D4C8B4',
      padding: 2, transition: 'background 0.2s ease',
      display: 'flex', alignItems: 'center',
    }
  },
    React.createElement('div', {
      style: {
        width: 20, height: 20, borderRadius: 999, background: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        transform: active ? 'translateX(20px)' : 'translateX(0)',
        transition: 'transform 0.2s ease',
      }
    })
  );
}

function Profile({ userData, dailyGoals, onUpdateGoals, onNavigate, onLogout, onUpdateUserData, notifPrefs, onUpdateNotifPrefs, waterGoal, onUpdateWaterGoal, darkTheme, onUpdateDarkTheme, consumptionLimits, onUpdateConsumptionLimits }) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [showEditActivity, setShowEditActivity] = React.useState(false);
  const [showEditRoutine, setShowEditRoutine] = React.useState(false);
  const [showNotifSettings, setShowNotifSettings] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const [showLimitsSheet, setShowLimitsSheet] = React.useState(false);

  const anyOverlayOpen = showLogoutConfirm || showEdit || showEditProfile || showEditActivity || showEditRoutine || showNotifSettings || showLimitsSheet;

  // Escape closes whichever overlay is open, top-first.
  useEscapeKey(() => {
    if (showLogoutConfirm)      setShowLogoutConfirm(false);
    else if (showLimitsSheet)   setShowLimitsSheet(false);
    else if (showEdit)          setShowEdit(false);
    else if (showEditProfile)   setShowEditProfile(false);
    else if (showEditActivity)  setShowEditActivity(false);
    else if (showEditRoutine)   setShowEditRoutine(false);
    else if (showNotifSettings) setShowNotifSettings(false);
  }, anyOverlayOpen);

  // Hide the bottom nav while any sheet/modal is up so the FAB doesn't
  // overlap the sheet's action buttons.
  useBodyClass('kcalia-modal-open', anyOverlayOpen);

  const goals = dailyGoals || { kcal: 2000, protein: 80, fat: 70, carbs: 300, sugar: 50 };

  const displayGoals = [
    { label: 'Calorías', val: goals.kcal,    unit: 'kcal', color: '#F5D040', bg: '#FFF3C4' },
    { label: 'Proteína', val: goals.protein,  unit: 'g',    color: '#7EC8E3', bg: '#DFF3FA' },
    { label: 'Grasa',    val: goals.fat,      unit: 'g',    color: '#C5A3FF', bg: '#EFE4FF' },
    { label: 'Carbos',   val: goals.carbs,    unit: 'g',    color: '#FF8C69', bg: '#FFE4DB' },
    { label: 'Azúcar',   val: goals.sugar,    unit: 'g',    color: '#FFB3C6', bg: '#FFE8EF' },
    { label: 'Agua',     val: waterGoal || 2000, unit: 'ml', color: '#3A8FB7', bg: '#DFF3FA' },
  ];

  const personalGoal = userData ? (userData.personalGoal || '')      : '';
  const name         = userData ? (userData.name || 'Usuario')       : 'Usuario';
  // Filter empty parts so a name like "Victor  Villagra" (double space) doesn't
  // crash on n[0] for an empty token.
  const initials     = name.split(/\s+/).filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const weight       = userData ? userData.weight       : null;
  const targetWeight = userData ? userData.targetWeight : null;
  const height       = userData ? userData.height       : null;
  const age          = userData ? userData.age          : null;
  const goalKey      = userData ? userData.goal         : null;
  const activity     = userData ? userData.activity     : null;

  function toggleTheme() {
    if (onUpdateDarkTheme) onUpdateDarkTheme(!darkTheme);
  }

  const notifEnabled = notifPrefs ? notifPrefs.enabled : true;

  return React.createElement('div', { style: { padding: '0 0 16px', position: 'relative', background: 'var(--bg-main, #FEFAF3)' } },
    React.createElement('div', { style: { padding: '16px 24px 20px' } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 26, fontWeight: 800, color: 'var(--color-text, #1E1408)' } }, 'Mi perfil')
    ),
    // Profile card
    React.createElement('div', { style: { margin: '0 16px 14px', background: 'var(--bg-card, white)', borderRadius: 20, padding: '20px 16px', boxShadow: '0 2px 12px rgba(30,20,8,0.08)', display: 'flex', alignItems: 'center', gap: 16 } },
      React.createElement('div', { style: { width: 64, height: 64, borderRadius: 999, background: '#FFF3C4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } },
        React.createElement('span', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 900, color: '#F5C030' } }, initials || 'KC')
      ),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)' } }, name),
        React.createElement('div', { style: { fontSize: 13, color: 'var(--color-sub, #7A6652)', marginTop: 2 } },
          [age && `${age} años`, weight && `${weight} kg`, height && `${height} cm`].filter(Boolean).join(' · ') || 'Sin datos'
        ),
        // Weight progress row
        (weight || targetWeight) && React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 4 } },
          [weight && `Actual: ${weight} kg`, targetWeight && `Meta: ${targetWeight} kg`].filter(Boolean).join(' → ')
        ),
        React.createElement('div', { style: { marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' } },
          goalKey && React.createElement('div', { style: { background: '#FFF3C4', borderRadius: 999, padding: '3px 10px' } },
            React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: '#9A6D00' } }, GOAL_LABELS_MAP[goalKey] || goalKey)
          ),
          activity && React.createElement('button', {
            onClick: () => setShowEditActivity(true),
            'aria-label': `Editar nivel de actividad: ${ACTIVITY_MAP[activity] || activity}`,
            type: 'button',
            style: { background: '#D8F5DB', borderRadius: 999, padding: '8px 14px', cursor: 'pointer', border: 'none', font: 'inherit', minHeight: 36 }
          },
            React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: '#1F5F2A' } }, (ACTIVITY_MAP[activity] || activity) + ' ✎')
          )
        )
      )
    ),
    // Personal motivation (from onboarding's personalGoal). Hidden when empty.
    personalGoal && React.createElement('div', { style: { margin: '0 16px 14px', background: 'var(--bg-card, white)', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(30,20,8,0.07)' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } },
        React.createElement('span', { style: { fontSize: 16 } }, '🎯'),
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--color-text, #1E1408)' } }, 'Tu motivación')
      ),
      React.createElement('div', { style: { fontSize: 13, color: 'var(--color-sub, #5A4838)', lineHeight: 1.55, fontStyle: 'italic' } }, `"${personalGoal}"`)
    ),
    // Consumption limits card
    React.createElement('div', { style: { margin: '0 16px 14px', background: 'var(--bg-card, white)', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(30,20,8,0.07)' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: (consumptionLimits && consumptionLimits.length > 0) ? 10 : 0 } },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('span', { style: { fontSize: 16 } }, '🚦'),
          React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)' } }, 'Límites de consumo')
        ),
        React.createElement('button', {
          onClick: () => setShowLimitsSheet(true),
          type: 'button',
          style: { fontSize: 13, fontWeight: 600, color: '#9A6D00', background: '#FFF3C4', border: 'none', borderRadius: 999, padding: '8px 16px', minHeight: 36, cursor: 'pointer' }
        }, 'Configurar')
      ),
      (!consumptionLimits || consumptionLimits.length === 0)
        ? React.createElement('div', { style: { fontSize: 13, color: 'var(--color-muted, #9A8878)', marginTop: 4 } }, 'Sin límites configurados. Toca "Configurar" para agregar uno.')
        : consumptionLimits.map(l =>
            React.createElement('div', {
              key: l.id,
              style: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)' }
            },
              React.createElement('span', { style: { fontSize: 18 } }, l.icon || '⚡'),
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, l.name),
                React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 1 } },
                  `Máx. ${l.limit} · ${l.period === 'weekly' ? 'Semanal' : 'Diario'}`
                )
              )
            )
          )
    ),
    // Goals card
    React.createElement('div', { style: { margin: '0 16px 14px', background: 'var(--bg-card, white)', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(30,20,8,0.07)' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)' } }, 'Mis metas diarias'),
        React.createElement('button', {
          onClick: () => setShowEdit(true),
          style: { fontSize: 13, fontWeight: 600, color: '#9A6D00', background: '#FFF3C4', border: 'none', borderRadius: 999, padding: '8px 16px', minHeight: 36, cursor: 'pointer' }
        }, 'Editar')
      ),
      displayGoals.map((g, i) => React.createElement(GoalRow, { key: i, goal: g }))
    ),
    // Settings card
    React.createElement('div', { style: { margin: '0 16px 14px', background: 'var(--bg-card, white)', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(30,20,8,0.07)' } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)', marginBottom: 4 } }, 'Configuración'),
      // Editar perfil
      React.createElement('button', {
        onClick: () => setShowEditProfile(true),
        'aria-label': 'Editar perfil',
        type: 'button',
        style: { width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)', cursor: 'pointer', background: 'transparent', border: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', color: 'inherit', font: 'inherit', minHeight: 48 }
      },
        React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, 'Editar perfil'),
        React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#B8A898', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '9 18 15 12 9 6' })
        )
      ),
      // Editar actividad
      React.createElement('button', {
        onClick: () => setShowEditActivity(true),
        'aria-label': 'Editar actividad y estilo de vida',
        type: 'button',
        style: { width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)', cursor: 'pointer', background: 'transparent', border: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', color: 'inherit', font: 'inherit', minHeight: 48 }
      },
        React.createElement('div', null,
          React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, 'Actividad y estilo de vida'),
          activity && React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 1 } }, `${ACTIVITY_MAP[activity] || activity}${userData && userData.lifestyle ? ' · ' + (LIFESTYLE_MAP[userData.lifestyle] || userData.lifestyle) : ''}`)
        ),
        React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#B8A898', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '9 18 15 12 9 6' })
        )
      ),
      // Rutina semanal
      React.createElement('button', {
        onClick: () => setShowEditRoutine(true),
        'aria-label': 'Editar rutina semanal',
        type: 'button',
        style: { width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)', cursor: 'pointer', background: 'transparent', border: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', color: 'inherit', font: 'inherit', minHeight: 48 }
      },
        React.createElement('div', null,
          React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, 'Rutina semanal'),
          (() => {
            const r = userData && userData.routine;
            if (!r || Object.keys(r).length === 0) {
              return React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 1 } }, 'Sin configurar');
            }
            const counts = { strength: 0, cardio: 0, mixed: 0, rest: 0 };
            Object.values(r).forEach(t => { if (counts[t] !== undefined) counts[t]++; });
            const parts = [];
            if (counts.strength) parts.push(`${counts.strength} fuerza`);
            if (counts.cardio)   parts.push(`${counts.cardio} cardio`);
            if (counts.mixed)    parts.push(`${counts.mixed} mixto`);
            if (counts.rest)     parts.push(`${counts.rest} descanso`);
            return React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 1 } }, parts.join(' · '));
          })()
        ),
        React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#B8A898', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '9 18 15 12 9 6' })
        )
      ),
      // Notificaciones
      React.createElement('button', {
        onClick: () => setShowNotifSettings(true),
        'aria-label': `Configurar notificaciones, actualmente ${notifEnabled ? 'activas' : 'desactivadas'}`,
        type: 'button',
        style: { width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)', cursor: 'pointer', background: 'transparent', border: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', color: 'inherit', font: 'inherit', minHeight: 48 }
      },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, 'Notificaciones'),
          React.createElement('div', { style: { background: notifEnabled ? '#D8F5DB' : '#FFE0E0', borderRadius: 999, padding: '1px 8px' } },
            React.createElement('span', { style: { fontSize: 10, fontWeight: 600, color: notifEnabled ? '#2A7D3A' : '#C03030' } }, notifEnabled ? 'Activas' : 'Desactivadas')
          )
        ),
        React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#B8A898', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '9 18 15 12 9 6' })
        )
      ),
      // Tema toggle
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0' }
      },
        React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, 'Tema oscuro'),
        React.createElement(ToggleSwitch, { active: darkTheme, onToggle: toggleTheme })
      )
    ),
    React.createElement('div', { style: { margin: '0 16px' } },
      React.createElement('button', {
        onClick: () => setShowLogoutConfirm(true),
        style: { width: '100%', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, padding: '14px', fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#FF6B6B', cursor: 'pointer' }
      }, 'Cerrar sesión')
    ),
    showLogoutConfirm && React.createElement('div', {
      onClick: () => setShowLogoutConfirm(false),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.45)', zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }
    },
      React.createElement('div', {
        onClick: e => e.stopPropagation(),
        role: 'alertdialog',
        'aria-labelledby': 'logout-title',
        style: { background: 'var(--bg-card, white)', borderRadius: 20, padding: '22px 20px', maxWidth: 340, width: '100%', boxShadow: '0 16px 48px rgba(30,20,8,0.25)' }
      },
        React.createElement('div', { id: 'logout-title', style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', marginBottom: 8 } }, '¿Cerrar sesión?'),
        React.createElement('div', { style: { fontSize: 14, color: 'var(--color-sub, #7A6652)', marginBottom: 18, lineHeight: 1.5 } }, 'Esto borrará todos tus datos guardados en este dispositivo: comidas, agua, biblioteca personal y preferencias. Esta acción no se puede deshacer.'),
        React.createElement('div', { style: { display: 'flex', gap: 10 } },
          React.createElement('button', {
            onClick: () => setShowLogoutConfirm(false),
            type: 'button',
            style: { flex: 1, padding: '13px', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--color-sub, #5A4838)', cursor: 'pointer', minHeight: 44 }
          }, 'Cancelar'),
          React.createElement('button', {
            onClick: () => { setShowLogoutConfirm(false); if (onLogout) onLogout(); },
            type: 'button',
            style: { flex: 1, padding: '13px', background: '#FF6B6B', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', minHeight: 44, boxShadow: '0 2px 8px rgba(255,107,107,0.35)' }
          }, 'Cerrar sesión')
        )
      )
    ),
    showEdit && React.createElement('div', {
      onClick: () => setShowEdit(false),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 50 }
    }),
    showEdit && React.createElement(EditGoalsSheet, {
      goals,
      waterGoal,
      onClose: () => setShowEdit(false),
      onSave: (newGoals, newWaterGoal) => {
        if (onUpdateGoals) onUpdateGoals(newGoals);
        if (onUpdateWaterGoal && typeof newWaterGoal === 'number') onUpdateWaterGoal(newWaterGoal);
        setShowEdit(false);
      }
    }),
    showEditProfile && React.createElement('div', {
      onClick: () => setShowEditProfile(false),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 50 }
    }),
    showEditProfile && React.createElement(EditProfileSheet, {
      userData,
      onClose: () => setShowEditProfile(false),
      onSave: (newData) => {
        if (onUpdateUserData) onUpdateUserData(prev => ({ ...prev, ...newData }));
        setShowEditProfile(false);
      }
    }),
    showNotifSettings && React.createElement('div', {
      onClick: () => setShowNotifSettings(false),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 50 }
    }),
    showNotifSettings && React.createElement(NotificationSettingsSheet, {
      prefs: notifPrefs || DEFAULT_NOTIF_PREFS,
      onClose: () => setShowNotifSettings(false),
      onUpdatePrefs: (newPrefs) => {
        if (onUpdateNotifPrefs) onUpdateNotifPrefs(newPrefs);
        setShowNotifSettings(false);
      }
    }),
    showEditActivity && React.createElement('div', {
      onClick: () => setShowEditActivity(false),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 50 }
    }),
    showEditActivity && React.createElement(EditActivitySheet, {
      userData,
      onClose: () => setShowEditActivity(false),
      onSave: (updates) => {
        if (onUpdateUserData) onUpdateUserData(prev => ({ ...prev, ...updates }));
        setShowEditActivity(false);
      }
    }),
    showEditRoutine && React.createElement('div', {
      onClick: () => setShowEditRoutine(false),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 50 }
    }),
    showEditRoutine && React.createElement(EditRoutineSheet, {
      userData,
      onClose: () => setShowEditRoutine(false),
      onSave: (updates) => {
        if (onUpdateUserData) onUpdateUserData(prev => ({ ...prev, ...updates }));
        setShowEditRoutine(false);
      }
    }),
    showLimitsSheet && React.createElement('div', {
      onClick: () => setShowLimitsSheet(false),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 50 }
    }),
    showLimitsSheet && React.createElement(ConsumptionLimitsSheet, {
      limits: consumptionLimits || [],
      onClose: () => setShowLimitsSheet(false),
      onSave: (newLimits) => {
        if (onUpdateConsumptionLimits) onUpdateConsumptionLimits(newLimits);
        setShowLimitsSheet(false);
      }
    })
  );
}

Object.assign(window, { Profile, EditProfileSheet, ToggleSwitch, ConsumptionLimitsSheet });
