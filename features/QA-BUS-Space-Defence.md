# QA Report: BUS-Space-Defence

**Repository:** https://github.com/kalanaw/BUS-Space-Defence  
**Stack:** React + TypeScript + Vite  
**Reviewed:** `src/App.tsx`, `src/App.css`, `src/index.css`, `src/main.tsx`

---

## ✅ What works well

- **TypeScript types** are thorough and consistent throughout. All types are defined at the top of the file. No use of `any`.
- **React hooks** are used correctly. `useEffect` has the correct dependency array `[]` for the timer.
- **Immutable state updates** are consistent — always using `.map()` with spread, never direct mutation.
- **CSS custom properties** (design tokens) are used consistently. The design system is solid.
- **Responsive layout** — two breakpoints (1080px + 720px) collapse the grid to a single column correctly.
- **Accessibility**: `aria-label`, `role="log"`, `aria-live="polite"`, and `aria-hidden` on the progress bar are all present and correct.
- `StrictMode` is enabled in `main.tsx`. ✓

---

## 🐛 Bugs

### 1. Stale closure on mission log timestamps — **Critical**

```tsx
// appendMissionLog uses secondsRemaining from closure — not the current value
stamp: `T-${formatCountdown(secondsRemaining)}`,
```

All log entries will receive the same timestamp as when the component last rendered. `secondsRemaining` should be passed as a parameter to `appendMissionLog`, or tracked via a `useRef`.

---

### 2. `evacuatedLives` calculation is broken — **Critical**

```tsx
const evacuatedLives = colonies.reduce((total, colony) =>
  total + Math.round(
    (Number(colony.population.replace(/[^\d.]/g, '')) || 0) * colony.readiness
  ), 0)
```

`population` is a string like `"1.1M"`. After `replace`, it becomes `"1.1"`, so `Number("1.1") = 1.1`. Multiplied by `readiness` (e.g. 38), the result is `~41` — not `41,800,000`. The number displayed in the UI ("Lives moved to safety") is essentially meaningless. The `"M"` multiplier needs to be parsed and applied explicitly.

---

### 3. "Fragments tracked" is hardcoded to `12` — **High**

```tsx
<strong>12</strong>
```

Should be dynamic, e.g. `{threats.length}` or `{threats.filter(t => t.status !== 'Neutralized').length}`. Once threats are neutralized, the count stays at 12.

---

### 4. `toggleAssetReadiness` has no handler for `Engaged` status — **Medium**

```tsx
if (asset.status === 'Standby') { ... }
else if (asset.status === 'Armed') { ... }
else if (asset.status === 'Cooling') { ... }
// No case for 'Engaged'
```

Clicking "Cycle Readiness" on an engaged asset silently does nothing. If this is intentional, the button should be disabled and the user should receive feedback.

---

## ⚠️ Logic Issues

### 5. Assignment is allowed when interceptors reach 0 — **High**

`assignSelectedAsset` decrements `interceptors` down to `0` and still allows the assignment to go through. There should be a guard: if `asset.interceptors === 0`, block the assignment and log a warning.

---

### 6. "Assign" button is not disabled when asset is already locked — **Medium**

If a defense asset is already assigned to a threat, clicking "Assign Selected Asset" on another threat produces a log warning but no visual feedback. The button should be disabled (or visually indicate the locked state) when `selectedAsset.assignedThreatId !== null`.

---

### 7. "Mark Neutralized" is available without an assigned asset — **Low**

A threat can be manually marked as neutralized even if no defense asset is engaged against it. This may be intentional design, but it should be documented or restricted to avoid bypassing game mechanics.

---

## 🎨 CSS / Design Issues

### 8. No scroll limit on `threat-list` and `colony-list` — **High**

`log-list` correctly has `max-height: 35rem` and `overflow: auto`. The `threat-list` and `colony-list` panels have no equivalent — with 12 threats, the Threat Board panel becomes excessively tall and breaks the dashboard layout.

**Fix:**
```css
.threat-list,
.colony-list {
  max-height: 40rem;
  overflow: auto;
}
```

---

### 9. `Armed` status is visually identical to `Standby` and `Cooling` — **Medium**

```css
.asset-state--standby,
.asset-state--cooling,
.asset-state--armed {
  color: #9ceeff; /* all blue */
}
```

`Armed` should use a distinct color (e.g. green) to visually communicate that the asset is ready to fire, as opposed to `Standby` (idle) or `Cooling` (unavailable).

---

### 10. Google Fonts may not be loaded — **Medium**

The CSS references `'Space Grotesk'` and `'Rajdhani'` as font families, but `index.html` (not included in the zip) should be verified to include the corresponding `<link>` tags. Without them, the UI silently falls back to system fonts and the intended aesthetic is lost.

---

## 🔧 Code Quality

### 11. `appendMissionLog` should be wrapped in `useCallback` — **Low**

The function is redefined on every render. It also captures `secondsRemaining` from the closure, which is stale (see Bug #1). Wrapping it in `useCallback` and using a ref for the timer value would fix both issues.

---

### 12. Initial data should be moved out of the module scope — **Low**

`initialThreats`, `initialColonies`, and `initialDefenseAssets` are large constant arrays defined directly in `App.tsx`. They should be extracted into a separate `data.ts` or `constants.ts` file to keep the component file readable.

---

### 13. ID generation in `appendMissionLog` is fragile — **Low**

```tsx
id: currentLog[0]?.id ? currentLog[0].id + 1 : 1,
```

This works only because the log is prepend-sorted. It would break if the sort order changed or if entries were deleted. Use `crypto.randomUUID()` or an incrementing `useRef` counter instead.

---

## Priority Summary

| Priority | # | Issue |
|---|---|---|
| 🔴 Critical | 2 | `evacuatedLives` calculation is wrong |
| 🔴 Critical | 1 | Stale closure on mission log timestamps |
| 🟠 High | 3 | "Fragments tracked" is hardcoded |
| 🟠 High | 5 | Assignment allowed with 0 interceptors |
| 🟠 High | 8 | No scroll limit on threat/colony lists |
| 🟡 Medium | 6 | Assign button not disabled when asset is locked |
| 🟡 Medium | 9 | Armed vs Standby look identical |
| 🟡 Medium | 10 | Verify Google Fonts are loaded in index.html |
| 🟢 Low | 4, 7, 11, 12, 13 | Minor logic, UX, and code quality items |
