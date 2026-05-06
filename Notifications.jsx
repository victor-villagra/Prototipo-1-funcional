// Notifications.jsx — In-app notification center, settings & generation

const NOTIF_STYLES = {
  reminder:   { icon: '⏰', color: '#7EC8E3', bg: '#DFF3FA', label: 'Recordatorio' },
  alert:      { icon: '⚠️', color: '#FFAB5E', bg: '#FEF0D0', label: 'Alerta' },
  report:     { icon: '📊', color: '#C5A3FF', bg: '#EFE4FF', label: 'Reporte' },
  motivation: { icon: '🎉', color: '#6BCB77', bg: '#D8F5DB', label: 'Motivación' },
  tip:        { icon: '💡', color: '#F5D040', bg: '#FFF3C4', label: 'Consejo' },
};

const DEFAULT_NOTIF_PREFS = {
  enabled: true,
  mealReminders: true,
  goalAlerts: true,
  weeklyReports: true,
  motivation: true,
  tips: true,
};

// ── Notification generation ───────────────────────────────────────
function generateAppNotifications(todayMeals, dailyGoals, dailyLog, userData, existing, prefs) {
  if (!prefs || !prefs.enabled) return [];
  const out = [];
  const now = new Date();
  const todayStr = now.toDateString();
  const hour = now.getHours();

  const has = (subtype) => existing.some(n =>
    n.subtype === subtype && new Date(n.timestamp).toDateString() === todayStr
  );

  // ── Meal reminders ──
  if (prefs.mealReminders) {
    if (hour >= 7 && hour < 11 && todayMeals.length === 0 && !has('breakfast_rem')) {
      out.push({ type: 'reminder', subtype: 'breakfast_rem', title: '¿Ya desayunaste? 🍳', message: 'Registra tu desayuno para mantener el seguimiento al día.', action: { screen: 'add', mealName: 'Desayuno' } });
    }
    if (hour >= 12 && hour < 15 && !has('lunch_rem')) {
      const hasLunch = todayMeals.some(m => (m.name || '').toLowerCase().includes('almuerzo'));
      if (!hasLunch) out.push({ type: 'reminder', subtype: 'lunch_rem', title: 'Hora del almuerzo 🍽️', message: 'No olvides registrar tu almuerzo para no perder el seguimiento.', action: { screen: 'add', mealName: 'Almuerzo' } });
    }
    if (hour >= 19 && hour < 23 && !has('dinner_rem')) {
      const hasDinner = todayMeals.some(m => (m.name || '').toLowerCase().includes('cena'));
      if (!hasDinner) out.push({ type: 'reminder', subtype: 'dinner_rem', title: '¿Ya cenaste? 🌙', message: 'Registra tu cena antes de terminar el día.', action: { screen: 'add', mealName: 'Cena' } });
    }
  }

  // ── Goal alerts ──
  if (prefs.goalAlerts && todayMeals.length > 0) {
    const totalKcal = todayMeals.reduce((s, m) => s + (m.totalKcal || 0), 0);
    const goal = dailyGoals?.kcal || 2000;
    if (totalKcal > goal && !has('over_goal')) {
      out.push({ type: 'alert', subtype: 'over_goal', title: 'Meta calórica superada', message: `Llevas ${Math.round(totalKcal)} de ${goal} kcal planificadas. Considera opciones más ligeras para el resto del día.` });
    } else if (totalKcal >= goal * 0.85 && totalKcal < goal && !has('near_goal')) {
      out.push({ type: 'alert', subtype: 'near_goal', title: 'Cerca de tu meta 🎯', message: `Llevas ${Math.round(totalKcal)} kcal. Te faltan ${Math.round(goal - totalKcal)} para alcanzar tu meta diaria.` });
    }
    const totalProtein = todayMeals.reduce((s, m) => s + (m.totalProtein || 0), 0);
    const protGoal = dailyGoals?.protein || 80;
    if (totalProtein >= protGoal && !has('protein_done')) {
      out.push({ type: 'motivation', subtype: 'protein_done', title: '¡Meta de proteína alcanzada! 💪', message: `Consumiste ${Math.round(totalProtein)}g de proteína hoy. ¡Excelente trabajo!` });
    }
  }

  // ── Weekly report (Monday) ──
  if (prefs.weeklyReports && now.getDay() === 1 && !has('weekly_report')) {
    out.push({ type: 'report', subtype: 'weekly_report', title: 'Resumen semanal disponible 📊', message: 'Tu análisis de la semana pasada está listo. Revisa tu progreso y ajusta tus metas.', action: { screen: 'weekly' } });
  }

  // ── Motivation ──
  if (prefs.motivation && !has('daily_motiv')) {
    const motivs = [
      { title: '¡Sigue así! 🌟', message: 'Cada comida registrada te acerca más a tus metas.' },
      { title: '¡Tú puedes! 💪', message: 'La constancia es la clave del éxito. ¡No te rindas!' },
      { title: 'Nuevo día, nueva oportunidad ☀️', message: 'Hoy es un gran día para cuidar tu alimentación.' },
      { title: '¡Gran progreso! 🚀', message: 'Registrar lo que comes es el primer paso hacia tus objetivos.' },
    ];
    // Only show if at least 1 day logged this week
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
    const hasWeekData = (dailyLog || []).some(m => new Date(m.date) >= weekStart);
    if (hasWeekData) {
      const pick = motivs[Math.floor(Math.random() * motivs.length)];
      out.push({ type: 'motivation', subtype: 'daily_motiv', ...pick });
    }
  }

  // ── Tips ──
  if (prefs.tips && !has('daily_tip')) {
    const tips = [
      'Beber agua antes de cada comida puede ayudarte a controlar las porciones.',
      'Intenta incluir proteína en cada comida para mantener la saciedad.',
      'Las frutas son un excelente snack bajo en calorías y rico en nutrientes.',
      'Planificar tus comidas con anticipación reduce la tentación de comer mal.',
      'Dormir bien es tan importante como comer bien para tus metas.',
      'Los carbohidratos complejos te dan energía sostenida durante el día.',
      'No te saltes comidas: comer regularmente estabiliza tu metabolismo.',
    ];
    if (hour >= 9 && hour < 21) {
      const pick = tips[new Date().getDate() % tips.length];
      out.push({ type: 'tip', subtype: 'daily_tip', title: 'Consejo del día 💡', message: pick });
    }
  }

  return out.map(n => ({ ...n, id: Date.now() + Math.random(), read: false, timestamp: now.toISOString() }));
}

