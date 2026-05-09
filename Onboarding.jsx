// Onboarding.jsx — Multi-step registration flow

const GOALS = [
  { id: 'lose_fat',     label: 'Perder grasa',       desc: 'Reducir % de grasa corporal',   icon: '🔥', color: '#FFE4DB', border: '#FF8C69' },
  { id: 'gain_muscle',  label: 'Ganar músculo',       desc: 'Aumentar masa muscular',         icon: '💪', color: '#DFF3FA', border: '#7EC8E3' },
  { id: 'maintain',     label: 'Mantener peso',       desc: 'Estilo de vida saludable',       icon: '⚖️', color: '#FFF3C4', border: '#F5D040' },
  { id: 'performance',  label: 'Mejorar rendimiento', desc: 'Optimizar energía y resistencia', icon: '⚡', color: '#EFE4FF', border: '#C5A3FF' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary',   label: 'Sedentario',   desc: 'Sin ejercicio o muy poco' },
  { id: 'light',       label: 'Ligero',       desc: '1–2 días/semana' },
  { id: 'moderate',    label: 'Moderado',     desc: '3–4 días/semana' },
  { id: 'active',      label: 'Activo',       desc: '5–6 días/semana' },
  { id: 'very_active', label: 'Muy activo',   desc: 'Ejercicio intenso diario' },
];

const LIFESTYLES = [
  { id: 'desk',      label: 'Sentado todo el día',   desc: 'Oficina, home office, estudio' },
  { id: 'mixed',     label: 'Mezcla de pie/sentado', desc: 'Me muevo de vez en cuando' },
  { id: 'standing',  label: 'De pie la mayor parte', desc: 'Trabajo físico ligero' },
  { id: 'walking',   label: 'Caminando todo el día', desc: 'Trabajo físico activo' },
];

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const TRAINING_TYPES = [
  { id: 'strength', label: 'Fuerza',   color: '#7EC8E3', bg: '#DFF3FA' },
  { id: 'cardio',   label: 'Cardio',   color: '#FF8C69', bg: '#FFE4DB' },
  { id: 'mixed',    label: 'Mixto',    color: '#C5A3FF', bg: '#EFE4FF' },
  { id: 'rest',     label: 'Descanso', color: '#B8A898', bg: '#F5EFE4' },
];

function StepHeader({ step, total, title, sub, onBack }) {
  return React.createElement('div', { style: { padding: '16px 24px 20px' } },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 } },
      onBack && React.createElement('div', {
        onClick: onBack,
        style: { cursor: 'pointer', padding: 4, marginRight: 4, display: 'flex', alignItems: 'center' }
      },
        React.createElement('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: '#1E1408', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('polyline', { points: '15 18 9 12 15 6' })
        )
      ),
      React.createElement('div', { style: { display: 'flex', gap: 4, flex: 1 } },
        Array.from({ length: total }, (_, i) =>
          React.createElement('div', { key: i, style: { flex: 1, height: 3, borderRadius: 999, background: i <= step ? '#F5D040' : '#EAE0D0', transition: 'background 0.3s' } })
        )
      )
    ),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 22, fontWeight: 800, color: '#1E1408', lineHeight: 1.2 } }, title),
    sub && React.createElement('div', { style: { fontSize: 14, color: '#7A6652', marginTop: 6 } }, sub)
  );
}

function NextBtn({ label = 'Continuar', onClick, disabled = false }) {
  return React.createElement('div', { style: { padding: '12px 24px 28px' } },
    React.createElement('button', {
      onClick, disabled,
      style: {
        width: '100%', background: disabled ? '#EAE0D0' : '#F5D040',
        border: 'none', borderRadius: 999, padding: 16,
        fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600,
        color: disabled ? '#B8A898' : '#1E1408', cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 2px 8px rgba(245,208,64,0.35)',
        transition: 'background 0.2s',
      }
    }, label)
  );
}

