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

function GoalRow({ goal, onEdit }) {
  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F5EFE4' }
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
      React.createElement('div', { style: { width: 10, height: 10, borderRadius: 999, background: goal.color, flexShrink: 0 } }),
      React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: '#1E1408' } }, goal.label)
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
      background: 'white', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '80%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1E1408', marginBottom: 16 } }, 'Editar metas diarias'),
    [
      { key: 'kcal',    label: 'Calorías (kcal)', color: '#F5D040' },
      { key: 'protein', label: 'Proteína (g)',     color: '#7EC8E3' },
      { key: 'fat',     label: 'Grasa (g)',        color: '#C5A3FF' },
      { key: 'carbs',   label: 'Carbohidratos (g)',color: '#FF8C69' },
      { key: 'sugar',   label: 'Azúcar (g)',       color: '#FFB3C6' },
    ].map(f =>
      React.createElement('div', { key: f.key, style: { marginBottom: 12 } },
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#5A4838', marginBottom: 5 } }, f.label),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('button', {
            onClick: () => setValues(v => ({ ...v, [f.key]: Math.max(0, (v[f.key] || 0) - (f.key === 'kcal' ? 50 : 5)) })),
            style: { width: 36, height: 36, borderRadius: 999, border: '1.5px solid #EAE0D0', background: 'white', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }
          }, '−'),
          React.createElement('input', {
            type: 'number',
            value: values[f.key] || 0,
            onChange: e => setValues(v => ({ ...v, [f.key]: parseFloat(e.target.value) || 0 })),
            style: { flex: 1, textAlign: 'center', padding: '10px', borderRadius: 12, border: `1.5px solid ${f.color}44`, fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1E1408', outline: 'none' }
          }),
          React.createElement('button', {
            onClick: () => setValues(v => ({ ...v, [f.key]: (v[f.key] || 0) + (f.key === 'kcal' ? 50 : 5) })),
            style: { width: 36, height: 36, borderRadius: 999, background: '#F5D040', border: 'none', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }
          }, '+')
        )
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 16 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'white', border: '1.5px solid #EAE0D0', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#7A6652', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: () => onSave(values),
        style: { flex: 2, padding: '14px', background: '#F5D040', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#1E1408', cursor: 'pointer' }
      }, 'Guardar metas')
    )
  );
}

