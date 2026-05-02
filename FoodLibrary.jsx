// FoodLibrary.jsx — Personal food library with manual entry + AI fill

const MACRO_FIELDS = [
  { key: 'kcal',    label: 'Calorías', suffix: 'kcal', color: '#F5D040' },
  { key: 'protein', label: 'Proteína', suffix: 'g',    color: '#7EC8E3' },
  { key: 'fat',     label: 'Grasa',    suffix: 'g',    color: '#C5A3FF' },
  { key: 'carbs',   label: 'Carbos',   suffix: 'g',    color: '#FF8C69' },
  { key: 'sugar',   label: 'Azúcar',   suffix: 'g',    color: '#FFB3C6' },
];

// ── Base de datos nutricional para autocompletar ──────────────────
// Valores por 1g (unit:'g') o por 1 unidad (unit:'u')
const NUTRITION_DB = [
  // Proteínas
  { n:['pechuga de pollo','pollo','chicken','pechuga'], k:1.65, p:0.31, f:0.036, c:0, s:0, u:'g' },
  { n:['carne molida','carne de res','carne','res','beef'], k:1.76, p:0.26, f:0.085, c:0, s:0, u:'g' },
  { n:['atún','atun','atún en lata','tuna'], k:1.16, p:0.26, f:0.01, c:0, s:0, u:'g' },
  { n:['salmón','salmon'], k:2.08, p:0.20, f:0.13, c:0, s:0, u:'g' },
  { n:['huevo','huevo entero','egg'], k:72, p:6, f:5, c:0.4, s:0.2, u:'u' },
  { n:['clara de huevo','clara','egg white'], k:17, p:3.6, f:0.06, c:0.24, s:0.24, u:'u' },
  { n:['camarón','camaron','camarones','shrimp'], k:0.99, p:0.24, f:0.003, c:0.002, s:0, u:'g' },
  { n:['cerdo','lomo de cerdo','chuleta de cerdo','pork'], k:1.43, p:0.27, f:0.033, c:0, s:0, u:'g' },
  { n:['pavo','pechuga de pavo','turkey'], k:1.04, p:0.17, f:0.036, c:0.044, s:0.034, u:'g' },
  { n:['tofu'], k:0.76, p:0.08, f:0.048, c:0.019, s:0.006, u:'g' },
  // Lácteos
  { n:['leche','leche entera','milk'], k:0.596, p:0.032, f:0.032, c:0.048, s:0.048, u:'g' },
  { n:['leche descremada','leche light','skim milk'], k:0.34, p:0.034, f:0.001, c:0.050, s:0.050, u:'g' },
  { n:['yogur','yogurt','yogur natural'], k:0.61, p:0.035, f:0.033, c:0.047, s:0.047, u:'g' },
  { n:['yogur griego','yogurt griego','greek yogurt'], k:0.588, p:0.1, f:0.004, c:0.035, s:0.029, u:'g' },
  { n:['queso','queso cheddar','queso amarillo','cheese'], k:4.03, p:0.249, f:0.331, c:0.013, s:0.005, u:'g' },
  { n:['queso cottage','requesón','requeson','cottage'], k:0.98, p:0.112, f:0.043, c:0.034, s:0.029, u:'g' },
  { n:['queso crema','cream cheese'], k:3.42, p:0.060, f:0.342, c:0.040, s:0.037, u:'g' },
  // Carbohidratos
  { n:['arroz','arroz blanco','white rice'], k:1.3, p:0.027, f:0.003, c:0.28, s:0, u:'g' },
  { n:['arroz integral','brown rice'], k:1.108, p:0.026, f:0.009, c:0.231, s:0, u:'g' },
  { n:['avena','avena en hojuelas','oats'], k:3.89, p:0.169, f:0.069, c:0.661, s:0.010, u:'g' },
  { n:['avena con leche','avena preparada'], k:1.28, p:0.048, f:0.024, c:0.216, s:0.032, u:'g' },
  { n:['pan','pan blanco','bread'], k:2.65, p:0.090, f:0.032, c:0.491, s:0.050, u:'g' },
  { n:['pan integral','whole wheat bread'], k:2.857, p:0.143, f:0.036, c:0.536, s:0.071, u:'g' },
  { n:['pasta','espagueti','spaghetti','fideos','noodles'], k:1.31, p:0.050, f:0.011, c:0.252, s:0.006, u:'g' },
  { n:['tortilla','tortilla de maíz','tortilla de maiz'], k:2.18, p:0.057, f:0.027, c:0.449, s:0.006, u:'g' },
  { n:['tortilla de harina','tortilla de trigo','flour tortilla'], k:3.12, p:0.085, f:0.078, c:0.528, s:0.034, u:'g' },
  { n:['papa','patata','potato'], k:0.77, p:0.020, f:0.001, c:0.175, s:0.008, u:'g' },
  { n:['camote','batata','boniato','sweet potato'], k:0.86, p:0.016, f:0.001, c:0.201, s:0.042, u:'g' },
  { n:['frijoles','frijol','porotos','beans','caraotas'], k:1.27, p:0.087, f:0.005, c:0.227, s:0.004, u:'g' },
  { n:['lentejas','lenteja','lentils'], k:1.16, p:0.090, f:0.004, c:0.200, s:0.018, u:'g' },
  { n:['garbanzos','garbanzo','chickpeas'], k:1.64, p:0.089, f:0.026, c:0.274, s:0.048, u:'g' },
  // Frutas
  { n:['plátano','platano','banana','guineo','cambur'], k:105, p:1.3, f:0.4, c:27, s:14, u:'u' },
  { n:['manzana','apple'], k:95, p:0.5, f:0.3, c:25, s:19, u:'u' },
  { n:['naranja','orange','china'], k:62, p:1.2, f:0.2, c:15.4, s:12.2, u:'u' },
  { n:['fresa','frutilla','strawberry','fresas'], k:0.32, p:0.007, f:0.003, c:0.076, s:0.049, u:'g' },
  { n:['arándano','arandano','blueberry','blueberries'], k:0.57, p:0.007, f:0.003, c:0.144, s:0.100, u:'g' },
  { n:['uva','uvas','grape','grapes'], k:0.69, p:0.007, f:0.002, c:0.181, s:0.151, u:'g' },
  { n:['mango'], k:0.60, p:0.008, f:0.004, c:0.150, s:0.138, u:'g' },
  { n:['piña','pina','ananá','anana','pineapple'], k:0.50, p:0.005, f:0.001, c:0.131, s:0.099, u:'g' },
  { n:['sandía','sandia','watermelon','patilla'], k:0.30, p:0.006, f:0.002, c:0.076, s:0.062, u:'g' },
  { n:['aguacate','palta','avocado'], k:1.60, p:0.020, f:0.147, c:0.085, s:0.007, u:'g' },
  // Verduras
  { n:['brócoli','brocoli','broccoli'], k:0.34, p:0.028, f:0.004, c:0.066, s:0.017, u:'g' },
  { n:['espinaca','spinach','espinacas'], k:0.23, p:0.029, f:0.004, c:0.036, s:0.004, u:'g' },
  { n:['tomate','jitomate','tomato'], k:0.18, p:0.009, f:0.002, c:0.039, s:0.026, u:'g' },
  { n:['zanahoria','carrot','zanahorias'], k:0.41, p:0.009, f:0.002, c:0.096, s:0.048, u:'g' },
  { n:['lechuga','lettuce'], k:0.15, p:0.013, f:0.002, c:0.029, s:0.013, u:'g' },
  { n:['pepino','cucumber'], k:0.15, p:0.007, f:0.001, c:0.036, s:0.017, u:'g' },
  { n:['cebolla','onion'], k:0.40, p:0.011, f:0.001, c:0.093, s:0.042, u:'g' },
  { n:['pimiento','pimentón','bell pepper','ají'], k:0.20, p:0.009, f:0.002, c:0.046, s:0.025, u:'g' },
  // Frutos secos y grasas
  { n:['almendras','almendra','almond','almonds'], k:5.857, p:0.214, f:0.5, c:0.214, s:0.043, u:'g' },
  { n:['maní','mani','cacahuate','cacahuete','peanut'], k:5.67, p:0.258, f:0.492, c:0.161, s:0.040, u:'g' },
  { n:['nuez','nueces','walnut','walnuts'], k:6.54, p:0.152, f:0.654, c:0.138, s:0.026, u:'g' },
  { n:['mantequilla de maní','crema de maní','peanut butter'], k:5.88, p:0.252, f:0.504, c:0.200, s:0.095, u:'g' },
  { n:['aceite de oliva','aceite','olive oil'], k:8.84, p:0, f:1.0, c:0, s:0, u:'g' },
  { n:['mantequilla','butter','manteca'], k:7.17, p:0.009, f:0.811, c:0.001, s:0.001, u:'g' },
  // Otros
  { n:['proteína en polvo','proteina en polvo','whey','whey protein'], k:3.67, p:0.80, f:0.033, c:0.10, s:0.033, u:'g' },
  { n:['granola'], k:4.89, p:0.103, f:0.244, c:0.638, s:0.248, u:'g' },
  { n:['miel','honey'], k:3.04, p:0.003, f:0, c:0.824, s:0.824, u:'g' },
  { n:['azúcar','azucar','sugar'], k:3.87, p:0, f:0, c:1.0, s:1.0, u:'g' },
  { n:['chocolate','chocolate oscuro','dark chocolate'], k:5.46, p:0.050, f:0.310, c:0.598, s:0.479, u:'g' },
  { n:['semilla de chía','chia','chía','chia seeds'], k:4.86, p:0.166, f:0.309, c:0.421, s:0, u:'g' },
  { n:['arepa'], k:2.0, p:0.04, f:0.02, c:0.40, s:0.01, u:'g' },
  { n:['empanada'], k:250, p:8, f:12, c:28, s:1.5, u:'u' },
];