function LabeledInput({ label, placeholder, value, onChange, type = 'text', suffix }) {
  return React.createElement('div', { style: { marginBottom: 14 } },
    React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#5A4838', marginBottom: 6 } }, label),
    React.createElement('div', { style: { position: 'relative' } },
      React.createElement('input', {
        type, value, onChange, placeholder,
        style: {
          width: '100%', padding: suffix ? '13px 48px 13px 16px' : '13px 16px',
          borderRadius: 14, border: '1.5px solid #EAE0D0', background: 'white',
          fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#1E1408', outline: 'none',
        }
      }),
      suffix && React.createElement('span', { style: { position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#9A8878', fontWeight: 500 } }, suffix)
    )
  );
}

function WelcomeStep({ onNext }) {
  return React.createElement('div', {
    style: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 32, textAlign: 'center',
      height: '100%', position: 'relative', overflow: 'hidden',
      background: '#FEFAF3',
    }
  },
    React.createElement('svg', {
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18, pointerEvents: 'none' },
      viewBox: '0 0 390 844', fill: 'none',
    },
      React.createElement('circle', { cx: 195, cy: 380, r: 80,  fill: 'none', stroke: '#F5D040', strokeWidth: 1.5 }),
      React.createElement('circle', { cx: 195, cy: 380, r: 130, fill: 'none', stroke: '#F5D040', strokeWidth: 1.2 }),
      React.createElement('circle', { cx: 195, cy: 380, r: 185, fill: 'none', stroke: '#FFAB5E', strokeWidth: 1 }),
      React.createElement('circle', { cx: 195, cy: 380, r: 245, fill: 'none', stroke: '#FFAB5E', strokeWidth: 0.8 }),
      React.createElement('circle', { cx: 195, cy: 380, r: 310, fill: 'none', stroke: '#F5D040', strokeWidth: 0.6 }),
      React.createElement('circle', { cx: 195, cy: 380, r: 380, fill: 'none', stroke: '#F5D040', strokeWidth: 0.5 }),
      ...Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 6 }, (_, col) =>
          React.createElement('circle', { key: `${row}-${col}`, cx: col * 70 + 20, cy: row * 110 + 40, r: 2, fill: '#F5D040' })
        )
      ).flat()
    ),
    React.createElement('div', {
      style: { position: 'absolute', top: '22%', left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,208,64,0.18) 0%, transparent 70%)', pointerEvents: 'none' }
    }),
    React.createElement('div', { style: { width: 96, height: 96, borderRadius: 30, background: '#FFF3C4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: '0 8px 32px rgba(245,208,64,0.3)', position: 'relative' } },
      React.createElement('svg', { width: 60, height: 60, viewBox: '0 0 48 48', fill: 'none' },
        React.createElement('circle', { cx: 24, cy: 24, r: 16, fill: 'none', stroke: '#EAE0D0', strokeWidth: 5 }),
        React.createElement('circle', { cx: 24, cy: 24, r: 16, fill: 'none', stroke: '#F5D040', strokeWidth: 5, strokeDasharray: '80.5 20.1', strokeLinecap: 'round', transform: 'rotate(-90 24 24)' }),
        React.createElement('text', { x: 24, y: 29, textAnchor: 'middle', fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 13, fill: '#1E1408' }, 'KC')
      )
    ),
    React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 40, fontWeight: 900, color: '#1E1408', letterSpacing: '-0.02em', position: 'relative' } }, 'KCALIA'),
    React.createElement('div', { style: { fontSize: 15, color: '#7A6652', marginTop: 10, lineHeight: 1.6, maxWidth: 260, position: 'relative' } }, 'Tu nutrición, personalizada.\nCuenta lo que comes, alcanza tus metas.'),
    React.createElement('div', { style: { display: 'flex', gap: 16, marginTop: 36, marginBottom: 40, position: 'relative' } },
      [['kcal', 'Calorías'], ['prot.', 'Proteína'], ['carbos', 'Carbohidratos']].map(([unit, label]) =>
        React.createElement('div', { key: label, style: { textAlign: 'center', background: 'white', borderRadius: 12, padding: '8px 12px', boxShadow: '0 2px 8px rgba(30,20,8,0.07)' } },
          React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 12, fontWeight: 800, color: '#F5D040' } }, unit),
          React.createElement('div', { style: { fontSize: 10, color: '#9A8878', marginTop: 2 } }, label)
        )
      )
    ),
    React.createElement('button', {
      onClick: onNext,
      style: { background: '#F5D040', border: 'none', borderRadius: 999, padding: '16px 52px', fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 700, color: '#1E1408', cursor: 'pointer', boxShadow: '0 4px 24px rgba(245,208,64,0.4)', position: 'relative' }
    }, 'Comenzar →')
  );
}

