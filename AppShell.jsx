// AppShell.jsx — Layout shell, status bar, bottom navigation

const _isMobile = () => window.innerWidth <= 600;

const ICONS = {
  home: (active) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="${active ? '#F5C030' : 'none'}" stroke="${active ? '#F5C030' : '#B8A898'}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  chart: (active) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${active ? '#F5C030' : '#B8A898'}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  user: (active) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${active ? '#F5C030' : '#B8A898'}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  plus: () => `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1E1408" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  flame: () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="#F5C030" stroke="none"><path d="M12 2c0 0-5 5-5 11a5 5 0 0 0 10 0c0-3-1.5-5.5-2-7-1 2-2 3-3 3 1-3 0-7 0-7z"/></svg>`,
  back: () => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text, #1E1408)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  search: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted, #9A8878)" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  check: () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  chevronRight: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8A898" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  list: (active) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${active ? '#F5C030' : '#B8A898'}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>`,
  scan: () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-sub, #7A6652)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>`,
  settings: () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-sub, #7A6652)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
};

function Icon({ name, active = false }) {
  const fn = ICONS[name];
  if (!fn) return null;
  return React.createElement('span', {
    dangerouslySetInnerHTML: { __html: fn(active) },
    style: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
  });
}

// IconButton — accessible 44×44 tap target. Use this for any clickable icon
// (back arrow, bell, gear, close X). Renders a real <button> so it's keyboard
// focusable and announced as a control by screen readers, while staying
// visually identical to the previous div-with-onClick (transparent background,
// no border). Pass `ariaLabel` always — icons need a textual label.
function IconButton({ onClick, ariaLabel, children, size = 44, style = {}, disabled = false }) {
  return React.createElement('button', {
    onClick,
    'aria-label': ariaLabel,
    type: 'button',
    disabled,
    style: {
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'transparent', border: 'none', padding: 0, margin: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: 'inherit', font: 'inherit',
      borderRadius: 999,
      ...style,
    }
  }, children);
}

function _fmtTime(d) { return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); }

function StatusBar() {
  const [time, setTime] = React.useState(() => _fmtTime(new Date()));
  React.useEffect(() => {
    // Sync to the start of the next minute so the clock is always accurate
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId;
    const timeoutId = setTimeout(() => {
      setTime(_fmtTime(new Date()));
      intervalId = setInterval(() => setTime(_fmtTime(new Date())), 60000);
    }, msUntilNextMinute);
    return () => { clearTimeout(timeoutId); clearInterval(intervalId); };
  }, []);
  return React.createElement('div', {
    style: {
      height: 44, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px',
      background: 'var(--bg-main, #FEFAF3)', flexShrink: 0,
    }
  },
    React.createElement('span', { style: { fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--color-text, #1E1408)' } }, time),
    React.createElement('div', { style: { display: 'flex', gap: 6, alignItems: 'center' } },
      React.createElement('span', { style: { fontSize: 13, color: 'var(--color-text, #1E1408)' } }, '●●●●'),
      React.createElement('span', { style: { fontSize: 13, color: 'var(--color-text, #1E1408)' } }, '▲'),
      React.createElement('span', { style: { fontWeight: 700, fontSize: 13, color: 'var(--color-text, #1E1408)' } }, '100%'),
    )
  );
}

function StatusBarSpacer() {
  if (!_isMobile()) return null;
  return React.createElement('div', {
    style: { height: 'env(safe-area-inset-top, 0px)', background: 'var(--bg-main, #FEFAF3)', flexShrink: 0 }
  });
}

function BottomNav({ screen, onNavigate }) {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: 'home' },
    { id: 'progress',  label: 'Progreso', icon: 'chart' },
    { id: 'add',       label: 'Agregar Comida', icon: 'plus', fab: true },
    { id: 'library',   label: 'Alimentos', icon: 'list' },
    { id: 'profile',   label: 'Perfil', icon: 'user' },
  ];

  return React.createElement('div', {
    style: {
      background: 'var(--bg-card, white)', boxShadow: '0 -1px 0 rgba(30,20,8,0.06)',
      display: 'flex', padding: _isMobile() ? '8px 0 calc(8px + env(safe-area-inset-bottom, 12px))' : '8px 0 20px', flexShrink: 0,
      overflow: 'visible', position: 'relative', zIndex: 10,
    }
  },
    tabs.map(tab =>
      React.createElement('button', {
        key: tab.id,
        onClick: () => onNavigate(tab.id === 'add' ? 'add' : tab.id),
        'aria-label': tab.label,
        'aria-current': screen === tab.id ? 'page' : undefined,
        type: 'button',
        style: {
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end',
          gap: 4, cursor: 'pointer', padding: '4px 0',
          userSelect: 'none',
          background: 'transparent', border: 'none',
          color: 'inherit', font: 'inherit',
          minHeight: 48,
        }
      },
        tab.fab
          ? React.createElement('div', {
              style: {
                width: 52, height: 52, background: '#F5C030', borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(245,192,48,0.4)', marginTop: -20,
              }
            }, React.createElement(Icon, { name: 'plus' }))
          : React.createElement(Icon, { name: tab.icon, active: screen === tab.id }),
        React.createElement('span', {
          style: {
            fontSize: 11, fontWeight: screen === tab.id ? 600 : 500,
            color: screen === tab.id ? '#F5C030' : '#B8A898',
            textAlign: 'center', display: 'block',
            width: tab.fab ? 64 : undefined,
            lineHeight: 1.2,
            ...(tab.fab ? { marginTop: 4 } : {})
          }
        }, tab.label)
      )
    )
  );
}

function AppShell({ screen, onNavigate, children }) {
  const mobile = _isMobile();
  return React.createElement('div', {
    className: 'phone-shell',
    style: {
      width: mobile ? '100%' : 390,
      height: mobile ? '100dvh' : 844,
      maxHeight: mobile ? '100dvh' : 'none',
      background: 'var(--bg-main, #FEFAF3)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: mobile ? 'fixed' : 'relative',
      top: mobile ? 0 : 'auto',
      left: mobile ? 0 : 'auto',
      right: mobile ? 0 : 'auto',
      bottom: mobile ? 0 : 'auto',
      borderRadius: mobile ? 0 : 40,
      boxShadow: mobile ? 'none' : '0 24px 80px rgba(30,20,8,0.18)',
    }
  },
    React.createElement(StatusBarSpacer),
    !mobile && React.createElement(StatusBar),
    React.createElement('div', {
      style: { flex: 1, overflowY: 'auto', overflowX: 'hidden' }
    }, children),
    React.createElement(BottomNav, { screen, onNavigate })
  );
}

Object.assign(window, { AppShell, BottomNav, StatusBar, StatusBarSpacer, Icon, IconButton, ICONS, _isMobile });