// ── Notification Center ───────────────────────────────────────────
function NotificationCenter({ notifications, onMarkRead, onMarkAllRead, onClearAll, onAction, onBack, onOpenSettings }) {
  const unread = notifications.filter(n => !n.read).length;

  function timeAgo(ts) {
    const diff = (Date.now() - new Date(ts).getTime()) / 1000;
    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    return `Hace ${Math.floor(diff / 86400)}d`;
  }

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-main, #FEFAF3)' } },
    // Header
    React.createElement('div', { style: { padding: '12px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 } },
      React.createElement('div', { onClick: onBack, style: { cursor: 'pointer', padding: 4 } },
        React.createElement(Icon, { name: 'back' })
      ),
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--color-text, #1E1408)' } }, 'Notificaciones'),
      ),
      React.createElement('div', { onClick: onOpenSettings, style: { cursor: 'pointer', padding: 4 } },
        React.createElement(Icon, { name: 'settings' })
      )
    ),

    // Action bar
    notifications.length > 0 && React.createElement('div', { style: { padding: '0 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
      React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: 'var(--color-muted, #9A8878)' } }, `${unread} sin leer · ${notifications.length} total`),
      React.createElement('div', { style: { display: 'flex', gap: 12 } },
        unread > 0 && React.createElement('span', { onClick: onMarkAllRead, style: { fontSize: 12, fontWeight: 600, color: '#7EC8E3', cursor: 'pointer' } }, 'Leer todo'),
        React.createElement('span', { onClick: onClearAll, style: { fontSize: 12, fontWeight: 600, color: '#FF8C69', cursor: 'pointer' } }, 'Limpiar')
      )
    ),

    // List
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 20px 20px' } },
      notifications.length === 0
        ? React.createElement('div', { style: { textAlign: 'center', padding: '48px 16px' } },
            React.createElement('div', { style: { fontSize: 48, marginBottom: 12 } }, '🔔'),
            React.createElement('div', { style: { fontSize: 16, fontWeight: 600, color: 'var(--color-text, #1E1408)', marginBottom: 4 } }, 'Sin notificaciones'),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--color-muted, #9A8878)', lineHeight: 1.5 } }, 'Aquí aparecerán tus recordatorios, alertas y reportes.')
          )
        : notifications.map(n => {
            const s = NOTIF_STYLES[n.type] || NOTIF_STYLES.tip;
            return React.createElement('div', {
              key: n.id,
              onClick: () => {
                if (!n.read) onMarkRead(n.id);
                if (n.action) onAction(n.action);
              },
              style: {
                background: n.read ? 'var(--bg-card, white)' : s.bg,
                border: `1.5px solid ${n.read ? 'var(--border-color, #EAE0D0)' : s.color + '44'}`,
                borderRadius: 16, padding: '12px 14px', marginBottom: 8,
                cursor: n.action ? 'pointer' : 'default',
                opacity: n.read ? 0.75 : 1,
                transition: 'all 0.15s',
              }
            },
              React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10 } },
                React.createElement('div', { style: { width: 36, height: 36, borderRadius: 12, background: n.read ? 'var(--bg-card2, #F5EFE4)' : s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 } }, s.icon),
                React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 } },
                    React.createElement('div', { style: { fontSize: 14, fontWeight: n.read ? 500 : 700, color: 'var(--color-text, #1E1408)', lineHeight: 1.3 } }, n.title),
                    React.createElement('span', { style: { fontSize: 10, color: 'var(--color-muted, #9A8878)', flexShrink: 0, marginTop: 2 } }, timeAgo(n.timestamp))
                  ),
                  React.createElement('div', { style: { fontSize: 12, color: 'var(--color-sub, #7A6652)', marginTop: 3, lineHeight: 1.4 } }, n.message),
                  n.action && React.createElement('div', { style: { marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: s.color } },
                    'Ver →'
                  ),
                  !n.read && React.createElement('div', { style: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 999, background: s.color } })
                )
              )
            );
          })
    )
  );
}