function GoalStep({ data, setData, onNext, onBack }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement(StepHeader, { step: 0, total: 7, title: '¿Cuál es tu objetivo?', sub: 'Esto nos ayudará a calcular tus metas nutricionales.', onBack }),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 24px' } },
      GOALS.map(g =>
        React.createElement('div', {
          key: g.id,
          onClick: () => setData({ ...data, goal: g.id }),
          style: { border: `2px solid ${data.goal === g.id ? g.border : '#EAE0D0'}`, background: data.goal === g.id ? g.color : 'white', borderRadius: 16, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.15s' }
        },
          React.createElement('div', { style: { fontSize: 28 } }, g.icon),
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: '#1E1408' } }, g.label),
            React.createElement('div', { style: { fontSize: 12, color: '#7A6652', marginTop: 2 } }, g.desc)
          ),
          data.goal === g.id && React.createElement('div', { style: { marginLeft: 'auto', width: 22, height: 22, borderRadius: 999, background: g.border, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
            React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' },
              React.createElement('polyline', { points: '20 6 9 17 4 12' })
            )
          )
        )
      )
    ),
    React.createElement(NextBtn, { onClick: onNext, disabled: !data.goal })
  );
}

function PersonalStep({ data, setData, onNext, onBack }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement(StepHeader, { step: 1, total: 7, title: 'Cuéntanos de ti', sub: 'Información básica para personalizar tu plan.', onBack }),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 24px' } },
      React.createElement(LabeledInput, { label: 'Nombre', placeholder: 'Tu nombre', value: data.name || '', onChange: e => setData({ ...data, name: e.target.value.slice(0, 60) }) }),
      React.createElement(LabeledInput, { label: 'Edad', placeholder: '25', type: 'number', value: data.age || '', onChange: e => {
        const raw = e.target.value;
        if (raw === '') { setData({ ...data, age: '' }); return; }
        const v = parseInt(raw, 10);
        if (!isNaN(v) && v <= 110) setData({ ...data, age: v });
      }, suffix: 'años' }),
      React.createElement('div', { style: { marginBottom: 14 } },
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#5A4838', marginBottom: 6 } }, 'Sexo'),
        React.createElement('div', { style: { display: 'flex', gap: 10 } },
          ['Masculino', 'Femenino', 'Otro'].map(s =>
            React.createElement('div', {
              key: s, onClick: () => setData({ ...data, sex: s }),
              style: { flex: 1, padding: '11px 8px', borderRadius: 12, border: `1.5px solid ${data.sex === s ? '#F5D040' : '#EAE0D0'}`, background: data.sex === s ? '#FFF3C4' : 'white', textAlign: 'center', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: data.sex === s ? '#9A6D00' : '#5A4838' }
            }, s)
          )
        )
      ),
    ),
    React.createElement(NextBtn, { onClick: onNext, disabled: !data.name || !data.age || data.age < 10 || !data.sex })
  );
}

function BodyStep({ data, setData, onNext, onBack }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement(StepHeader, { step: 2, total: 7, title: 'Medidas corporales', sub: 'Para calcular tu tasa metabólica basal.', onBack }),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 24px' } },
      React.createElement(LabeledInput, { label: 'Peso actual', placeholder: '70', type: 'number', value: data.weight || '', onChange: e => {
        const raw = e.target.value;
        if (raw === '') { setData({ ...data, weight: '' }); return; }
        const v = parseFloat(raw);
        if (!isNaN(v) && v <= 500) setData({ ...data, weight: v });
      }, suffix: 'kg' }),
      React.createElement(LabeledInput, { label: 'Peso objetivo', placeholder: '65', type: 'number', value: data.targetWeight || '', onChange: e => {
        const raw = e.target.value;
        if (raw === '') { setData({ ...data, targetWeight: '' }); return; }
        const v = parseFloat(raw);
        if (!isNaN(v) && v <= 500) setData({ ...data, targetWeight: v });
      }, suffix: 'kg' }),
      React.createElement(LabeledInput, { label: 'Altura', placeholder: '175', type: 'number', value: data.height || '', onChange: e => {
        const raw = e.target.value;
        if (raw === '') { setData({ ...data, height: '' }); return; }
        const v = parseFloat(raw);
        if (!isNaN(v) && v <= 300) setData({ ...data, height: v });
      }, suffix: 'cm' }),
      data.weight && data.height && data.height > 0 && React.createElement('div', { style: { background: '#FFF3C4', borderRadius: 14, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: 13, color: '#7A6652', fontWeight: 500 } }, 'IMC estimado'),
        React.createElement('span', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 18, fontWeight: 800, color: '#9A6D00' } },
          (data.weight / ((data.height / 100) ** 2)).toFixed(1)
        )
      )
    ),
    React.createElement(NextBtn, { onClick: onNext, disabled: !data.weight || data.weight < 20 || !data.height || data.height < 50 || (data.age && data.age < 10) })
  );
}

