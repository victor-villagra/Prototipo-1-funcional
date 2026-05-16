# CLAUDE.md

Guía para Claude Code trabajando en este repo.

## Workflow

Tras cada cambio: explicar en 2-3 líneas y preguntar **"¿Quieres que haga el push a GitHub?"**.
Si sí → `git add` + `git commit` + `git push`. Si no → parar.

## Stack

- React 18 UMD vía CDN — sin build, sin npm, sin compilación.
- PWA instalable (manifest + service worker).
- Lenguaje único: `.jsx` cargados como `<script>` planos.

**Correr**: abrir `index.html` directo, o servir por HTTP (el SW requiere `http(s)://`, no `file://`). No hay lint, test, ni build. La única verificación programática usada hasta hoy fue Node + jsdom ad-hoc.

## Arquitectura

### Carga de scripts

`index.html` carga React desde `unpkg.com` y luego cada `.jsx` como `<script src>`. Cada archivo expone su API mutando `window` (`Object.assign(window, { Dashboard })`). `App()` y `ScreenErrorBoundary` viven en el `<script>` inline al final de `index.html`.

⚠️ **Gotcha de colisión de identifiers.** Todos los `<script>` comparten el mismo top-level lexical scope. Dos `const X` (o `let X`) con el mismo nombre en archivos distintos lanzan `SyntaxError` que aborta el segundo archivo entero — `window.X` nunca se asigna y la pantalla que lo usa queda en blanco. Pasó con `TRAINING_COLORS`/`TRAINING_LABELS` (causa del "weekly en blanco"). Para referenciar constantes compartidas: leer `window.X` o renombrar localmente (`_TC`).

### Estado y persistencia

Todo el estado vive en `App()` con `useState`/`useEffect`. Sin Context, sin Redux — props down.

- `localStorage['kcalia_v1']` con envelope `{ _v: 3, data }`.
- `saveState()` debounced 500 ms. Si tira por quota, reintenta con snapshot agresivamente podado.
- `loadState()` desempaca envelope, migra fechas legacy (`Date.toDateString()` → `YYYY-MM-DD`), poda entries > 6 meses.

### Shapes de datos

```js
userData = { name, age, sex, weight, targetWeight, height,
             goal,          // lose_fat | gain_muscle | maintain | performance
             activity, lifestyle,
             routine,       // { Lun:'strength'|'cardio'|'mixed'|'rest', ... Dom }
             personalGoal }

dailyGoals = { kcal, protein, fat, carbs, sugar }

dailyLog = [{ id, createdAt, date, time, name, foods,
              totalKcal, totalProtein, totalFat, totalCarbs, totalSugar }]
// date: 'YYYY-MM-DD' local (Constants.localDateKey)
// createdAt: ms epoch — preferir sobre parsear id

waterLog    = [{ id, date, ml, time }]
waterGoal   = 2000                                  // ml
waterPresets = null | [{ label, ml, icon }]

consumptionLimits = [{ id, icon, name, limit, period:'daily'|'weekly' }]
consumptionLog    = [{ id, limitId, date }]

notifications = [{ id, type, subtype, title, message, action?, timestamp, read }]
notifPrefs    = { enabled, mealReminders, waterReminders,
                  goalAlerts, weeklyReports, motivation, tips }

darkTheme = boolean

// envelope
{ _v: 3, data: { userData, dailyGoals, dailyLog, foodLibrary,
                 notifications, notifPrefs,
                 waterLog, waterGoal, waterPresets,
                 consumptionLimits, consumptionLog, darkTheme } }
```

### Layout + theming

- Desktop: mockup 390×844 con sombra y bordes redondeados.
- Mobile (`max-width: 600px`): full-screen, safe-area insets.
- Detección via hook reactivo `useIsMobile()` (matchMedia). Existe `_isMobile()` legacy para contextos no-hook.
- Dark mode: `darkTheme` toggle clase `dark` en `body`. Paleta como CSS vars en `:not(.dark)` y `.dark`. Componentes deben usar `var(--accent-*, #fallback)`, no hex. Script en `<head>` aplica la clase pre-mount para evitar flash.

## Componentes

| Archivo | Rol |
|---|---|
| `Constants.jsx` | Tokens, label maps, helpers: `localDateKey`, `getWeekStartKey`, `computeNutritionTargets`, `normalizeText`, `uniqueId`, `useEscapeKey`, `useBodyClass`, `useMediaQuery`, `useIsMobile` |
| `AppShell.jsx` | Phone shell, status bar, bottom nav, `Icon`/`IconButton` |
| `Dashboard.jsx` | Anillo de kcal, macros, lista de comidas, trackers de agua y consumo |
| `WaterTracker.jsx` | Card de agua (compact/expanded, presets editables) |
| `AddMeal.jsx` | Búsqueda → cantidad → carrito → registrar (también edita) |
| `Progress.jsx` | Gráfico semanal, historial, métricas |
| `WeeklyAnalysis.jsx` | Análisis profundo + sugerencias semana siguiente |
| `Profile.jsx` | Perfil, metas, rutina, prefs, theme, export/import, logout |
| `Onboarding.jsx` | Flujo inicial de 7 pasos |
| `FoodLibrary.jsx` | Biblioteca custom + DB local + manual add + autocomplete |
| `Notifications.jsx` | Centro de notificaciones + settings + `generateAppNotifications()` |

