// AddMeal.jsx — Cart-style meal logging: add multiple foods, confirm all at once.
// Also supports edit mode: when an editingMealId is provided, the cart and meal name
// are pre-populated and confirming replaces the existing meal instead of inserting.

// Coerce a macro value to a finite number; missing/NaN fields fall through as 0
// so a single corrupt food can't poison the meal totals shown in Dashboard.
function _num(v) { const n = parseFloat(v); return isFinite(n) ? n : 0; }

function _scaleMacros(food, qty) {
  const isGrams = food.unit === 'g';
  // For gram-based foods, food.protein/etc are per-100g values (set by toAddMealFormat
  // in index.html). For unit-based foods, they are per-unit values.
  const factor = isGrams ? qty / 100 : qty;
  const perUnitKcal = isGrams
    ? (food.kcalPerG != null ? _num(food.kcalPerG) : _num(food.kcal) / 100)
    : _num(food.kcal);
  return {
    totalKcal:    Math.round(perUnitKcal * qty),
    totalProtein: parseFloat((_num(food.protein) * factor).toFixed(1)),
    totalFat:     parseFloat((_num(food.fat)     * factor).toFixed(1)),
    totalCarbs:   parseFloat((_num(food.carbs)   * factor).toFixed(1)),
    totalSugar:   parseFloat((_num(food.sugar)   * factor).toFixed(1)),
  };
}

function QuantitySheet({ food, onAdd, onClose }) {
  const isGrams = food.unit === 'g';
  const [qty, setQty] = React.useState(isGrams ? 100 : 1);

  const macros = _scaleMacros(food, qty);

  function handleInput(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v > 0 && v <= 5000) setQty(v);
  }

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 17, fontWeight: 800, color: 'var(--color-text, #1E1408)', marginBottom: 2 } }, food.name),
    React.createElement('div', { style: { fontSize: 13, color: 'var(--color-sub, #7A6652)', marginBottom: 20 } }, isGrams ? 'Ingresa la cantidad en gramos' : 'Ingresa la cantidad en unidades'),
    React.createElement('div', { style: { textAlign: 'center', marginBottom: 8 } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 44, fontWeight: 900, color: '#F5D040', lineHeight: 1 } }, macros.totalKcal),
      React.createElement('div', { style: { fontSize: 13, color: 'var(--color-sub, #7A6652)', marginTop: 4 } }, `kcal · ${macros.totalProtein}g proteína · ${macros.totalCarbs}g carbos · ${macros.totalFat}g grasa`)
    ),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 20 } },
      React.createElement('button', {
        onClick: () => setQty(q => Math.max(isGrams ? 5 : 1, q - (isGrams ? 5 : 1))),
        style: { width: 44, height: 44, borderRadius: 999, border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-card, white)', fontSize: 22, cursor: 'pointer', fontWeight: 700, color: 'var(--color-text, #1E1408)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
      }, '−'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement('input', {
          type: 'number', value: qty, onChange: handleInput,
          min: isGrams ? 1 : 1, max: 5000,
          style: { width: 72, textAlign: 'center', fontFamily: "'Nunito',sans-serif", fontSize: 26, fontWeight: 800, color: 'var(--color-text, #1E1408)', border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-input, white)', borderRadius: 12, padding: '8px 6px', outline: 'none' }
        }),
        React.createElement('span', { style: { fontSize: 14, color: 'var(--color-muted, #9A8878)', fontWeight: 500 } }, isGrams ? 'g' : 'u')
      ),
      React.createElement('button', {
        onClick: () => setQty(q => Math.min(5000, q + (isGrams ? 5 : 1))),
        style: { width: 44, height: 44, borderRadius: 999, background: '#F5D040', border: 'none', fontSize: 22, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(245,208,64,0.35)' }
      }, '+'),
    ),
    React.createElement('button', {
      onClick: () => {
        onAdd({
          ...food,
          qtyLabel: `${qty}${isGrams ? 'g' : ' u'}`,
          ...macros,
          qty,
        });
      },
      style: { width: '100%', background: '#F5D040', border: 'none', borderRadius: 999, padding: '15px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, color: '#1E1408', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.3)' }
    }, '+ Añadir al registro')
  );
}

