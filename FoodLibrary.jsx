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
  // Proteínas adicionales
  { n:['tilapia','filete de tilapia'], k:1.28, p:0.261, f:0.026, c:0, s:0, u:'g' },
  { n:['sardina','sardinas','sardine'], k:2.08, p:0.245, f:0.114, c:0, s:0, u:'g' },
  { n:['pollo entero','muslo de pollo','muslo'], k:1.89, p:0.181, f:0.125, c:0, s:0, u:'g' },
  { n:['carne de cordero','cordero','lamb'], k:2.58, p:0.257, f:0.163, c:0, s:0, u:'g' },
  { n:['hígado de res','higado','liver'], k:1.35, p:0.203, f:0.038, c:0.037, s:0, u:'g' },
  { n:['chorizo'], k:3.26, p:0.129, f:0.282, c:0.019, s:0.001, u:'g' },
  { n:['jamón','jamon','ham'], k:1.45, p:0.179, f:0.063, c:0.015, s:0.010, u:'g' },
  { n:['salchicha','hot dog','frankfurt'], k:2.90, p:0.110, f:0.251, c:0.033, s:0.016, u:'g' },
  { n:['bacalao','bacalao seco','cod'], k:0.82, p:0.179, f:0.007, c:0, s:0, u:'g' },
  { n:['cangrejo','jaiba','crab'], k:0.83, p:0.183, f:0.010, c:0, s:0, u:'g' },
  { n:['pulpo','octopus'], k:0.82, p:0.148, f:0.010, c:0.022, s:0, u:'g' },
  // Lácteos adicionales
  { n:['leche de almendras','almond milk'], k:0.17, p:0.006, f:0.012, c:0.022, s:0.013, u:'g' },
  { n:['leche de soya','leche de soja','soy milk'], k:0.43, p:0.030, f:0.017, c:0.047, s:0.025, u:'g' },
  { n:['queso mozzarella','mozzarella'], k:2.80, p:0.222, f:0.172, c:0.022, s:0.010, u:'g' },
  { n:['queso fresco','panela'], k:2.44, p:0.186, f:0.178, c:0.016, s:0.010, u:'g' },
  { n:['crema agria','crema','sour cream'], k:1.93, p:0.025, f:0.195, c:0.038, s:0.038, u:'g' },
  { n:['helado','ice cream'], k:2.07, p:0.036, f:0.110, c:0.238, s:0.210, u:'g' },
  // Carbohidratos adicionales
  { n:['quinoa','quinua'], k:1.20, p:0.044, f:0.019, c:0.219, s:0.009, u:'g' },
  { n:['maíz','elote','choclo','corn'], k:0.86, p:0.032, f:0.013, c:0.190, s:0.064, u:'g' },
  { n:['yuca','tapioca','cassava'], k:1.60, p:0.014, f:0.003, c:0.384, s:0.017, u:'g' },
  { n:['pan de centeno','rye bread'], k:2.59, p:0.088, f:0.033, c:0.480, s:0.040, u:'g' },
  { n:['cereales','corn flakes','cereal'], k:3.57, p:0.071, f:0.014, c:0.793, s:0.286, u:'g' },
  { n:['galleta','galletas','crackers'], k:4.34, p:0.071, f:0.154, c:0.671, s:0.143, u:'g' },
  { n:['cuscús','couscous'], k:1.12, p:0.038, f:0.002, c:0.232, s:0, u:'g' },
  { n:['trigo','wheat','bulgur'], k:3.42, p:0.126, f:0.017, c:0.716, s:0.010, u:'g' },
  { n:['tostada','toast'], k:3.09, p:0.108, f:0.049, c:0.560, s:0.060, u:'g' },
  { n:['papa frita','papas fritas','french fries'], k:3.12, p:0.037, f:0.150, c:0.412, s:0.008, u:'g' },
  // Frutas adicionales
  { n:['pera','pear'], k:57, p:0.4, f:0.1, c:15, s:9.8, u:'u' },
  { n:['durazno','melocotón','melocoton','peach'], k:59, p:1.4, f:0.4, c:14, s:12.6, u:'u' },
  { n:['kiwi'], k:42, p:0.8, f:0.4, c:10, s:6.2, u:'u' },
  { n:['mandarina','clementina'], k:47, p:0.7, f:0.3, c:12, s:9.3, u:'u' },
  { n:['limón','limon','lemon'], k:17, p:0.6, f:0.2, c:5.4, s:1.4, u:'u' },
  { n:['papaya','lechosa'], k:0.43, p:0.005, f:0.001, c:0.107, s:0.076, u:'g' },
  { n:['melón','melon','cantaloupe'], k:0.34, p:0.008, f:0.002, c:0.082, s:0.079, u:'g' },
  { n:['cereza','cerezas','cherry'], k:0.50, p:0.010, f:0.003, c:0.122, s:0.083, u:'g' },
  { n:['coco','coco rallado','coconut'], k:3.54, p:0.033, f:0.336, c:0.152, s:0.062, u:'g' },
  // Verduras adicionales
  { n:['coliflor','cauliflower'], k:0.25, p:0.019, f:0.003, c:0.050, s:0.019, u:'g' },
  { n:['calabacín','zucchini','calabacin'], k:0.17, p:0.012, f:0.003, c:0.031, s:0.025, u:'g' },
  { n:['berenjena','eggplant'], k:0.25, p:0.010, f:0.002, c:0.059, s:0.035, u:'g' },
  { n:['espárragos','esparragos','asparagus'], k:0.20, p:0.022, f:0.001, c:0.038, s:0.013, u:'g' },
  { n:['apio','celery'], k:0.16, p:0.007, f:0.002, c:0.030, s:0.016, u:'g' },
  { n:['champiñones','champiñon','hongos','mushrooms'], k:0.22, p:0.031, f:0.003, c:0.032, s:0.020, u:'g' },
  { n:['maíz en lata','elote en lata'], k:0.83, p:0.031, f:0.011, c:0.184, s:0.059, u:'g' },
  { n:['chayote','chayota'], k:0.19, p:0.007, f:0.001, c:0.044, s:0.018, u:'g' },
  { n:['nopal','nopales'], k:0.16, p:0.014, f:0.001, c:0.035, s:0.012, u:'g' },
  { n:['remolacha','betabel','beet'], k:0.43, p:0.016, f:0.002, c:0.100, s:0.071, u:'g' },
  // Frutos secos adicionales
  { n:['pistache','pistacho','pistachios'], k:5.62, p:0.202, f:0.454, c:0.275, s:0.078, u:'g' },
  { n:['anacardo','marañón','cashew'], k:5.53, p:0.182, f:0.439, c:0.302, s:0.058, u:'g' },
  { n:['semillas de girasol','girasol','sunflower seeds'], k:5.84, p:0.209, f:0.514, c:0.200, s:0.027, u:'g' },
  { n:['semillas de calabaza','pepitas','pumpkin seeds'], k:5.59, p:0.302, f:0.491, c:0.107, s:0.014, u:'g' },
  { n:['linaza','flaxseed','lino'], k:5.34, p:0.184, f:0.421, c:0.288, s:0.015, u:'g' },
  // Bebidas y otros
  { n:['jugo de naranja','zumo de naranja','orange juice'], k:0.45, p:0.007, f:0.002, c:0.104, s:0.084, u:'g' },
  { n:['café','cafe','coffee'], k:0.002, p:0.0003, f:0, c:0, s:0, u:'g' },
  { n:['leche con chocolate','chocolate milk'], k:0.83, p:0.034, f:0.032, c:0.119, s:0.112, u:'g' },
  { n:['kétchup','ketchup','catsup'], k:1.12, p:0.013, f:0.001, c:0.268, s:0.219, u:'g' },
  { n:['mayonesa','mayonnaise'], k:6.80, p:0.010, f:0.746, c:0.038, s:0.030, u:'g' },
  { n:['aceite de coco','coconut oil'], k:8.62, p:0, f:1.0, c:0, s:0, u:'g' },
  { n:['proteína vegetal','proteina vegetal','plant protein'], k:3.50, p:0.75, f:0.04, c:0.12, s:0.04, u:'g' },
  // Comidas latinoamericanas
  { n:['tamale','tamal','tamales'], k:190, p:6, f:8, c:24, s:1, u:'u' },
  { n:['taco'], k:210, p:12, f:9, c:22, s:1.5, u:'u' },
  { n:['burrito'], k:380, p:18, f:14, c:46, s:3, u:'u' },
  { n:['quesadilla'], k:300, p:15, f:14, c:32, s:2, u:'u' },
  { n:['sopa de verduras','caldo de verduras'], k:0.40, p:0.015, f:0.008, c:0.075, s:0.020, u:'g' },
  { n:['arroz con pollo'], k:1.50, p:0.12, f:0.05, c:0.19, s:0.003, u:'g' },
  { n:['sushi','rollo de sushi'], k:150, p:5, f:1, c:30, s:2, u:'u' },
  { n:['pizza','slice de pizza'], k:266, p:11, f:10, c:33, s:3.6, u:'u' },
  { n:['hamburguesa','burger'], k:354, p:20, f:17, c:29, s:5, u:'u' },
];

