# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KCALIA is a mobile-first nutritional tracking web app built in React 18 (UMD via CDN). It runs directly in the browser — no build system, no npm, no compilation step.

## Running the App

Open `index.html` in a browser. No build required. For development, edit `.jsx` files and refresh the browser.

There are no lint, test, or build commands — none are configured.

## Architecture

### Entry Point & Module System

`index.html` is the single entry point. It loads React from CDN, then loads each `.jsx` component via `<script>` tags. Each component exports itself to `window` (e.g., `window.Dashboard = Dashboard`). The root `App()` function is also defined in `index.html`.

### State Management

All global state lives in `App()` in `index.html`, managed with `useState`/`useEffect`. State is persisted to `localStorage` under the key `kcalia_v1` via `loadState()` / `saveState()`. There is no Context API or Redux — state is passed as props.

### Key State Shapes

```js
// User profile
userData = { name, age, weight, height, goal, activityLevel, lifestyle, occupation, routine }
// goal: 'lose_fat' | 'gain_muscle' | 'maintain' | 'performance'

// Nutritional targets
dailyGoals = { kcal, protein, fat, carbs, sugar }  // grams/kcal

// Meal entries (all days merged in one array)
dailyLog = [{ id, date, name, foods: [...], totalKcal, totalProtein, ... }]

// localStorage root
{ userData, dailyGoals, dailyLog, foodLibrary, notifications, notifPrefs }
```

### Screen Components

| File | Screen |
|------|--------|
| `AppShell.jsx` | Layout shell, status bar, bottom nav |
| `Dashboard.jsx` | Today's intake: calorie ring, macros, meal list |
| `AddMeal.jsx` | Food search → quantity picker → cart → log meal |
| `Progress.jsx` | Weekly bar chart, history, trend metrics |
| `WeeklyAnalysis.jsx` | Deep weekly analytics + goal suggestions |
| `Profile.jsx` | User data, goal editing, notification prefs, logout |
| `Onboarding.jsx` | 7-step first-time setup flow |
| `FoodLibrary.jsx` | Custom food library + AI nutritional lookup |
| `Notifications.jsx` | Notification center; auto-generated every 5 min |

Navigation is a 5-tab bottom bar. Fullscreen overlays (Onboarding, Notifications, WeeklyAnalysis, FoodLibrary detail) hide the bottom nav.

### Nutrition Database

An embedded `NUTRITION_DB` array (~84 foods) lives in `index.html`. Two unit types:
- `unit: 'g'` — per-gram values, scaled by quantity input
- `unit: 'u'` — per-unit values for discrete items (eggs, fruit)

### Notification Engine

`generateAppNotifications()` runs on a 5-minute interval. It reads `todayMeals`, `dailyGoals`, and `notifPrefs` to push reminders, alerts, motivational tips, and weekly reports into the `notifications` array.

### Responsive Layout

- Desktop: 390×844px iPhone-like mockup (shadow, rounded corners)
- Mobile (`max-width: 500px`): full-screen, safe-area insets applied
- Detection via `_isMobile()` at the 500px breakpoint

### Icons & Theming

SVG icons are defined as strings in an `ICONS` object and rendered with `dangerouslySetInnerHTML`. Colors are hard-coded: primary gold `#F5D040`, warm browns, pastel accents. No CSS framework is used.

### AI Food Lookup

`FoodLibrary.jsx` can call the Claude API (`api.anthropic.com`) to retrieve nutritional data for foods not in the local database. The `.claude/settings.local.json` grants WebFetch permission to that endpoint.