function CartBar({ items, onConfirm, onView }) {
  const totalKcal = items.reduce((s, i) => s + i.totalKcal, 0);
  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: '#1E1408', padding: '14px 20px 24px',
      display: 'flex', alignItems: 'center', gap: 12,
    }
  },
    React.createElement('button', {
      onClick: onView,
      'aria-label': `Ver carrito, ${items.length} alimento${items.length !== 1 ? 's' : ''}`,
      type: 'button',
      style: { width: 44, height: 44, background: '#F5D040', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, position: 'relative', border: 'none', padding: 0 }
    },
      React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#1E1408', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('circle', { cx: 9, cy: 21, r: 1 }),
        React.createElement('circle', { cx: 20, cy: 21, r: 1 }),
        React.createElement('path', { d: 'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' })
      ),
      React.createElement('div', { style: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, background: '#FF8C69', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
        React.createElement('span', { style: { fontSize: 10, fontWeight: 800, color: 'white' } }, items.length)
      )
    ),
    React.createElement('div', { style: { flex: 1 } },
      React.createElement('div', { style: { fontSize: 12, color: '#B8A898' } }, `${items.length} alimento${items.length !== 1 ? 's' : ''} agregado${items.length !== 1 ? 's' : ''}`),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#F5D040' } }, `${totalKcal} kcal`)
    ),
    React.createElement('button', {
      onClick: onConfirm,
      style: { background: '#F5D040', border: 'none', borderRadius: 999, padding: '11px 20px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: '#1E1408', cursor: 'pointer' }
    }, 'Revisar')
  );
}

function CartSheet({ items, onRemove, onClose, onConfirm, mealName, isEditing }) {
  const totalKcal    = items.reduce((s, i) => s + i.totalKcal, 0);
  const totalProtein = items.reduce((s, i) => s + (i.totalProtein || 0), 0);
  const totalFat     = items.reduce((s, i) => s + (i.totalFat     || 0), 0);
  const totalCarbs   = items.reduce((s, i) => s + (i.totalCarbs   || 0), 0);

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '78%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 0' } }),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 12px' } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', fontWeight: 500, marginBottom: 2 } }, isEditing ? 'Editando comida' : 'Comida'),
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 17, fontWeight: 800, color: 'var(--color-text, #1E1408)' } }, mealName || 'Tu registro'),
      ),
      React.createElement('button', {
        onClick: onClose,
        'aria-label': 'Cerrar carrito',
        type: 'button',
        style: { cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #7A6652)', background: 'transparent', border: 'none', padding: '8px 12px', minHeight: 44, font: 'inherit' }
      }, 'Cerrar')
    ),
    items.length === 0
      ? React.createElement('div', { style: { textAlign: 'center', padding: '24px 0', color: 'var(--color-muted, #9A8878)', fontSize: 13 } }, 'No hay alimentos en tu registro.')
      : items.map((item, i) =>
          React.createElement('div', {
            key: i,
            style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)' }
          },
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, item.name),
              React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 1 } }, item.qtyLabel)
            ),
            React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 800, color: '#F5D040', marginRight: 8 } }, `${item.totalKcal} kcal`),
            React.createElement('button', {
              onClick: () => onRemove(i),
              'aria-label': `Quitar ${item.name} del carrito`,
              type: 'button',
              style: { width: 44, height: 44, borderRadius: 999, background: 'var(--accent-danger-soft, #FFE0E0)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', padding: 0, flexShrink: 0 }
            },
              React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--accent-danger, #FF6B6B)', strokeWidth: 2.5, strokeLinecap: 'round' },
                React.createElement('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
                React.createElement('line', { x1: 6, y1: 6, x2: 18, y2: 18 })
              )
            )
          )
        ),
    items.length > 0 && React.createElement('div', { style: { background: 'var(--accent-gold-soft, #FFF3C4)', borderRadius: 12, padding: '12px 14px', margin: '14px 0' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 } },
        React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: 'var(--accent-gold-text, #5C4200)' } }, 'Total'),
        React.createElement('span', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 900, color: 'var(--accent-gold-text, #9A6D00)' } }, `${totalKcal} kcal`)
      ),
      React.createElement('div', { style: { display: 'flex', gap: 10, fontSize: 11, color: 'var(--accent-gold-text, #5C4200)', fontWeight: 600 } },
        React.createElement('span', null, `Prot. ${totalProtein.toFixed(0)}g`),
        React.createElement('span', null, `Carb. ${totalCarbs.toFixed(0)}g`),
        React.createElement('span', null, `Grasa ${totalFat.toFixed(0)}g`),
      )
    ),
    React.createElement('button', {
      onClick: onConfirm,
      disabled: items.length === 0,
      style: { width: '100%', background: items.length > 0 ? '#F5D040' : '#EAE0D0', border: 'none', borderRadius: 999, padding: '15px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, color: items.length > 0 ? '#1E1408' : '#B8A898', cursor: items.length > 0 ? 'pointer' : 'not-allowed', boxShadow: items.length > 0 ? '0 2px 8px rgba(245,208,64,0.3)' : 'none' }
    }, isEditing ? 'Guardar cambios' : `Registrar ${items.length} alimento${items.length !== 1 ? 's' : ''}`)
  );
}

