// Profile.jsx — User profile, goals, and settings screen

const GOAL_LABELS_MAP = {
  lose_fat: 'Perder grasa',
  gain_muscle: 'Ganar músculo',
  maintain: 'Mantener peso',
  performance: 'Mejorar rendimiento',
};

const ACTIVITY_MAP = {
  sedentary: 'Sedentario',
  light: 'Ligero',
  moderate: 'Moderado',
  active: 'Activo',
  very_active: 'Muy activo',
};

const LIFESTYLE_MAP = {
  desk:     'Sentado todo el día',
  mixed:    'Mezcla de pie/sentado',
  standing: 'De pie la mayor parte',
  walking:  'Caminando todo el día',
};

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

function EditGoalsSheet({ goals, onClose, onSave }) {
  const [values, setValues] = React.useState({ ...goals });

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
      { key: 'kcal',    label: 'Calorías (kcal)', color: '#F5D040' },
      { key: 'protein', label: 'Proteína (g)',     color: '#7EC8E3' },
      { key: 'fat',     label: 'Grasa (g)',        color: '#C5A3FF' },
      { key: 'carbs',   label: 'Carbohidratos (g)',color: '#FF8C69' },
      { key: 'sugar',   label: 'Azúcar (g)',       color: '#FFB3C6' },
    ].map(f =>
      React.createElement('div', { key: f.key, style: { marginBottom: 12 } },
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 5 } }, f.label),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('button', {
            onClick: () => setValues(v => ({ ...v, [f.key]: Math.max(f.key === 'kcal' ? 500 : 0, (v[f.key] || 0) - (f.key === 'kcal' ? 50 : 5)) })),
            style: { width: 36, height: 36, borderRadius: 999, border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-card, white)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-text, #1E1408)' }
          }, '−'),
          React.createElement('input', {
            type: 'number',
            value: values[f.key] || 0,
            onChange: e => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v) && v >= 0) setValues(prev => ({ ...prev, [f.key]: v }));
            },
            style: { flex: 1, textAlign: 'center', padding: '10px', borderRadius: 12, border: `1.5px solid ${f.color}44`, fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', background: 'var(--bg-input, white)', outline: 'none' }
          }),
          React.createElement('button', {
            onClick: () => setValues(v => ({ ...v, [f.key]: (v[f.key] || 0) + (f.key === 'kcal' ? 50 : 5) })),
            style: { width: 36, height: 36, borderRadius: 999, background: '#F5D040', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }
          }, '+')
        )
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 16 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--color-sub, #7A6652)', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: () => onSave(values),
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

  function update(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const fields = [
    { key: 'name',         label: 'Nombre',            type: 'text',   placeholder: 'Tu nombre',  min: null, max: null },
    { key: 'age',          label: 'Edad',               type: 'number', placeholder: 'Años',       min: 10,   max: 110 },
    { key: 'weight',       label: 'Peso actual (kg)',   type: 'number', placeholder: 'kg',         min: 20,   max: 500 },
    { key: 'targetWeight', label: 'Peso objetivo (kg)', type: 'number', placeholder: 'kg',         min: 20,   max: 500 },
    { key: 'height',       label: 'Altura (cm)',        type: 'number', placeholder: 'cm',         min: 50,   max: 300 },
  ];

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
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 5 } }, f.label),
        React.createElement('input', {
          type: f.type, placeholder: f.placeholder, value: form[f.key],
          min: f.min !== null ? f.min : undefined,
          max: f.max !== null ? f.max : undefined,
          onChange: e => {
            if (f.type === 'number') {
              if (e.target.value === '') { update(f.key, ''); return; }
              const v = parseFloat(e.target.value);
              if (isNaN(v)) return;
              if (f.min !== null && v < f.min) return;
              if (f.max !== null && v > f.max) return;
              update(f.key, v);
            } else {
              update(f.key, e.target.value.slice(0, 60));
            }
          },
          style: { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-input, white)', fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'var(--color-text, #1E1408)', outline: 'none' }
        })
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 8 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--color-sub, #7A6652)', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: () => onSave(form),
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

function Profile({ userData, dailyGoals, onUpdateGoals, onNavigate, onLogout, onUpdateUserData, notifPrefs, onUpdateNotifPrefs }) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [showEditActivity, setShowEditActivity] = React.useState(false);
  const [showNotifSettings, setShowNotifSettings] = React.useState(false);
  const [darkTheme, setDarkTheme] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('kcalia_dark_theme') || 'false'); } catch { return false; }
  });

  const goals = dailyGoals || { kcal: 2000, protein: 80, fat: 70, carbs: 300, sugar: 50 };

  const displayGoals = [
    { label: 'Calorías', val: goals.kcal,    unit: 'kcal', color: '#F5D040', bg: '#FFF3C4' },
    { label: 'Proteína', val: goals.protein,  unit: 'g',    color: '#7EC8E3', bg: '#DFF3FA' },
    { label: 'Grasa',    val: goals.fat,      unit: 'g',    color: '#C5A3FF', bg: '#EFE4FF' },
    { label: 'Carbos',   val: goals.carbs,    unit: 'g',    color: '#FF8C69', bg: '#FFE4DB' },
    { label: 'Azúcar',   val: goals.sugar,    unit: 'g',    color: '#FFB3C6', bg: '#FFE8EF' },
  ];

  const name         = userData ? (userData.name || 'Usuario')       : 'Usuario';
  const initials     = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const weight       = userData ? userData.weight       : null;
  const targetWeight = userData ? userData.targetWeight : null;
  const height       = userData ? userData.height       : null;
  const age          = userData ? userData.age          : null;
  const goalKey      = userData ? userData.goal         : null;
  const activity     = userData ? userData.activity     : null;

  function toggleTheme() {
    const next = !darkTheme;
    setDarkTheme(next);
    localStorage.setItem('kcalia_dark_theme', JSON.stringify(next));
    if (next) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
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
          activity && React.createElement('div', {
            onClick: () => setShowEditActivity(true),
            style: { background: '#D8F5DB', borderRadius: 999, padding: '3px 10px', cursor: 'pointer' }
          },
            React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: '#2A7D3A' } }, (ACTIVITY_MAP[activity] || activity) + ' ✎')
          )
        )
      )
    ),
    // Goals card
    React.createElement('div', { style: { margin: '0 16px 14px', background: 'var(--bg-card, white)', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(30,20,8,0.07)' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)' } }, 'Mis metas diarias'),
        React.createElement('span', {
          onClick: () => setShowEdit(true),
          style: { fontSize: 13, fontWeight: 600, color: '#F5D040', cursor: 'pointer' }
        }, 'Editar')
      ),
      displayGoals.map((g, i) => React.createElement(GoalRow, { key: i, goal: g }))
    ),
    // Settings card
    React.createElement('div', { style: { margin: '0 16px 14px', background: 'var(--bg-card, white)', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(30,20,8,0.07)' } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E1408)', marginBottom: 4 } }, 'Configuración'),
      // Editar perfil
      React.createElement('div', {
        onClick: () => setShowEditProfile(true),
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)', cursor: 'pointer' }
      },
        React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, 'Editar perfil'),
        React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#B8A898', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '9 18 15 12 9 6' })
        )
      ),
      // Editar actividad
      React.createElement('div', {
        onClick: () => setShowEditActivity(true),
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)', cursor: 'pointer' }
      },
        React.createElement('div', null,
          React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, 'Actividad y estilo de vida'),
          activity && React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 1 } }, `${ACTIVITY_MAP[activity] || activity}${userData && userData.lifestyle ? ' · ' + (LIFESTYLE_MAP[userData.lifestyle] || userData.lifestyle) : ''}`)
        ),
        React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#B8A898', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '9 18 15 12 9 6' })
        )
      ),
      // Notificaciones
      React.createElement('div', {
        onClick: () => setShowNotifSettings(true),
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)', cursor: 'pointer' }
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
        onClick: onLogout,
        style: { width: '100%', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, padding: '14px', fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#FF6B6B', cursor: 'pointer' }
      }, 'Cerrar sesión')
    ),
    showEdit && React.createElement('div', {
      onClick: () => setShowEdit(false),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 50 }
    }),
    showEdit && React.createElement(EditGoalsSheet, {
      goals,
      onClose: () => setShowEdit(false),
      onSave: (newGoals) => {
        if (onUpdateGoals) onUpdateGoals(newGoals);
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
    })
  );
}

Object.assign(window, { Profile, EditProfileSheet, ToggleSwitch });