function ActivityStep({ data, setData, onNext, onBack }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement(StepHeader, { step: 3, total: 7, title: 'Nivel de actividad', sub: '¿Cuánto ejercicio haces normalmente?', onBack }),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 24px' } },
      ACTIVITY_LEVELS.map(a =>
        React.createElement('div', {
          key: a.id, onClick: () => setData({ ...data, activity: a.id }),
          style: { border: `2px solid ${data.activity === a.id ? '#F5D040' : '#EAE0D0'}`, background: data.activity === a.id ? '#FFF3C4' : 'white', borderRadius: 14, padding: '13px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.15s' }
        },
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: '#1E1408' } }, a.label),
            React.createElement('div', { style: { fontSize: 12, color: '#7A6652', marginTop: 2 } }, a.desc)
          ),
          data.activity === a.id && React.createElement('div', { style: { width: 20, height: 20, borderRadius: 999, background: '#F5D040', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
            React.createElement('svg', { width: 11, height: 11, viewBox: '0 0 24 24', fill: 'none', stroke: '#1E1408', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' },
              React.createElement('polyline', { points: '20 6 9 17 4 12' })
            )
          )
        )
      ),
      React.createElement('div', { style: { marginTop: 8 } },
        React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#5A4838', marginBottom: 8 } }, 'Estilo de vida diario'),
        LIFESTYLES.map(l =>
          React.createElement('div', {
            key: l.id, onClick: () => setData({ ...data, lifestyle: l.id }),
            style: { border: `2px solid ${data.lifestyle === l.id ? '#FFAB5E' : '#EAE0D0'}`, background: data.lifestyle === l.id ? '#FFE5CC' : 'white', borderRadius: 14, padding: '11px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.15s' }
          },
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: '#1E1408' } }, l.label),
              React.createElement('div', { style: { fontSize: 11, color: '#7A6652', marginTop: 1 } }, l.desc)
            ),
            data.lifestyle === l.id && React.createElement('div', { style: { width: 18, height: 18, borderRadius: 999, background: '#FFAB5E', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
              React.createElement('svg', { width: 10, height: 10, viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' },
                React.createElement('polyline', { points: '20 6 9 17 4 12' })
              )
            )
          )
        )
      )
    ),
    React.createElement(NextBtn, { onClick: onNext, disabled: !data.activity || !data.lifestyle })
  );
}

function RoutineStep({ data, setData, onNext, onBack }) {
  const routine = data.routine || {};
  function setDay(day, type) { setData({ ...data, routine: { ...routine, [day]: type } }); }

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement(StepHeader, { step: 4, total: 7, title: 'Tu rutina semanal', sub: 'Indica el tipo de actividad para cada día.', onBack }),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 24px' } },
      DAYS.map(day =>
        React.createElement('div', { key: day, style: { marginBottom: 12 } },
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#5A4838', marginBottom: 6 } }, day),
          React.createElement('div', { style: { display: 'flex', gap: 6 } },
            TRAINING_TYPES.map(t =>
              React.createElement('div', {
                key: t.id, onClick: () => setDay(day, t.id),
                style: { flex: 1, padding: '8px 4px', borderRadius: 10, textAlign: 'center', border: `1.5px solid ${routine[day] === t.id ? t.color : '#EAE0D0'}`, background: routine[day] === t.id ? t.bg : 'white', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: routine[day] === t.id ? t.color : '#9A8878', transition: 'all 0.12s' }
              }, t.label)
            )
          )
        )
      )
    ),
    React.createElement(NextBtn, { onClick: onNext, disabled: Object.keys(routine).length < 7 })
  );
}

