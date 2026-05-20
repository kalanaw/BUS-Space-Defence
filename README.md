# AEGIS Space Defence

Single-page React + TypeScript command dashboard for a late-stage orbital defense crisis in year 2147. The application presents four operational panels in a 2x2 grid and keeps the impact countdown visible as a persistent command HUD.

## Scenario

A rogue asteroid swarm breached the Kuiper defense perimeter. Twelve fragments are inbound toward Arcadia Ring, Orion Spindle, and Kepler Haven. The original command system was destroyed. This dashboard is the emergency replacement for tracking threats, coordinating evacuations, and assigning orbital defenses.

## Features

- Threat Board for fragment triage, severity tracking, and defense assignment
- Evacuation Planner for colony readiness and phase advancement
- Defense Grid for selecting assets, changing readiness, and managing locks
- Mission Log for operator commands and system telemetry
- Countdown Timer as a persistent global emergency HUD

## Tech Stack

- React 19
- TypeScript
- Vite
- Custom CSS design tokens and layout

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Notes

- The current implementation is frontend-only and uses seeded in-browser state.
- Panel interactions are intentionally linked: assigning defenses updates threats, evacuation actions write to the mission log, and the timer drives global urgency styling.
- Feature specifications live in the `features/` directory.