// Convert NUTRITION_DB entries to the full food object format used in library
function _buildDBFood(entry, idx) {
  const isG = entry.u === 'g';
  return {
    id: 'db_' + idx,
    name: entry.n[0].charAt(0).toUpperCase() + entry.n[0].slice(1),
    unit: entry.u,
    // Per-gram foods store the raw per-g value; per-unit foods store the absolute value
    kcal:    entry.k,
    protein: entry.p,
    fat:     entry.f,
    carbs:   entry.c,
    sugar:   entry.s,
    kcalPerG: isG ? entry.k : null,
    custom: false,
  };
}

const DB_FOODS = NUTRITION_DB.map(_buildDBFood);

// Local fallback for diacritic-insensitive matching. Prefers the shared
// normalizeText from Constants.jsx when available so all search code paths
// behave identically.
const _norm = (typeof normalizeText === 'function') ? normalizeText : (s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''));

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

function FoodDetailSheet({ food, onClose, onDelete, onEdit }) {
  const isGram = food.unit === 'g';
  const perLabel = isGram ? '100g' : '1 unidad';
  const kcalVal  = isGram ? Math.round((food.kcalPerG || food.kcal) * 100) : food.kcal;

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '22px 22px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.16)',
      padding: '0 20px 32px', zIndex: 60,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 } },
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)' } }, food.name),
      React.createElement('button', {
        onClick: onClose,
        'aria-label': 'Cerrar detalles',
        type: 'button',
        style: { cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #7A6652)', background: 'transparent', border: 'none', padding: '8px 12px', minHeight: 44, font: 'inherit' }
      }, 'Cerrar')
    ),
    React.createElement('div', { style: { fontSize: 13, color: 'var(--color-muted, #9A8878)', marginBottom: 16 } }, `Valores por ${perLabel}`),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 } },
      MACRO_FIELDS.map(m => {
        // For gram-based foods, stored value is per-1g; display per 100g for readability
        const displayVal = m.key === 'kcal'
          ? (isGram ? kcalVal : food.kcal)
          : (isGram ? parseFloat(((food[m.key] || 0) * 100).toFixed(1)) : food[m.key]);
        return React.createElement('div', { key: m.key, style: { background: m.color + '22', borderRadius: 12, padding: '12px 14px' } },
          React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: m.color, marginBottom: 2 } }, m.label),
          React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 900, color: 'var(--color-text, #1E1408)' } },
            `${typeof displayVal === 'number' ? displayVal.toFixed(m.key === 'kcal' ? 0 : 1) : '—'} ${m.suffix}`
          )
        );
      })
    ),
    React.createElement('div', { style: { display: 'flex', gap: 8 } },
      React.createElement('button', {
        onClick: onEdit,
        style: { flex: 1, background: '#FFF3C4', border: 'none', borderRadius: 999, padding: '13px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: '#9A6D00', cursor: 'pointer' }
      }, 'Editar'),
      food.custom && React.createElement('button', {
        onClick: onDelete,
        style: { flex: 1, background: '#FFE0E0', border: 'none', borderRadius: 999, padding: '13px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: '#C03030', cursor: 'pointer' }
      }, 'Eliminar')
    )
  );
}

