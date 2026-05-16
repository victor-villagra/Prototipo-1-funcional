# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow After Code Changes

After every code modification, briefly explain what was changed (2-3 lines max). Then always ask:
"¿Quieres que haga el push a GitHub?"
- If the user says yes → run `git add`, `git commit`, and `git push`.
- If the user says no → stop there.

## Project Overview

KCALIA is a mobile-first nutritional tracking web app built in React 18 (UMD via CDN). It runs directly in the browser — no build system, no npm, no compilation step. It is also installable as a PWA (manifest + service worker).

## Running the App

Open `index.html` in a browser, or serve the folder over HTTP (the service worker requires `http(s)://`, not `file://`). No build required. For development, edit `.jsx` files and refresh the browser.

There are no lint, test, or build commands configured. The only programmatic verification used so far has been ad-hoc Node + jsdom render tests done outside the repo.

## Architecture

### Entry Point & Module System

`index.html` is the single entry point. It loads React (production builds) from `unpkg.com`, then loads each `.jsx` file as a plain `<script>` tag. Each file exposes its public surface by mutating `window` directly (e.g. `Object.assign(window, { Dashboard })`). The root `App()` function and the `ScreenErrorBoundary` class are defined in the inline script at the bottom of `index.html`.

**Identifier-collision gotcha.** All `<script src=...>` tags share the same top-level lexical scope. Two top-level `const X` (or `let X`) declarations across different files with the same name produce `SyntaxError: Identifier 'X' has already been declared`, which aborts the entire second file — `window.X` then never gets assigned and any screen that depends on it renders blank. This actually happened with `TRAINING_COLORS`/`TRAINING_LABELS` (both declared in `Constants.jsx` and re-declared in `WeeklyAnalysis.jsx`), and was the root cause of the long-standing "weekly analysis goes blank" bug. When you need to reference a shared constant from another file, either read from `window.X` directly or declare under a different name (e.g. `_TC`).

### State Management

All global state lives in `App()` in `index.html`, managed with `useState`/`useEffect`. State is persisted to `localStorage` under the key `kcalia_v1` via `loadState()` / `saveState()`, debounced 500 ms to avoid writing on every keystroke. There is no Context API or Redux — state is passed as props.

Schema is versioned (`SCHEMA_VERSION = 3`) and the envelope is `{ _v, data }`. `loadState()` unwraps the envelope, runs `_migrateDates()` (converts legacy `Date.toDateString()` strings to `YYYY-MM-DD` local-date keys), and prunes entries older than 6 months from `dailyLog` / `waterLog`. If `localStorage.setItem` throws (quota), `saveState` retries with an aggressively pruned snapshot.

### Key State Shapes

```js
// User profile (filled by Onboarding, editable from Profile)
userData = {
  name, age, sex,                         // basics
  weight, targetWeight, height,           // measurements
  goal,                                   // 'lose_fat' | 'gain_muscle' | 'maintain' | 'performance'
  activity, lifestyle,                    // see Constants.jsx for valid keys
  routine,                                // { Lun: 'strength'|'cardio'|'mixed'|'rest', ... Dom: ... }
  personalGoal,                           // optional free-text motivation
}

// Nutritional targets
dailyGoals = { kcal, protein, fat, carbs, sugar }

// Meal entries (all days merged in one array, sorted by insertion order)
dailyLog = [{ id, createdAt, date, time, name, foods: [...], totalKcal, totalProtein, totalFat, totalCarbs, totalSugar }]
// date is 'YYYY-MM-DD' local-date key (see Constants.localDateKey)
// createdAt is ms epoch — preferred over parsing id for "what hour was this?" logic

// Water tracking
waterLog = [{ id, date, ml, time }]
waterGoal = 2000                  // ml; user-configurable
waterPresets = null | [{ label, ml, icon }]   // custom quick-add chips

// Consumption limits (arbitrary "max N per day/week" for items like energy drinks)
consumptionLimits = [{ id, icon, name, limit, period: 'daily'|'weekly' }]
consumptionLog    = [{ id, limitId, date }]

// Notifications
notifications = [{ id, type, subtype, title, message, action?, timestamp, read }]
notifPrefs    = { enabled, mealReminders, waterReminders, goalAlerts, weeklyReports, motivation, tips }

// Theme
darkTheme = boolean

// localStorage envelope
{ _v: 3, data: { userData, dailyGoals, dailyLog, foodLibrary, notifications, notifPrefs,
                 waterLog, waterGoal, waterPresets, consumptionLimits, consumptionLog, darkTheme } }
```

