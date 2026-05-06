// AddMeal.jsx — Cart-style meal logging: add multiple foods, confirm all at once

function QuantitySheet({ food, onAdd, onClose }) {
  const isGrams = food.unit === 'g';
  const [qty, setQty] = React.useState(isGrams ? 100 : 1);

  const kcalPerUnit = food.kcalPerG || (food.kcal / 100);
  const displayKcal = isGrams
    ? Math.round(kcalPerUnit * qty)
    : Math.round(food.kcal * qty);
  const displayProtein = isGrams
    ? ((food.protein / (isGrams ? 100 : 1)) * qty).toFixed(1)
    : (food.protein * qty).toFixed(1);

  function handleInput(e) {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v > 0) setQty(v);
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
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 44, fontWeight: 900, color: '#F5D040', lineHeight: 1 } }, displayKcal),
      React.createElement('div', { style: { fontSize: 13, color: 'var(--color-sub, #7A6652)', marginTop: 4 } }, `kcal · ${displayProtein}g proteína`)
    ),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 20 } },
      React.createElement('button', {
        onClick: () => setQty(q => Math.max(isGrams ? 5 : 1, q - (isGrams ? 5 : 1))),
        style: { width: 44, height: 44, borderRadius: 999, border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-card, white)', fontSize: 22, cursor: 'pointer', fontWeight: 700, color: 'var(--color-text, #1E1408)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
      }, '−'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement('input', {
          type: 'number', value: qty, onChange: handleInput,
          style: { width: 72, textAlign: 'center', fontFamily: "'Nunito',sans-serif", fontSize: 26, fontWeight: 800, color: 'var(--color-text, #1E1408)', border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-input, white)', borderRadius: 12, padding: '8px 6px', outline: 'none' }
        }),
        React.createElement('span', { style: { fontSize: 14, color: 'var(--color-muted, #9A8878)', fontWeight: 500 } }, isGrams ? 'g' : 'u')
      ),
      React.createElement('button', {
        onClick: () => setQty(q => q + (isGrams ? 5 : 1)),
        style: { width: 44, height: 44, borderRadius: 999, background: '#F5D040', border: 'none', fontSize: 22, cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(245,208,64,0.35)' }
      }, '+'),
    ),
    React.createElement('button', {
      onClick: () => {
        const factor = isGrams ? qty / 100 : qty;
        onAdd({
          ...food,
          qtyLabel: `${qty}${isGrams ? 'g' : ' u'}`,
          totalKcal: displayKcal,
          totalProtein: parseFloat(displayProtein),
          totalFat: parseFloat((food.fat * factor).toFixed(1)),
          totalCarbs: parseFloat((food.carbs * factor).toFixed(1)),
          totalSugar: parseFloat((food.sugar * factor).toFixed(1)),
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
    React.createElement('div', {
      onClick: onView,
      style: { width: 40, height: 40, background: '#F5D040', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, position: 'relative' }
    },
      React.createElement('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#1E1408', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
        React.createElement('circle', { cx: 12, cy: 12, r: 7 }),
        React.createElement('path', { d: 'M4 12a8 8 0 0 1 8-8' }),
        React.createElement('line', { x1: 2, y1: 7, x2: 2, y2: 17 }),
        React.createElement('path', { d: 'M2 7 Q2 4 3.5 4 Q5 4 5 7 L5 11 Q3.5 12 2 11 Z' }),
        React.createElement('line', { x1: 22, y1: 4, x2: 22, y2: 17 }),
        React.createElement('path', { d: 'M19 4 Q22 6 22 9' })
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
    }, 'Confirmar')
  );
}

function CartSheet({ items, onRemove, onClose, onConfirm, mealName }) {
  const totalKcal    = items.reduce((s, i) => s + i.totalKcal, 0);
  const totalProtein = items.reduce((s, i) => s + (i.totalProtein || 0), 0);

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', maxHeight: '75%', overflowY: 'auto', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 0' } }),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 12px' } },
      React.createElement('div', null,
        mealName && React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', fontWeight: 500, marginBottom: 2 } }, 'Comida'),
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 17, fontWeight: 800, color: 'var(--color-text, #1E1408)' } }, mealName || 'Tu registro'),
      ),
      React.createElement('div', { onClick: onClose, style: { cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #7A6652)' } }, 'Cerrar')
    ),
    items.map((item, i) =>
      React.createElement('div', {
        key: i,
        style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-color, #F5EFE4)' }
      },
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, item.name),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 1 } }, item.qtyLabel)
        ),
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 15, fontWeight: 800, color: '#F5D040', marginRight: 8 } }, `${item.totalKcal} kcal`),
        React.createElement('div', {
          onClick: () => onRemove(i),
          style: { width: 28, height: 28, borderRadius: 999, background: '#FFE0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
        },
          React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: '#FF6B6B', strokeWidth: 2.5, strokeLinecap: 'round' },
            React.createElement('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
            React.createElement('line', { x1: 6, y1: 6, x2: 18, y2: 18 })
          )
        )
      )
    ),
    React.createElement('div', { style: { background: '#FFF3C4', borderRadius: 12, padding: '10px 14px', margin: '14px 0', display: 'flex', justifyContent: 'space-between' } },
      React.createElement('span', { style: { fontSize: 14, fontWeight: 600, color: '#7A5800' } }, 'Total'),
      React.createElement('span', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 16, fontWeight: 900, color: '#9A6D00' } }, `${totalKcal} kcal · ${totalProtein.toFixed(0)}g prot.`)
    ),
    React.createElement('button', {
      onClick: onConfirm,
      style: { width: '100%', background: '#F5D040', border: 'none', borderRadius: 999, padding: '15px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, color: '#1E1408', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.3)' }
    }, `Registrar ${items.length} alimento${items.length !== 1 ? 's' : ''}`)
  );
}