function AddFoodSheet({ onClose, onSave, editFood }) {
  // Coerce unknown/undefined macro values to '' instead of the string "undefined",
  // which would later parseFloat to NaN and corrupt every meal using this food.
  const _str = (v) => (v === null || v === undefined || isNaN(v)) ? '' : String(v);
  const [form, setForm] = React.useState(editFood ? {
    name: editFood.name || '',
    unit: editFood.unit || 'g',
    kcal:    _str(editFood.unit === 'g' ? (editFood.kcalPerG != null ? editFood.kcalPerG : editFood.kcal) : editFood.kcal),
    protein: _str(editFood.protein),
    fat:     _str(editFood.fat),
    carbs:   _str(editFood.carbs),
    sugar:   _str(editFood.sugar),
  } : { name: '', unit: 'g', kcal: '', protein: '', fat: '', carbs: '', sugar: '' });
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiDone, setAiDone]   = React.useState(false);
  const [aiError, setAiError] = React.useState('');

  function update(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function askAI() {
    if (!form.name) return;
    setAiLoading(true);
    setAiError('');
    const found = findFoodInDB(form.name);
    if (found) {
      setForm(f => ({ ...f, kcal: String(found.k), protein: String(found.p), fat: String(found.f), carbs: String(found.c), sugar: String(found.s), unit: found.u }));
      setAiDone(true);
    } else {
      setAiError('No encontramos ese alimento. Intenta con otro nombre o introdúcelo manualmente.');
    }
    setAiLoading(false);
  }

  // Require name + non-negative numbers across all macro fields. kcal must be > 0
  // since a 0-calorie food has no nutritional impact and is almost certainly a typo.
  const numFields = ['kcal', 'protein', 'fat', 'carbs', 'sugar'];
  const numericValues = numFields.map(k => parseFloat(form[k]));
  const hasInvalidNumbers = numericValues.some(v => v !== undefined && form[numFields[numericValues.indexOf(v)]] !== '' && (isNaN(v) || v < 0));
  const allNumbersValid = numFields.every(k => {
    const v = form[k];
    if (v === '') return false;
    const n = parseFloat(v);
    return !isNaN(n) && n >= 0;
  });
  const kcalNum = parseFloat(form.kcal);
  const canSave = !!form.name.trim() && allNumbersValid && !isNaN(kcalNum) && kcalNum > 0;

  return React.createElement('div', {
    style: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-card, white)', borderRadius: '24px 24px 0 0',
      boxShadow: '0 -8px 32px rgba(30,20,8,0.14)',
      padding: '0 20px 32px', maxHeight: '85%', overflowY: 'auto', zIndex: 50,
    }
  },
    React.createElement('div', { style: { width: 36, height: 4, background: '#D4C8B4', borderRadius: 999, margin: '12px auto 16px' } }),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: 'var(--color-text, #1E1408)', marginBottom: 16 } }, editFood ? 'Editar alimento' : 'Agregar alimento'),
    React.createElement('div', { style: { marginBottom: 12 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 5 } }, 'Nombre del alimento'),
      React.createElement('input', {
        placeholder: 'Ej. Pechuga de pollo', value: form.name,
        onChange: e => { update('name', e.target.value); setAiDone(false); },
        style: { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid var(--border-color, #EAE0D0)', background: 'var(--bg-input, white)', fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'var(--color-text, #1E1408)', outline: 'none' }
      })
    ),
    React.createElement('div', { style: { marginBottom: 14 } },
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 5 } }, 'Unidad de medida'),
      React.createElement('div', { style: { display: 'flex', gap: 8 } },
        [{ id: 'g', label: 'Por gramo (g)' }, { id: 'u', label: 'Por unidad' }].map(u =>
          React.createElement('button', {
            key: u.id, onClick: () => update('unit', u.id),
            'aria-pressed': form.unit === u.id,
            type: 'button',
            style: { flex: 1, padding: '12px 10px', borderRadius: 12, border: `1.5px solid ${form.unit === u.id ? '#F5D040' : 'var(--border-color, #EAE0D0)'}`, background: form.unit === u.id ? '#FFF3C4' : 'var(--bg-card, white)', textAlign: 'center', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: form.unit === u.id ? '#9A6D00' : 'var(--color-sub, #5A4838)', font: 'inherit', minHeight: 44 }
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
      React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: 'var(--color-sub, #5A4838)', marginBottom: 8 } }, `Valores por ${form.unit === 'g' ? '1 gramo' : '1 unidad'}`),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } },
        MACRO_FIELDS.map(m =>
          React.createElement('div', { key: m.key },
            React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: m.color, marginBottom: 4 } }, m.label),
            React.createElement('div', { style: { position: 'relative' } },
              React.createElement('input', {
                type: 'number', placeholder: '0', value: form[m.key],
                min: 0,
                onChange: e => {
                  const raw = e.target.value;
                  if (raw === '') { update(m.key, ''); return; }
                  const v = parseFloat(raw);
                  if (isNaN(v) || v < 0) return;
                  update(m.key, raw);
                },
                style: { width: '100%', padding: '10px 32px 10px 10px', borderRadius: 10, border: `1.5px solid ${form[m.key] ? m.color + '88' : 'var(--border-color, #EAE0D0)'}`, background: 'var(--bg-input, white)', fontFamily: "'Nunito',sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--color-text, #1E1408)', outline: 'none' }
              }),
              React.createElement('span', { style: { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'var(--color-muted, #9A8878)' } }, m.suffix)
            )
          )
        )
      )
    ),
    React.createElement('div', { style: { marginTop: 16, display: 'flex', gap: 10 } },
      React.createElement('button', { onClick: onClose, style: { flex: 1, padding: '14px', background: 'var(--bg-card, white)', border: '1.5px solid var(--border-color, #EAE0D0)', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--color-sub, #7A6652)', cursor: 'pointer' } }, 'Cancelar'),
      React.createElement('button', {
        onClick: () => {
          if (!canSave) return;
          const kcalRaw    = parseFloat(form.kcal)    || 0;
          const proteinRaw = parseFloat(form.protein) || 0;
          const fatRaw     = parseFloat(form.fat)     || 0;
          const carbsRaw   = parseFloat(form.carbs)   || 0;
          const sugarRaw   = parseFloat(form.sugar)   || 0;
          // For unit:'g', values entered are per 1g. For unit:'u', values are per unit.
          const normalized = {
            id: (editFood && editFood.custom) ? editFood.id : Date.now(),
            name: form.name.trim(),
            unit: form.unit,
            kcal:    kcalRaw,
            protein: proteinRaw,
            fat:     fatRaw,
            carbs:   carbsRaw,
            sugar:   sugarRaw,
            kcalPerG: form.unit === 'g' ? kcalRaw : null,
            custom: true,
          };
          onSave(normalized);
        },
        style: { flex: 2, padding: '14px', background: canSave ? '#F5D040' : '#EAE0D0', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: canSave ? '#1E1408' : '#B8A898', cursor: canSave ? 'pointer' : 'not-allowed', boxShadow: canSave ? '0 2px 8px rgba(245,208,64,0.3)' : 'none' }
      }, editFood ? 'Guardar cambios' : 'Guardar alimento')
    )
  );
}

function FoodRow({ food, onSelect }) {
  const isGram = food.unit === 'g';
  const kcalPer = isGram ? Math.round((food.kcalPerG || food.kcal) * 100) : food.kcal;

  return React.createElement('button', {
    onClick: () => onSelect(food),
    'aria-label': `${food.name}, ${Math.round(kcalPer)} kcal por ${isGram ? '100 gramos' : 'unidad'}`,
    type: 'button',
    style: { width: '100%', textAlign: 'left', background: 'var(--bg-card, white)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 8px rgba(30,20,8,0.06)', marginBottom: 8, cursor: 'pointer', border: 'none', color: 'inherit', font: 'inherit', minHeight: 56 }
  },
    React.createElement('div', { style: { flex: 1 } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement('span', { style: { fontSize: 15, fontWeight: 600, color: 'var(--color-text, #1E1408)' } }, food.name),
        food.custom
          ? React.createElement('span', { style: { fontSize: 10, fontWeight: 600, background: '#FFF3C4', color: '#9A6D00', padding: '1px 6px', borderRadius: 999 } }, 'MÍO')
          : React.createElement('span', { style: { fontSize: 10, fontWeight: 600, background: '#DFF3FA', color: '#1A7A9A', padding: '1px 6px', borderRadius: 999 } }, 'BASE')
      ),
      React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)' } }, `por ${isGram ? '100g' : 'unidad'}`),
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

const LIBRARY_TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'custom', label: 'Míos' },
  { id: 'db', label: 'Base' },
];

function FoodLibrary({ onBack, library, onUpdateLibrary }) {
  const [query, setQuery]       = React.useState('');
  const [showAdd, setShowAdd]   = React.useState(false);
  const [editFood, setEditFood] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [tab, setTab]           = React.useState('all');

  const customFoods = library || [];

  // Merge: custom foods take precedence (shown first), then DB foods not overridden
  const allFoods = [
    ...customFoods,
    ...DB_FOODS.filter(dbf => !customFoods.some(cf => cf.name.toLowerCase() === dbf.name.toLowerCase())),
  ];

  const tabFoods = tab === 'custom' ? customFoods : tab === 'db' ? DB_FOODS : allFoods;
  // Accent-insensitive: "platano" finds "Plátano". Use the global normalizeText
  // helper so search behavior matches AddMeal exactly.
  const _normSearch = (typeof normalizeText === 'function') ? normalizeText : _norm;
  const queryN = _normSearch(query);
  const filtered = queryN
    ? tabFoods.filter(f => _normSearch(f.name).includes(queryN))
    : tabFoods;

  function handleSave(normalized) {
    if (!onUpdateLibrary) { setShowAdd(false); setEditFood(null); return; }

    if (editFood && editFood.custom) {
      // Update existing custom food in place by id.
      onUpdateLibrary(customFoods.map(f => f.id === editFood.id ? normalized : f));
    } else {
      // New food OR editing a BASE food. In both cases, if a custom with the
      // same (case-insensitive) name already exists, replace it instead of
      // creating a duplicate. This avoids "Pollo MÍO" + "Pollo BASE" pairs.
      const targetName = normalized.name.trim().toLowerCase();
      const existingIdx = customFoods.findIndex(f => f.name.trim().toLowerCase() === targetName);
      if (existingIdx >= 0) {
        const replacement = { ...normalized, id: customFoods[existingIdx].id };
        onUpdateLibrary(customFoods.map((f, i) => i === existingIdx ? replacement : f));
      } else {
        onUpdateLibrary([normalized, ...customFoods]);
      }
    }
    setShowAdd(false);
    setEditFood(null);
  }

  function handleDelete(food) {
    if (onUpdateLibrary) onUpdateLibrary(customFoods.filter(f => f.id !== food.id));
    setSelected(null);
  }

  function handleEdit(food) {
    setSelected(null);
    setEditFood(food);
    setShowAdd(true);
  }

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: 'var(--bg-main, #FEFAF3)' } },
    React.createElement('div', { style: { padding: '8px 12px 0', display: 'flex', alignItems: 'center', gap: 8 } },
      React.createElement(IconButton, { onClick: onBack, ariaLabel: 'Volver' },
        React.createElement(Icon, { name: 'back' })
      ),
      React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--color-text, #1E1408)', flex: 1 } }, 'Biblioteca de alimentos'),
      React.createElement('button', {
        onClick: () => { setEditFood(null); setShowAdd(true); },
        'aria-label': 'Agregar alimento personalizado',
        type: 'button',
        style: { width: 44, height: 44, background: '#F5D040', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,208,64,0.35)', border: 'none', padding: 0 }
      },
        React.createElement('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: '#1E1408', strokeWidth: 2.2, strokeLinecap: 'round' },
          React.createElement('line', { x1: 12, y1: 5, x2: 12, y2: 19 }),
          React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
        )
      )
    ),
    // Tabs
    React.createElement('div', { style: { padding: '10px 20px 0', display: 'flex', gap: 6 } },
      LIBRARY_TABS.map(t =>
        React.createElement('button', {
          key: t.id,
          onClick: () => setTab(t.id),
          'aria-pressed': tab === t.id,
          type: 'button',
          style: { padding: '10px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: tab === t.id ? '#F5D040' : 'var(--bg-card, white)', color: tab === t.id ? '#1E1408' : 'var(--color-sub, #7A6652)', border: tab === t.id ? '1.5px solid #F5D040' : '1.5px solid var(--border-color, #EAE0D0)', transition: 'all 0.15s', font: 'inherit', minHeight: 40 }
        }, t.label)
      )
    ),
    React.createElement('div', { style: { padding: '10px 20px 0' } },
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
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '10px 20px 20px' } },
      React.createElement('div', { style: { fontSize: 11, fontWeight: 600, color: 'var(--color-muted, #9A8878)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 } }, `${filtered.length} alimentos`),
      filtered.length > 0
        ? filtered.map(f => React.createElement(FoodRow, { key: f.id, food: f, onSelect: setSelected }))
        : React.createElement('div', { style: { textAlign: 'center', padding: '32px 16px' } },
            React.createElement('div', { style: { fontSize: 32, marginBottom: 8 } }, query ? '🔍' : '🥗'),
            React.createElement('div', { style: { fontSize: 14, color: 'var(--color-sub, #7A6652)' } }, query ? 'No encontramos ese alimento' : 'No hay alimentos en esta categoría'),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--color-muted, #9A8878)', marginTop: 4 } }, query ? 'Intenta con otro nombre' : 'Toca + para agregar un alimento personalizado')
          )
    ),
    showAdd && React.createElement('div', {
      onClick: () => { setShowAdd(false); setEditFood(null); },
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 40 }
    }),
    showAdd && React.createElement(AddFoodSheet, {
      onClose: () => { setShowAdd(false); setEditFood(null); },
      onSave: handleSave,
      editFood,
    }),
    selected && React.createElement('div', {
      onClick: () => setSelected(null),
      style: { position: 'absolute', inset: 0, background: 'rgba(30,20,8,0.3)', zIndex: 40 }
    }),
    selected && React.createElement(FoodDetailSheet, {
      food: selected,
      onClose: () => setSelected(null),
      onDelete: () => handleDelete(selected),
      onEdit: () => handleEdit(selected),
    })
  );
}

Object.assign(window, { FoodLibrary, NUTRITION_DB, DB_FOODS, findFoodInDB });