function EditProfileSheet({ userData, onClose, onSave }) {
  const [form, setForm] = React.useState({
    name: userData ? userData.name || '' : '',
    age: userData ? userData.age || '' : '',
    weight: userData ? userData.weight || '' : '',
    height: userData ? userData.height || '' : '',
  });

  function update(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const fields = [
    { key: 'name',   label: 'Nombre',     type: 'text',   placeholder: 'Tu nombre' },
    { key: 'age',    label: 'Edad',        type: 'number', placeholder: 'Años' },
    { key: 'weight', label: 'Peso (kg)',   type: 'number', placeholder: 'kg' },
    { key: 'height', label: 'Altura (cm)', type: 'number', placeholder: 'cm' },
  ];

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'white', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '80%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1E1408', marginBottom: 16 } }, 'Editar perfil'),
    fields.map(f =>
      React.createElement('div', { key: f.key, style: { marginBottom: 14 } },
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#5A4838', marginBottom: 5 } }, f.label),
        React.createElement('input', {
          type: f.type, placeholder: f.placeholder, value: form[f.key],
          onChange: e => update(f.key, f.type === 'number' ? (e.target.value === '' ? '' : parseFloat(e.target.value)) : e.target.value),
          style: { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #EAE0D0', fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#1E1408', outline: 'none' }
        })
      )
    ),
    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 8 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'white', border: '1.5px solid #EAE0D0', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#7A6652', cursor: 'pointer' } }, 'Cancelar'),
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

  const name     = userData ? (userData.name || 'Usuario')     : 'Usuario';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const weight   = userData ? userData.weight  : '—';
  const height   = userData ? userData.height  : '—';
  const age      = userData ? userData.age     : '—';
  const goalKey  = userData ? userData.goal    : null;
  const activity = userData ? userData.activity: null;

  function toggleTheme() {
    const next = !darkTheme;
    setDarkTheme(next);
    localStorage.setItem('kcalia_dark_theme', JSON.stringify(next));
  }

  const notifEnabled = notifPrefs ? notifPrefs.enabled : true;

  return React.createElement('div', { style: { padding: '0 0 16px', position: 'relative' } },
    React.createElement('div', { style: { padding: '16px 24px 20px' } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 26, fontWeight: 800, color: '#1E1408' } }, 'Mi perfil')
    ),
    React.createElement('div', { style: { margin: '0 16px 14px', background: 'white', borderRadius: 20, padding: '20px 16px', boxShadow: '0 2px 12px rgba(30,20,8,0.08)', display: 'flex', alignItems: 'center', gap: 16 } },
      React.createElement('div', { style: { width: 64, height: 64, borderRadius: 999, background: '#FFF3C4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } },
        React.createElement('span', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 900, color: '#F5C030' } }, initials || 'KC')
      ),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1E1408' } }, name),
        React.createElement('div', { style: { fontSize: 13, color: '#7A6652', marginTop: 2 } },
          [age && `${age} años`, weight && `${weight} kg`, height && `${height} cm`].filter(Boolean).join(' · ') || 'Sin datos'
        ),
        React.createElement('div', { style: { marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' } },
          goalKey && React.createElement('div', { style: { background: '#FFF3C4', borderRadius: 999, padding: '3px 10px' } },
            React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: '#9A6D00' } }, GOAL_LABELS_MAP[goalKey] || goalKey)
          ),
          activity && React.createElement('div', { style: { background: '#D8F5DB', borderRadius: 999, padding: '3px 10px' } },
            React.createElement('span', { style: { fontSize: 11, fontWeight: 600, color: '#2A7D3A' } }, ACTIVITY_MAP[activity] || activity)
          )
        )
      )
    ),
    React.createElement('div', { style: { margin: '0 16px 14px', background: 'white', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(30,20,8,0.07)' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: '#1E1408' } }, 'Mis metas diarias'),
        React.createElement('span', {
          onClick: () => setShowEdit(true),
          style: { fontSize: 13, fontWeight: 600, color: '#F5D040', cursor: 'pointer' }
        }, 'Editar')
      ),
      displayGoals.map((g, i) => React.createElement(GoalRow, { key: i, goal: g }))
    ),
    // Configuración section
    React.createElement('div', { style: { margin: '0 16px 14px', background: 'white', borderRadius: 20, padding: '16px 18px', boxShadow: '0 2px 12px rgba(30,20,8,0.07)' } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 700, color: '#1E1408', marginBottom: 4 } }, 'Configuración'),
      // Editar perfil
      React.createElement('div', {
        onClick: () => setShowEditProfile(true),
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #F5EFE4', cursor: 'pointer' }
      },
        React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: '#1E1408' } }, 'Editar perfil'),
        React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#B8A898', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '9 18 15 12 9 6' })
        )
      ),
      // Notificaciones - clickable row
      React.createElement('div', {
        onClick: () => setShowNotifSettings(true),
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #F5EFE4', cursor: 'pointer' }
      },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
          React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: '#1E1408' } }, 'Notificaciones'),
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
        React.createElement('span', { style: { fontSize: 14, fontWeight: 500, color: '#1E1408' } }, 'Tema oscuro'),
        React.createElement(ToggleSwitch, { active: darkTheme, onToggle: toggleTheme })
      )
    ),
    React.createElement('div', { style: { margin: '0 16px' } },
      React.createElement('button', {
        onClick: onLogout,
        style: { width: '100%', background: 'white', border: '1.5px solid #EAE0D0', borderRadius: 999, padding: '14px', fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#FF6B6B', cursor: 'pointer' }
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
    // Notification settings overlay
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
    })
  );
}

Object.assign(window, { Profile, EditProfileSheet, ToggleSwitch });