// ── Notification Settings Sheet ──────────────────────────────────
function NotificationSettingsSheet({ prefs, onUpdatePrefs, onClose }) {
  const [local, setLocal] = React.useState({ ...prefs });

  function toggle(key) { setLocal(p => ({ ...p, [key]: !p[key] })); }

  const sections = [
    { key: 'mealReminders', icon: '⏰', title: 'Recordatorios de comidas', desc: 'Te avisa cuando no has registrado desayuno, almuerzo o cena.' },
    { key: 'goalAlerts', icon: '⚠️', title: 'Alertas de metas', desc: 'Avisa cuando te acercas o superas tu meta calórica diaria.' },
    { key: 'weeklyReports', icon: '📊', title: 'Reportes semanales', desc: 'Resumen de tu progreso cada lunes.' },
    { key: 'motivation', icon: '🎉', title: 'Motivación', desc: 'Mensajes de ánimo basados en tu progreso.' },
    { key: 'tips', icon: '💡', title: 'Consejos nutricionales', desc: 'Tips diarios para mejorar tu alimentación.' },
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
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', marginBottom: 4 } }, 'Configurar notificaciones'),
    React.createElement('div', { style: { fontSize: 13, color: 'var(--color-sub, #7A6652)', marginBottom: 16 } }, 'Elige qué notificaciones deseas recibir.'),

    // Master toggle
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '2px solid var(--border-color, #F5EFE4)', marginBottom: 8 }
    },
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 15, fontWeight: 700, color: 'var(--color-text, #1E1408)' } }, 'Notificaciones'),
        React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 2 } }, local.enabled ? 'Activadas' : 'Desactivadas')
      ),
      React.createElement(ToggleSwitch, { active: local.enabled, onToggle: () => toggle('enabled') })
    ),

    // Individual toggles
    local.enabled && sections.map(s =>
      React.createElement('div', {
        key: s.key,
        style: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)' }
      },
        React.createElement('div', { style: { fontSize: 20, width: 32, textAlign: 'center', flexShrink: 0 } }, s.icon),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, s.title),
          React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 2, lineHeight: 1.3 } }, s.desc)
        ),
        React.createElement(ToggleSwitch, { active: local[s.key], onToggle: () => toggle(s.key) })
      )
    ),

    // Info note
    React.createElement('div', { style: { marginTop: 16, padding: '10px 14px', background: '#DFF3FA', borderRadius: 12, fontSize: 12, color: '#3A7A9A', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 } },
      React.createElement('span', { style: { fontSize: 14, flexShrink: 0 } }, 'ℹ️'),
      'Las notificaciones push se activarán cuando se integre el servicio de mensajería. Por ahora, las notificaciones se muestran dentro de la app.'
    ),

    // Buttons
    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 16 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--color-sub, #7A6652)', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: () => onUpdatePrefs(local),
        style: { flex: 2, padding: '14px', background: '#F5D040', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#1E1408', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.3)' }
      }, 'Guardar preferencias')
    )
  );
}

Object.assign(window, { NotificationCenter, NotificationSettingsSheet, generateAppNotifications, DEFAULT_NOTIF_PREFS, NOTIF_STYLES });