Navegación: 5 tabs (Dashboard / Progress / + (FAB) / Library / Profile). Rutas fullscreen (`onboarding`, `add`, `weekly`, `notifications`) reemplazan la bottom nav con botón Volver.

## Subsistemas

### Base de alimentos

`NUTRITION_DB` (~130 alimentos) en `FoodLibrary.jsx`, expuesta como `window.DB_FOODS`. Dos unidades:
- `unit: 'g'` — valores por gramo, escalan con la cantidad.
- `unit: 'u'` — valores absolutos por unidad (huevo, pieza de fruta, sándwich).

Cada entrada tiene aliases (`['plátano','platano','banana','guineo','cambur']`). Búsqueda accent-insensitive via `normalizeText()`.

### Búsqueda local (no AI)

`findFoodInDB()` en `FoodLibrary.jsx` — match fuzzy **local**, sin llamadas remotas:
1. Rechaza queries < 3 chars.
2. Match exacto de alias gana.
3. Sino, score por tokens compartidos completos con cobertura Jaccard ≥ 0.5.

Reemplaza heurística vieja (substring + ratio 0.3) que producía falsos positivos (`"te"` → `"tomate"`). `.claude/settings.local.json` aún tiene permiso WebFetch a `api.anthropic.com` por si se reactiva más adelante.

### Motor de notificaciones

`generateAppNotifications()` corre al montar y cada 5 min mientras la pestaña está visible (pausa en `visibilitychange:hidden`). Lee `todayMeals`, `dailyGoals`, `userData`, `todayWaterMl`, `waterGoal`, `notifPrefs` y empuja al array `notifications` (cap 50).

Categorías (cada una con toggle propio en `notifPrefs`):

| Toggle | Qué hace |
|---|---|
| `mealReminders` | Recordatorios desayuno/almuerzo/cena. Detecta comidas por hora de `createdAt`, no por nombre. |
| `waterReminders` | Hidratación vs. progreso proporcional al momento del día. Toggle separado para silenciar comidas sin perder agua. |
| `goalAlerts` | Cerca/sobre meta kcal, hito de proteína. |
| `weeklyReports` | Lunes. |
| `motivation` | Mensaje random si hay algo logueado esta semana. |
| `tips` | Tip nutricional diario (determinístico por fecha). |

Dedup: cada notificación tiene `subtype`; se suprime en ventana de 3-24h según categoría.

### Error boundary

`ScreenErrorBoundary` (en `index.html`) envuelve `renderContent()`. En production React desmonta silenciosamente el subtree si algo throw — la ruta fullscreen quedaba en blanco. El boundary muestra fallback con "Volver al inicio" y "Recargar". Se auto-resetea al cambiar `screen`.

### Export/import de datos

Profile → "Tus datos":
- **Export**: descarga `kcalia-backup-YYYY-MM-DD.json` con `{ _v, exportedAt, data }`.
- **Import**: confirma reemplazo, acepta envelope v3 o data raw (compat con backups manuales/viejos).

### Service Worker / PWA

`sw.js` cache offline-first (actual: `kcalia-v13`).
- App code (HTML/JSX): **network-first** (siempre fresco si hay red).
- CDN (React, fonts): **cache-first** (URL-versioned).
- SW borra caches viejas en `activate`.
- `index.html` escucha `updatefound`, dispara `kcalia-sw-update`, `App()` muestra banner "✨ Nueva versión" con botón recargar.

⚠️ **Bumpear `CACHE` en `sw.js` con cada cambio de JSX/HTML**, sino los PWA users quedan en la versión vieja.

## Accesibilidad

- Controles custom (selectores, toggles, badges) son `<button type="button">`.
- Selectores en Onboarding/Profile: `role="radiogroup"` con hijos `role="radio"` + `aria-checked`.
- `ToggleSwitch`: `role="switch"` + `aria-checked` + `aria-label`.
- Bottom nav: `aria-current="page"` solo en tabs reales (no FAB).
- Modales: `useEscapeKey()` compartido.

## Tareas comunes

### Agregar alimento a la DB
Editar `NUTRITION_DB` en `FoodLibrary.jsx`. Formato: `{ n:['name','alias1',...], k, p, f, c, s, u }`. Si `u:'g'` los macros son por **1 gramo**; si `u:'u'` son por **1 unidad**.

### Agregar tipo de notificación
1. Añadir clave a `DEFAULT_NOTIF_PREFS` (default `true`).
2. Bloque en `generateAppNotifications()` guardado por `prefs.<key>`.
3. Fila en `sections` de `NotificationSettingsSheet`.
4. El merge `{ ...DEFAULT_NOTIF_PREFS, ...saved.notifPrefs }` en `App()` garantiza que usuarios upgrade reciban el toggle on.

### Migrar schema localStorage
1. Bump `SCHEMA_VERSION` en `index.html`.
2. Paso de migración en `loadState()` (ver patrón `_migrateDates`).
3. Probar fresh-install y data existente.

### Después de cualquier cambio
Bump `CACHE` en `sw.js`.