function PersonalGoalStep({ data, setData, onNext, onBack }) {
  const maxChars = 300;
  const charCount = (data.personalGoal || '').length;

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement(StepHeader, { step: 5, total: 7, title: 'Describe tu meta ✨', sub: 'Opcional — Cuéntanos con tus propias palabras qué quieres lograr. Esto será analizado por IA para darte una experiencia más personalizada.', onBack }),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 24px' } },

      // Decorative AI badge
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, padding: '10px 14px', background: 'linear-gradient(135deg, #EFE4FF 0%, #DFF3FA 100%)', borderRadius: 14, border: '1.5px solid #C5A3FF' } },
        React.createElement('div', { style: { width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #C5A3FF 0%, #7EC8E3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 } }, '🤖'),
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: 13, fontWeight: 700, color: '#5A4838' } }, 'Personalización con IA'),
          React.createElement('div', { style: { fontSize: 11, color: '#7A6652', marginTop: 1, lineHeight: 1.4 } }, 'Tu descripción nos ayudará a entender mejor tus necesidades y adaptar recomendaciones.')
        )
      ),

      // Textarea
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('textarea', {
          value: data.personalGoal || '',
          onChange: e => {
            if (e.target.value.length <= maxChars) {
              setData({ ...data, personalGoal: e.target.value });
            }
          },
          placeholder: 'Ej: Quiero bajar 5 kilos para el verano, me cuesta dejar los dulces y quiero aprender a comer mejor sin pasar hambre...',
          rows: 6,
          style: {
            width: '100%', padding: '14px 16px', borderRadius: 16,
            border: '1.5px solid #EAE0D0', background: 'white',
            fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#1E1408',
            outline: 'none', resize: 'none', lineHeight: 1.6,
            transition: 'border-color 0.2s',
          },
          onFocus: e => e.target.style.borderColor = '#C5A3FF',
          onBlur: e => e.target.style.borderColor = '#EAE0D0',
        }),
        React.createElement('div', {
          style: { textAlign: 'right', fontSize: 11, color: charCount > maxChars * 0.9 ? '#FF8C69' : '#9A8878', marginTop: 6, fontWeight: 500 }
        }, `${charCount} / ${maxChars}`)
      ),

      // Suggestion chips
      React.createElement('div', { style: { marginTop: 16 } },
        React.createElement('div', { style: { fontSize: 12, fontWeight: 600, color: '#9A8878', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 } }, 'Ideas para inspirarte:'),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } },
          [
            'Quiero tener más energía en el día',
            'Prepararme para una competencia',
            'Mejorar mi relación con la comida',
            'Aprender a comer equilibrado',
            'Reducir grasa abdominal',
          ].map(chip =>
            React.createElement('div', {
              key: chip,
              onClick: () => {
                const current = data.personalGoal || '';
                const newText = current ? `${current} ${chip}.` : `${chip}.`;
                if (newText.length <= maxChars) {
                  setData({ ...data, personalGoal: newText });
                }
              },
              style: {
                padding: '6px 12px', borderRadius: 999, background: '#F5EFE4',
                fontSize: 12, color: '#5A4838', cursor: 'pointer', fontWeight: 500,
                transition: 'all 0.15s', border: '1px solid transparent',
              },
              onMouseEnter: e => { e.currentTarget.style.background = '#FFF3C4'; e.currentTarget.style.borderColor = '#F5D040'; },
              onMouseLeave: e => { e.currentTarget.style.background = '#F5EFE4'; e.currentTarget.style.borderColor = 'transparent'; },
            }, `+ ${chip}`)
          )
        )
      ),

      // Optional note
      React.createElement('div', { style: { marginTop: 20, padding: '10px 14px', background: '#FFF3C4', borderRadius: 12, fontSize: 12, color: '#5C4200', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 } },
        React.createElement('span', { style: { fontSize: 14, flexShrink: 0 } }, '💡'),
        'Este paso es totalmente opcional. Si prefieres, puedes omitirlo y completarlo después desde tu perfil.'
      )
    ),

    // Two buttons: Skip and Continue
    React.createElement('div', { style: { padding: '12px 24px 28px', display: 'flex', gap: 10 } },
      React.createElement('button', {
        onClick: () => {
          setData({ ...data, personalGoal: '' });
          onNext();
        },
        style: {
          flex: 1, background: 'white', border: '1.5px solid #EAE0D0',
          borderRadius: 999, padding: 16,
          fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600,
          color: '#7A6652', cursor: 'pointer', transition: 'all 0.2s',
        }
      }, 'Omitir'),
      React.createElement('button', {
        onClick: onNext,
        disabled: !data.personalGoal || data.personalGoal.trim().length === 0,
        style: {
          flex: 2,
          background: (!data.personalGoal || data.personalGoal.trim().length === 0) ? '#EAE0D0' : 'linear-gradient(135deg, #C5A3FF 0%, #7EC8E3 100%)',
          border: 'none', borderRadius: 999, padding: 16,
          fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600,
          color: (!data.personalGoal || data.personalGoal.trim().length === 0) ? '#B8A898' : 'white',
          cursor: (!data.personalGoal || data.personalGoal.trim().length === 0) ? 'not-allowed' : 'pointer',
          boxShadow: (!data.personalGoal || data.personalGoal.trim().length === 0) ? 'none' : '0 2px 12px rgba(197,163,255,0.35)',
          transition: 'all 0.2s',
        }
      }, 'Continuar con IA ✨')
    )
  );
}

