# Evacuation Planner Specification

## Purpose

The Evacuation Planner tracks the readiness of Arcadia Ring, Orion Spindle, and Kepler Haven so command can prioritize extraction under rapidly collapsing timelines.

## Narrative Role

This panel answers: who can still be moved, how fast, and along which corridor?

## Panel Contents

- Colony name
- Civilian population
- Assigned evacuation route or convoy path
- Route risk classification
- Readiness percentage
- Phase state: Standby, Boarding, Launch, Cleared
- Action control for advancing the evacuation phase

## Interactions

- Advance a colony from one evacuation phase to the next
- Increase readiness percentage as phase changes occur
- Write command entries to the Mission Log when phases advance
- Surface average readiness in the panel summary chip

## Data Model

```ts
type Colony = {
  id: string
  name: string
  population: string
  route: string
  routeRisk: 'Elevated' | 'Critical' | 'Stable'
  readiness: number
  stage: 'Standby' | 'Boarding' | 'Launch' | 'Cleared'
}
```

## States

- Standby: route exists but no mass movement has begun
- Boarding: staging and transfer operations active
- Launch: evacuation vessels are leaving dock or gate
- Cleared: colony evacuation has completed for this simulation slice

## Edge Cases

- A cleared colony should not keep advancing
- Route risk can remain high even when readiness is improving
- Low readiness with low ETA should remain visually alarming

## Acceptance Criteria

- All 3 colonies are visible simultaneously
- Operators can advance each colony independently
- Readiness bars update with each phase change
- Phase changes append meaningful entries to the Mission Log
- The panel maintains readability on smaller screens without truncating the route context