function AddMeal({ onBack, onAddMeal, mealName: initialName = '', foodLibrary }) {
  const [query, setQuery]         = React.useState('');
  const [mealName, setMealName]   = React.useState(initialName);
  const [cart, setCart]           = React.useState([]);
  const [selecting, setSelecting] = React.useState(null);
  const [viewCart, setViewCart]   = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);

  // foodLibrary already includes both custom + DB foods (merged in index.html)
  const allFoods = foodLibrary || [];
  const filtered = allFoods.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));

  function addToCart(item) {
    setCart(c => [...c, item]);
    setSelecting(null);
  }

  function removeFromCart(idx) {
    setCart(c => c.filter((_, i) => i !== idx));
  }

  function confirmAll() {
    setViewCart(false);
    const meal = {
      id: Date.now(),
      name: mealName || 'Comida',
      foods: cart,
      totalKcal:    cart.reduce((s, i) => s + i.totalKcal, 0),
      totalProtein: cart.reduce((s, i) => s + (i.totalProtein || 0), 0),
      totalFat:     cart.reduce((s, i) => s + (i.totalFat || 0), 0),
      totalCarbs:   cart.reduce((s, i) => s + (i.totalCarbs || 0), 0),
      totalSugar:   cart.reduce((s, i) => s + (i.totalSugar || 0), 0),
      date: new Date().toDateString(),
      time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
    };
    if (onAddMeal) onAddMeal(meal);
    setConfirmed(true);
  }

  const cartIds = new Set(cart.map(c => c.id));

  if (confirmed) {
    const totalKcal = cart.reduce((s, i) => s + i.totalKcal, 0);
    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 24, background: 'var(--bg-main, #FEFAF3)' } },
      React.createElement('div', { style: { width: 72, height: 72, background: '#D8F5DB', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
        React.createElement('svg', { width: 36, height: 36, viewBox: '0 0 24 24', fill: 'none', stroke: '#6BCB77', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '20 6 9 17 4 12' })
        )
      ),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--color-text, #1E1408)', textAlign: 'center' } }, mealName ? `¡${mealName} registrado!` : '¡Comida registrada!'),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 32, fontWeight: 900, color: '#F5D040' } }, `${totalKcal} kcal`),
      React.createElement('div', { style: { fontSize: 14, color: 'var(--color-sub, #7A6652)', textAlign: 'center' } }, `${cart.length} alimentos agregados${mealName ? ` a ${mealName}` : ' a tu diario'}.`),
      React.createElement('button', {
        onClick: onBack,
        style: { marginTop: 8, background: '#F5D040', border: 'none', borderRadius: 999, padding: '14px 32px', fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.3)' }
      }, 'Volver al inicio')
    );
  }

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: 'var(--bg-main, #FEFAF3)' } },
    React.createElement('div', { style: { padding: '12px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 } },
      React.createElement('div', { onClick: onBack, style: { cursor: 'pointer', padding: 4 } },
        React.createElement(Icon, { name: 'back' })
      ),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--color-text, #1E1408)', flex: 1 } }, 'Agregar comida'),
    ),
    React.createElement('div', { style: { padding: '0 20px 10px' } },
      React.createElement('div', { style: { marginBottom: 10 } },
        React.createElement('div', { style: { fontSize: 12, fontWeight: 600, color: 'var(--color-muted, #9A8878)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' } }, 'Nombre de la comida'),
        React.createElement('input', {
          value: mealName,
          onChange: e => setMealName(e.target.value),
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
            border: cartIds.has(food.id) ? '1.5px solid #F5D040' : '1.5px solid transparent',
          }
        },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, food.name),
            React.createElement('div', { style: { fontSize: 11, color: 'var(--color-muted, #9A8878)', marginTop: 2 } },
              `${food.portion || (food.unit === 'u' ? '1 unidad' : '100g')} · ${food.unit === 'u' ? food.kcal : Math.round((food.kcalPerG || food.kcal / 100) * 100)} kcal`
            )
          ),
          cartIds.has(food.id)
            ? React.createElement('div', { style: { width: 30, height: 30, borderRadius: 999, background: '#D8F5DB', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: '#6BCB77', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
                  React.createElement('polyline', { points: '20 6 9 17 4 12' })
                )
              )
            : React.createElement('div', {
                onClick: () => setSelecting(food),
                style: { width: 30, height: 30, borderRadius: 999, background: '#F5D040', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 6px rgba(245,208,64,0.35)', flexShrink: 0 }
              },
                React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#1E1408', strokeWidth: 2.5, strokeLinecap: 'round' },
                  React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
                  React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
                )
              )
        )
      ),
      filtered.length === 0 && React.createElement('div', { style: { textAlign: 'center', padding: '32px 16px', color: 'var(--color-muted, #9A8878)' } },
        React.createElement('div', { style: { fontSize: 32, marginBottom: 8 } }, '🔍'),
        React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, 'No encontramos ese alimento'),
        React.createElement('div', { style: { fontSize: 12, marginTop: 4 } }, 'Puedes agregarlo en "Alimentos" desde el menú inferior')
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
      onRemove: removeFromCart,
      onClose: () => setViewCart(false),
      onConfirm: confirmAll,
    })
  );
}

Object.assign(window, { AddMeal });