### Component Files

| File | Role |
|------|------|
| `Constants.jsx` | Theme tokens, label maps, helpers (`localDateKey`, `getWeekStartKey`, `computeNutritionTargets`, `normalizeText`, `uniqueId`, `useEscapeKey`, `useBodyClass`, `useMediaQuery`, `useIsMobile`) |
| `AppShell.jsx` | Phone shell, status bar, bottom nav, shared `Icon`/`IconButton` |
| `Dashboard.jsx` | Today's intake: calorie ring, macros, meal list, water + consumption trackers |
| `WaterTracker.jsx` | Water card on the dashboard (compact + expanded states, custom presets) |
| `AddMeal.jsx` | Food search → quantity picker → cart → log meal (also handles meal editing) |
| `Progress.jsx` | Weekly bar chart, history list, trend stats |
| `WeeklyAnalysis.jsx` | Deeper weekly analytics, auto-generated insights, next-week goal suggestions |
| `Profile.jsx` | Profile data, goal/activity/routine editing, notif prefs, theme, data export/import, logout |
| `Onboarding.jsx` | 7-step first-time setup flow |
| `FoodLibrary.jsx` | Custom food library + local DB browser, manual add, autocomplete from local DB |
| `Notifications.jsx` | Notification center, settings sheet, and `generateAppNotifications()` engine |

Navigation is a 5-tab bottom bar (Dashboard / Progress / + (FAB) / Library / Profile). Fullscreen routes (`onboarding`, `add`, `weekly`, `notifications`) replace the bottom nav with a back button.

### Nutrition Database

An embedded `NUTRITION_DB` array (~130 foods) lives in `FoodLibrary.jsx` and is exposed via `window.DB_FOODS`. Two unit types:
- `unit: 'g'` — per-gram values, scaled by quantity input
- `unit: 'u'` — per-unit absolute values for discrete items (eggs, fruit, sandwiches)

Each entry has an alias list (e.g. `['plátano', 'platano', 'banana', 'guineo', 'cambur']`) so users can find foods with whatever spelling/regionalism they know. Search is accent-insensitive via `normalizeText()`.

### Local Nutrition Lookup (formerly "AI lookup")

`FoodLibrary.jsx`'s "Autocompletar" button calls `findFoodInDB()`, which is a **local** tokenized fuzzy match against `NUTRITION_DB`:
1. Reject queries shorter than 3 chars.
2. Exact alias match wins immediately.
3. Otherwise score by shared whole-word tokens, requiring ≥ 0.5 Jaccard-style coverage.

This replaces an earlier substring-similarity heuristic with a 0.3 threshold that produced bad matches for short queries (`"te"` → `"tomate"`, `"pa"` → `"papaya"`). There is currently **no** call out to the Claude API or any other remote service — everything resolves from the bundled database. (`.claude/settings.local.json` still has WebFetch permission to `api.anthropic.com`, kept for possible future use.)

### Notification Engine

`generateAppNotifications()` in `Notifications.jsx` is called once on app load and every 5 minutes thereafter while the tab is visible. The interval is paused on `visibilitychange` (hidden) and resumed when visible. It reads `todayMeals`, `dailyGoals`, `userData`, `todayWaterMl`, `waterGoal`, and `notifPrefs` to push reminders, alerts, motivation, weekly reports, and tips into the `notifications` array (capped at 50).

Notification categories (each has its own pref toggle):
- `mealReminders` — breakfast/lunch/dinner nags, detect existing meals by hour-of-`createdAt`, not by name
- `waterReminders` — hydration target vs. proportional time-of-day expected progress (separate toggle, so users can mute meal nags without losing water nudges)
- `goalAlerts` — over/near calorie goal, protein milestone
- `weeklyReports` — Mondays
- `motivation` — random message if user has logged anything this week
- `tips` — daily nutrition tip (deterministic by date)

Deduplication: each notification has a `subtype` and is suppressed for a category-specific window (typically 3–24 hours).

### Responsive Layout