function SummaryStep({ data, onFinish, onBack }) {
  // Personalized calc lives in Constants.jsx so the same formula is used elsewhere
  // and the deficit/surplus scales with the user's TDEE rather than being a flat number.
  const { bmr, tdee, targetKcal, suggestedGoals } = computeNutritionTargets({
    weight: data.weight, height: data.height, age: data.age,
    sex: data.sex, activity: data.activity, goal: data.goal,
  });

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
    React.createElement(StepHeader, { step: 6, total: 7, title: `¡Listo, ${data.name || 'campeón'}! 🎉`, sub: 'Tu plan nutricional está listo.', onBack }),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 24px' } },
      React.createElement('div', { style: { background: 'white', borderRadius: 20, padding: 20, boxShadow: '0 2px 12px rgba(30,20,8,0.08)', marginBottom: 14, textAlign: 'center' } },
        React.createElement('div', { style: { fontFamily: "'Nunito',sans-serif", fontSize: 48, fontWeight: 900, color: '#F5D040', lineHeight: 1 } }, targetKcal.toLocaleString()),
        React.createElement('div', { style: { fontSize: 14, color: '#7A6652', marginTop: 4 } }, 'kcal diarias recomendadas'),
        React.createElement('div', { style: { fontSize: 12, color: '#9A8878', marginTop: 4 } }, `TMB: ${Math.round(bmr)} kcal · TDEE: ${tdee} kcal`)
      ),
      React.createElement('div', { style: { background: 'white', borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 8px rgba(30,20,8,0.06)', marginBottom: 10 } },
        [
          ['Objetivo', (typeof GOAL_LABELS !== 'undefined' && GOAL_LABELS[data.goal]) || '—'],
          ['Peso actual', `${data.weight} kg`],
          ['Peso objetivo', data.targetWeight ? `${data.targetWeight} kg` : '—'],
          ['Altura', `${data.height} cm`],
          ['Proteína sugerida', `${suggestedGoals.protein}g / día`],
          ['Actividad', (typeof ACTIVITY_LABELS !== 'undefined' && ACTIVITY_LABELS[data.activity]) || data.activity || '—'],
        ].map(([k, v]) =>
          React.createElement('div', { key: k, style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F5EFE4' } },
            React.createElement('span', { style: { fontSize: 13, color: '#7A6652' } }, k),
            React.createElement('span', { style: { fontSize: 13, fontWeight: 600, color: '#1E1408' } }, v)
          )
        )
      ),
      React.createElement('div', { style: { background: '#FFF3C4', borderRadius: 14, padding: '12px 14px', fontSize: 12, color: '#5C4200', lineHeight: 1.5 } }, '💡 Puedes ajustar estas metas manualmente desde tu perfil en cualquier momento.')
    ),
    React.createElement(NextBtn, { label: 'Empezar a registrar →', onClick: () => onFinish(data, suggestedGoals) })
  );
}

function Onboarding({ onComplete }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({});

  function goNext() { setStep(s => s + 1); }
  function goBack() { setStep(s => Math.max(0, s - 1)); }

  const steps = [
    React.createElement(WelcomeStep, { onNext: goNext }),
    React.createElement(GoalStep, { data, setData, onNext: goNext, onBack: goBack }),
    React.createElement(PersonalStep, { data, setData, onNext: goNext, onBack: goBack }),
    React.createElement(BodyStep, { data, setData, onNext: goNext, onBack: goBack }),
    React.createElement(ActivityStep, { data, setData, onNext: goNext, onBack: goBack }),
    React.createElement(RoutineStep, { data, setData, onNext: goNext, onBack: goBack }),
    React.createElement(PersonalGoalStep, { data, setData, onNext: goNext, onBack: goBack }),
    React.createElement(SummaryStep, { data, onFinish: onComplete, onBack: goBack }),
  ];

  return steps[step] || null;
}

Object.assign(window, { Onboarding });