function _norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

function findFoodInDB(name) {
  const q = _norm(name);
  let best = null, bestScore = 0;
  for (const food of NUTRITION_DB) {
    for (const alias of food.n) {
      const a = _norm(alias);
      if (a === q) return food;
      if (q.includes(a) || a.includes(q)) {
        const score = Math.min(q.length, a.length) / Math.max(q.length, a.length);
        if (score > bestScore) { bestScore = score; best = food; }
      }
    }
  }
  return bestScore > 0.3 ? best : null;
}

function MacroDot({ color }) {
  return React.createElement('div', { style: { width: 8, height: 8, borderRadius: 999, background: color, flexShrink: 0 } });
}

function FoodDetailSheet({ food, onClose, onDelete }) {
  const isGram = food.unit === 'g';
  const perLabel = isGram ? '100g' : '1 unidad';
  const kcalVal  = isGram ? Math.round(food.kcal * 100) : food.kcal;

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'white', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1E1408' } }, food.name),
      React.createElement('div', { onClick: onClose, style: { cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#7A6652' } }, 'Cerrar')
    ),
    React.createElement('div', { style: { fontSize: 13, color: '#9A8878', marginBottom: 16 } }, `Valores por ${perLabel}`),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 } },
      MACRO_FIELDS.map(m => {
        const val = isGram ? (food[m.key] * 100) : food[m.key];
        return React.createElement('div', { key: m.key, style: { background: m.color + '22', borderRadius: 12, padding: '12px 14px' } },
          React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: m.color, marginBottom: 2 } }, m.label),
          React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 900, color: '#1E1408' } },
            `${typeof val === 'number' ? val.toFixed(m.key === 'kcal' ? 0 : 1) : '—'} ${m.suffix}`
          )
        );
      })
    ),
    food.custom && React.createElement('button', {
      onClick: onDelete,
      style: { width: '100%', background: '#FFE0E0', border: 'none', borderRadius: 999, padding: '13px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: '#C03030', cursor: 'pointer' }
    }, 'Eliminar alimento')
  );
}