function AddMeal({ onBack, onAddMeal, onUpdateMeal, onGoToLibrary, mealName: initialName = '', foodLibrary, initialCart = [], editingMealId = null }) {
  const isEditing = !!editingMealId;
  const [query, setQuery]         = React.useState('');
  const [mealName, setMealName]   = React.useState(initialName);
  const [cart, setCart]           = React.useState(initialCart);
  const [selecting, setSelecting] = React.useState(null);
  const [viewCart, setViewCart]   = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);

  // foodLibrary already includes both custom + DB foods (merged in index.html)
  const allFoods = foodLibrary || [];
  // Accent-insensitive search: typing "platano" matches "Plátano". Without
  // this, Spanish-speaking users would have to type the diacritic to find
  // common foods.
  const _norm = (typeof normalizeText === 'function') ? normalizeText : (s => (s || '').toLowerCase());
  const queryN = _norm(query);
  const filtered = queryN
    ? allFoods.filter(f => _norm(f.name).includes(queryN))
    : allFoods;

  function addToCart(item) {
    setCart(c => [...c, item]);
    setSelecting(null);
  }

  function removeFromCart(idx) {
    setCart(c => c.filter((_, i) => i !== idx));
  }

  function confirmAll() {
    if (cart.length === 0) return;
    setViewCart(false);
    const finalName = mealName.trim() || (typeof defaultMealNameForHour === 'function' ? defaultMealNameForHour(new Date().getHours()) : 'Comida');
    const totals = {
      totalKcal:    cart.reduce((s, i) => s + (i.totalKcal    || 0), 0),
      totalProtein: cart.reduce((s, i) => s + (i.totalProtein || 0), 0),
      totalFat:     cart.reduce((s, i) => s + (i.totalFat     || 0), 0),
      totalCarbs:   cart.reduce((s, i) => s + (i.totalCarbs   || 0), 0),
      totalSugar:   cart.reduce((s, i) => s + (i.totalSugar   || 0), 0),
    };
    if (isEditing && onUpdateMeal) {
      // Don't send date/time on edits — handleUpdateMeal in index.html keeps the
      // original entry's date so editing yesterday's meal doesn't move it to today.
      onUpdateMeal({
        id: editingMealId,
        name: finalName,
        foods: cart,
        ...totals,
      });
    } else if (onAddMeal) {
      const now = new Date();
      onAddMeal({
        id: Date.now(),
        name: finalName,
        foods: cart,
        ...totals,
        date: (typeof localDateKey === 'function' ? localDateKey(now) : now.toDateString()),
        time: now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
      });
    }
    setConfirmed(true);
  }

  // Count how many times each food id appears in cart (allows adding same food multiple times)
  const cartCounts = cart.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {});

  if (confirmed) {
    const totalKcal    = cart.reduce((s, i) => s + (i.totalKcal    || 0), 0);
    const totalProtein = cart.reduce((s, i) => s + (i.totalProtein || 0), 0);
    const totalFat     = cart.reduce((s, i) => s + (i.totalFat     || 0), 0);
    const totalCarbs   = cart.reduce((s, i) => s + (i.totalCarbs   || 0), 0);

    const headlineName = (mealName && mealName.trim())
      ? mealName.trim()
      : (typeof defaultMealNameForHour === 'function' ? defaultMealNameForHour(new Date().getHours()) : 'Comida');
    const headline = isEditing
      ? `¡${headlineName} actualizada!`
      : `¡${headlineName} registrada!`;

    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, padding: 24, background: 'var(--bg-main, #FEFAF3)' } },
      React.createElement('div', { style: { width: 72, height: 72, background: 'var(--accent-success-soft, #D8F5DB)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
        React.createElement('svg', { width: 36, height: 36, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--accent-success, #6BCB77)', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '20 6 9 17 4 12' })
        )
      ),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--color-text, #1E1408)', textAlign: 'center' } }, headline),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 32, fontWeight: 900, color: '#F5D040' } }, `${totalKcal} kcal`),
      // Macro breakdown so the user can verify the values before leaving the screen.
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, width: '100%', maxWidth: 320 } },
        [
          { label: 'Proteína', val: totalProtein, color: 'var(--accent-protein, #7EC8E3)', bg: 'var(--accent-protein-soft, #DFF3FA)' },
          { label: 'Carbos',   val: totalCarbs,   color: 'var(--accent-carbs, #FF8C69)',   bg: 'var(--accent-carbs-soft, #FFE4DB)' },
          { label: 'Grasa',    val: totalFat,     color: 'var(--accent-fat, #C5A3FF)',     bg: 'var(--accent-fat-soft, #EFE4FF)' },
        ].map(m =>
          React.createElement('div', { key: m.label, style: { background: m.bg, borderRadius: 12, padding: '10px 8px', textAlign: 'center' } },
            React.createElement('div', { style: { fontSize: 10, fontWeight: 600, color: m.color, textTransform: 'uppercase', letterSpacing: '0.05em' } }, m.label),
            React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--color-text, #1E1408)', marginTop: 2 } }, `${m.val.toFixed(0)}g`)
          )
        )
      ),
      React.createElement('div', { style: { fontSize: 13, color: 'var(--color-sub, #7A6652)', textAlign: 'center' } }, `${cart.length} alimento${cart.length !== 1 ? 's' : ''} ${isEditing ? 'guardado' + (cart.length !== 1 ? 's' : '') : 'agregado' + (cart.length !== 1 ? 's' : '')}.`),
      React.createElement('button', {
        onClick: onBack,
        style: { marginTop: 4, background: '#F5D040', border: 'none', borderRadius: 999, padding: '14px 32px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.3)' }
      }, 'Volver al inicio')
    );
  }

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: 'var(--bg-main, #FEFAF3)' } },
    React.createElement('div', { style: { padding: '8px 12px 8px', display: 'flex', alignItems: 'center', gap: 8 } },
      React.createElement(IconButton, { onClick: onBack, ariaLabel: 'Volver' },
        React.createElement(Icon, { name: 'back' })
      ),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--color-text, #1E1408)', flex: 1 } }, isEditing ? 'Editar comida' : 'Agregar comida'),
    ),
    React.createElement('div', { style: { padding: '0 20px 10px' } },
      React.createElement('div', { style: { marginBottom: 10 } },
        React.createElement('div', { style: { fontSize: 12, fontWeight: 600, color: 'var(--color-muted, #9A8878)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' } }, 'Nombre de la comida'),
        React.createElement('input', {
          value: mealName,
          onChange: e => setMealName(e.target.value.slice(0, 40)),
          placeholder: 'Ej. Desayuno, Almuerzo, Cena...',
          style: {
            width: '100%', padding: '11px 14px', borderRadius: 12,
            border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-input, white)',
            fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600,
            color: 'var(--color-text, #1E1408)', outline: 'none',
          }
        })
      ),
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('div', { style: { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' } },
          React.createElement(Icon, { name: 'search' })
        ),
        React.createElement('input', {
          value: query, onChange: e => setQuery(e.target.value),
          placeholder: 'Buscar alimento...',
          style: { width: '100%', padding: '12px 16px 12px 40px', borderRadius: 14, border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-input, white)', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--color-text, #1E1408)', outline: 'none' }
        })
      )
    ),
    React.createElement('div', { style: { padding: '0 20px 8px' } },
      React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: 'var(--color-muted, #9A8878)', textTransform: 'uppercase', letterSpacing: '0.07em' } }, `${filtered.length} alimentos · toca + para agregar`)
    ),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 20px', paddingBottom: cart.length > 0 ? 90 : 16 } },
      filtered.map(food =>
        React.createElement('div', {
          key: food.id,
          style: {
            background: 'var(--bg-card, white)', borderRadius: 14, padding: '11px 12px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 1px 8px rgba(30,20,8,0.06)', marginBottom: 8,
            border: cartCounts[food.id] ? '1.5px solid #F5D040' : '1.5px solid transparent',
          }
        },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, food.name),
            React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 2 } },
              `${food.portion || (food.unit === 'u' ? '1 unidad' : '100g')} · ${food.unit === 'u' ? food.kcal : Math.round((food.kcalPerG || food.kcal / 100) * 100)} kcal`
            )
          ),
          React.createElement('button', {
            onClick: () => setSelecting(food),
            'aria-label': `Agregar ${food.name}`,
            type: 'button',
            style: { width: 44, height: 44, borderRadius: 999, background: cartCounts[food.id] ? 'var(--accent-success-soft, #D8F5DB)' : '#F5D040', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 6px rgba(245,208,64,0.35)', flexShrink: 0, border: 'none', padding: 0 }
          },
            cartCounts[food.id]
              ? React.createElement('span', { style: { fontSize: 13, fontWeight: 800, color: 'var(--accent-success-text, #2A7D3A)' } }, cartCounts[food.id] > 9 ? '9+' : String(cartCounts[food.id]))
              : React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: '#1E1408', strokeWidth: 2.5, strokeLinecap: 'round' },
                  React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
                  React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
                )
          )
        )
      ),
      filtered.length === 0 && React.createElement('div', { style: { textAlign: 'center', padding: '32px 16px', color: 'var(--color-muted, #9A8878)' } },
        React.createElement('div', { style: { fontSize: 32, marginBottom: 8 } }, '🔍'),
        React.createElement('div', { style: { fontSize: 14, fontWeight: 500, color: 'var(--color-text, #1E1408)' } }, 'No encontramos ese alimento'),
        React.createElement('div', { style: { fontSize: 12, marginTop: 4 } }, '¿No está en la lista? Agrégalo a tu biblioteca.'),
        onGoToLibrary && React.createElement('button', {
          onClick: () => onGoToLibrary(cart),
          style: { marginTop: 14, background: '#F5D040', border: 'none', borderRadius: 999, padding: '11px 22px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: '#1E1408', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.3)' }
        }, '+ Ir a Alimentos')
      )
    ),
    selecting && React.createElement('div', {
      onClick: () => setSelecting(null),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 50 }
    }),
    selecting && React.createElement(QuantitySheet, {
      food: selecting,
      onAdd: addToCart,
      onClose: () => setSelecting(null),
    }),
    cart.length > 0 && !selecting && !viewCart && React.createElement(CartBar, {
      items: cart,
      onView: () => setViewCart(true),
      onConfirm: () => setViewCart(true),
    }),
    viewCart && React.createElement('div', {
      onClick: () => setViewCart(false),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 50 }
    }),
    viewCart && React.createElement(CartSheet, {
      items: cart,
      mealName,
      isEditing,
      onRemove: removeFromCart,
      onClose: () => setViewCart(false),
      onConfirm: confirmAll,
    })
  );
}

Object.assign(window, { AddMeal });