- Desktop: 390 × 844 px iPhone-like mockup centered with shadow and rounded corners
- Mobile (`max-width: 600px`): full-screen, safe-area insets applied
- Detection via `useIsMobile()` hook (built on `window.matchMedia`) so rotation / resize re-renders correctly. The legacy `_isMobile()` predicate is still exported for non-hook contexts but new code should use the hook.

### Theming (Light + Dark)

Theme is driven by a single boolean `darkTheme` in `App()`. A class `dark` is toggled on `document.body`; `index.html` defines the full palette as CSS custom properties under `body:not(.dark)` and `body.dark`. Components should consume colors as `var(--accent-gold-soft, #FFF3C4)` rather than hard-coding hex, so dark-mode darkens the surface automatically. The `<head>` runs an early script that reads `darkTheme` from `kcalia_v1` and applies the class before React mounts, avoiding a flash.

### Error Handling

`ScreenErrorBoundary` (class component in `index.html`) wraps `renderContent()`. If a screen throws during render in production builds, React would otherwise silently unmount the subtree — fullscreen routes like `weekly` would just go blank with no way back. The boundary renders a fallback with two recovery actions: "Volver al inicio" (navigate dashboard) and "Recargar" (reload). It auto-resets when `screen` changes.

### Data Export / Import

Profile → "Tus datos" lets users:
- **Export** a JSON snapshot of the full state envelope (`{ _v, exportedAt, data }`) as `kcalia-backup-YYYY-MM-DD.json`.
- **Import** that JSON back, with a confirm-modal warning that current data will be replaced. The import accepts both the v3 envelope and a raw data object (so manual edits / older backups still load).

### Service Worker / PWA

`sw.js` registers an offline-first cache (current version `kcalia-v13`). App-code files (HTML/JSX) use a **network-first** strategy so users get fresh code when online; CDN resources (React, Google Fonts) are **cache-first** since they're URL-versioned. The SW deletes old caches on `activate`. The registration script in `index.html` listens for `updatefound`, fires a custom `kcalia-sw-update` event, and `App()` shows an "✨ Nueva versión disponible" banner with a reload button.

**Bump `CACHE` in `sw.js` whenever any JSX/HTML changes** so users pick up new code on their next visit. (Recent versions: v9 → v10 production-React migration, v11 weekly analysis UX, v12 ErrorBoundary, v13 weekly analysis crash fix.)

### Icons

SVG icons are defined as functions returning HTML strings in an `ICONS` object in `AppShell.jsx` and rendered with `dangerouslySetInnerHTML`. The `Icon` component wraps the lookup and the `IconButton` component provides a 44×44 accessible tap target around any icon.

### Accessibility

- All custom controls (selectors, toggles, badges) are `<button>` elements with `type="button"`. Onboarding/Profile selectors use `role="radio"` + `aria-checked` grouped under `role="radiogroup"`.
- `ToggleSwitch` is `role="switch"` + `aria-checked` with an `aria-label`.
- Bottom-nav tabs set `aria-current="page"` only on real navigable tabs (not the FAB).
- Modals listen for Escape via the shared `useEscapeKey()` hook.

## Common Tasks

### Adding a food to the database
Edit `NUTRITION_DB` in `FoodLibrary.jsx`. Format: `{ n: ['name', 'alias1', ...], k, p, f, c, s, u }` where `u` is `'g'` (per-gram) or `'u'` (per-unit). For `'g'` entries `k/p/f/c/s` are per **1 gram**; for `'u'` they are per **1 unit**.

### Adding a new notification type
1. Add to `DEFAULT_NOTIF_PREFS` in `Notifications.jsx` (default true).
2. Add a generation block in `generateAppNotifications()` guarded by `prefs.<yourKey>`.
3. Add a row in the `sections` array inside `NotificationSettingsSheet` so users can toggle it.
4. The merge `{ ...DEFAULT_NOTIF_PREFS, ...saved.notifPrefs }` in `App()` ensures upgrading users get the new toggle on by default.

### Changing the localStorage schema
1. Bump `SCHEMA_VERSION` in `index.html`.
2. Add a migration step in `loadState()` (look at `_migrateDates` for the pattern).
3. Test with both fresh-install and existing-data localStorage.

### After any code change
Bump `CACHE` in `sw.js`. Otherwise PWA users will keep loading the previous cached version.