function AddFoodSheet({ onClose, onSave }) {
  const [form, setForm]       = React.useState({ name: '', unit: 'g', kcal: '', protein: '', fat: '', carbs: '', sugar: '' });
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiDone, setAiDone]   = React.useState(false);
  const [aiError, setAiError] = React.useState('');

  function update(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function askAI() {
    if (!form.name) return;
    setAiLoading(true);
    setAiError('');
    // Simular procesamiento
    await new Promise(r => setTimeout(r, 700));
    const found = findFoodInDB(form.name);
    if (found) {
      setForm(f => ({ ...f, kcal: String(found.k), protein: String(found.p), fat: String(found.f), carbs: String(found.c), sugar: String(found.s), unit: found.u }));
      setAiDone(true);
    } else {
      setAiError('No encontramos ese alimento. Intenta con otro nombre o introdúcelo manualmente.');
    }
    setAiLoading(false);
  }

  const canSave = form.name && form.kcal && form.protein;

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'white', borderRadius: '24px 24px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.14)',
      padding: '0 20px 32px', maxHeight: '85%', overflowY: 'auto', zIndex: 50,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#1E1408', marginBottom: 16 } }, 'Agregar alimento'),
    React.createElement('div', { style: { marginBottom: 12 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#5A4838', marginBottom: 5 } }, 'Nombre del alimento'),
      React.createElement('input', {
        placeholder: 'Ej. Pechuga de pollo', value: form.name,
        onChange: e => { update('name', e.target.value); setAiDone(false); },
        style: { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #EAE0D0', fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#1E1408', outline: 'none' }
      })
    ),
    React.createElement('div', { style: { marginBottom: 14 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#5A4838', marginBottom: 5 } }, 'Unidad de medida'),
      React.createElement('div', { style: { display: 'flex', gap: 8 } },
        [{ id: 'g', label: 'Por gramo (g)' }, { id: 'u', label: 'Por unidad' }].map(u =>
          React.createElement('div', {
            key: u.id, onClick: () => update('unit', u.id),
            style: { flex: 1, padding: '10px', borderRadius: 12, border: `1.5px solid ${form.unit === u.id ? '#F5D040' : '#EAE0D0'}`, background: form.unit === u.id ? '#FFF3C4' : 'white', textAlign: 'center', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: form.unit === u.id ? '#9A6D00' : '#5A4838' }
          }, u.label)
        )
      )
    ),
    React.createElement('button', {
      onClick: askAI, disabled: !form.name || aiLoading,
      style: {
        width: '100%', marginBottom: aiError ? 8 : 14, padding: '12px',
        background: aiDone ? '#D8F5DB' : (aiLoading ? '#EAE0D0' : '#1E1408'),
        border: 'none', borderRadius: 999, cursor: aiLoading || !form.name ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600,
        color: aiDone ? '#2A7D3A' : (aiLoading ? '#9A8878' : 'white'),
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: !form.name ? 0.5 : 1,
      }
    },
      aiLoading ? '⏳ Consultando IA...' : aiDone ? '✓ Información completada' : '✨ Rellenar con IA'
    ),
    aiError && React.createElement('div', { style: { fontSize: 12, color: '#C03030', marginBottom: 12, padding: '6px 10px', background: '#FFE0E0', borderRadius: 8 } }, aiError),
    React.createElement('div', { style: { marginBottom: 4 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#5A4838', marginBottom: 8 } }, `Valores por ${form.unit === 'g' ? '1 gramo' : '1 unidad'}`),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } },
        MACRO_FIELDS.map(m =>
          React.createElement('div', { key: m.key },
            React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: m.color, marginBottom: 4 } }, m.label),
            React.createElement('div', { style: { position: 'relative' } },
              React.createElement('input', {
                type: 'number', placeholder: '0', value: form[m.key],
                onChange: e => update(m.key, e.target.value),
                style: { width: '100%', padding: '10px 32px 10px 10px', borderRadius: 10, border: `1.5px solid ${form[m.key] ? m.color + '88' : '#EAE0D0'}`, fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 700, color: '#1E1408', outline: 'none' }
              }),
              React.createElement('span', { style: { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#9A8878' } }, m.suffix)
            )
          )
        )
      )
    ),
    React.createElement('div', { style: { marginTop: 16, display: 'flex', gap: 10 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'white', border: '1.5px solid #EAE0D0', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: '#7A6652', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: () => canSave && onSave({ ...form, id: Date.now(), custom: true }),
        style: { flex: 2, padding: '14px', background: canSave ? '#F5D040' : '#EAE0D0', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: canSave ? '#1E1408' : '#B8A898', cursor: canSave ? 'pointer' : 'not-allowed', boxShadow: canSave ? '0 2px 8px rgba(245,208,64,0.3)' : 'none' }
      }, 'Guardar alimento')
    )
  );
}

function FoodRow({ food, onSelect }) {
  const isGram = food.unit === 'g';
  const kcalPer = isGram ? Math.round((food.kcalPerG || food.kcal) * 100) : food.kcal;

  return React.createElement('div', {
    onClick: () => onSelect(food),
    style: { background: 'white', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 8px rgba(30,20,8,0.06)', marginBottom: 8, cursor: 'pointer' }
  },
    React.createElement('div', { style: { flex: 1 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement('span', { style: { fontSize: 15, fontWeight: 600, color: '#1E1408' } }, food.name),
        food.custom && React.createElement('span', { style: { fontSize: 10, fontWeight: 600, background: '#FFF3C4', color: '#9A6D00', padding: '1px 6px', borderRadius: 999 } }, 'MÍO')
      ),
      React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: 12, color: '#9A8878' } }, `por ${isGram ? '100g' : 'unidad'}`),
        React.createElement('span', { style: { fontSize: 12, fontWeight: 600, color: '#F5D040', fontFamily: "'Nunito',sans-serif" } }, `${Math.round(kcalPer)} kcal`),
        React.createElement('div', { style: { display: 'flex', gap: 4 } },
          MACRO_FIELDS.slice(1).map(m => React.createElement(MacroDot, { key: m.key, color: m.color }))
        )
      )
    ),
    React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: '#B8A898', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
      React.createElement('polyline', { points: '9 18 15 12 9 6' })
    )
  );
}

function FoodLibrary({ onBack, library, onUpdateLibrary }) {
  const [query, setQuery]       = React.useState('');
  const [showAdd, setShowAdd]   = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const foods = library || [];
  const filtered = foods.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));

  function handleSave(food) {
    const normalized = {
      ...food,
      kcal:    parseFloat(food.kcal)    || 0,
      protein: parseFloat(food.protein) || 0,
      fat:     parseFloat(food.fat)     || 0,
      carbs:   parseFloat(food.carbs)   || 0,
      sugar:   parseFloat(food.sugar)   || 0,
    };
    if (onUpdateLibrary) onUpdateLibrary([normalized, ...foods]);
    setShowAdd(false);
  }

  function handleDelete(food) {
    if (onUpdateLibrary) onUpdateLibrary(foods.filter(f => f.id !== food.id));
    setSelected(null);
  }

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' } },
    React.createElement('div', { style: { padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 12 } },
      React.createElement('div', { onClick: onBack, style: { cursor: 'pointer', padding: 4 } },
        React.createElement(Icon, { name: 'back' })
      ),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 800, color: '#1E1408', flex: 1 } }, 'Mis alimentos'),
      React.createElement('div', {
        onClick: () => setShowAdd(true),
        style: { width: 36, height: 36, background: '#F5D040', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.35)' }
      },
        React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: '#1E1408', strokeWidth: 2.2, strokeLinecap: 'round' },
          React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
          React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
        )
      )
    ),
    React.createElement('div', { style: { padding: '12px 20px 0' } },
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('div', { style: { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' } },
          React.createElement(Icon, { name: 'search' })
        ),
        React.createElement('input', {
          value: query, onChange: e => setQuery(e.target.value),
          placeholder: 'Buscar en tu lista...',
          style: { width: '100%', padding: '12px 16px 12px 40px', borderRadius: 14, border: '1.5px solid #EAE0D0', background: 'white', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#1E1408', outline: 'none' }
        })
      )
    ),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '12px 20px 20px' } },
      React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: '#9A8878', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 } }, `${filtered.length} alimentos`),
      filtered.length > 0
        ? filtered.map(f => React.createElement(FoodRow, { key: f.id, food: f, onSelect: setSelected }))
        : React.createElement('div', { style: { textAlign: 'center', padding: '32px 16px' } },
            React.createElement('div', { style: { fontSize: 32, marginBottom: 8 } }, query ? '🔍' : '🥗'),
            React.createElement('div', { style: { fontSize: 14, color: '#7A6652' } }, query ? 'No encontramos ese alimento' : 'Tu lista está vacía'),
            React.createElement('div', { style: { fontSize: 12, color: '#9A8878', marginTop: 4 } }, query ? 'Intenta con otro nombre' : 'Toca + para agregar tu primer alimento')
          )
    ),
    showAdd && React.createElement('div', {
      onClick: () => setShowAdd(false),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 40 }
    }),
    showAdd && React.createElement(AddFoodSheet, { onClose: () => setShowAdd(false), onSave: handleSave }),
    selected && React.createElement('div', {
      onClick: () => setSelected(null),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 40 }
    }),
    selected && React.createElement(FoodDetailSheet, {
      food: selected,
      onClose: () => setSelected(null),
      onDelete: () => handleDelete(selected),
    })
  );
}

Object.assign(window, { FoodLibrary });
