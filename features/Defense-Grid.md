# Defense Grid Specification

## Purpose

The Defense Grid manages AEGIS orbital batteries and interception platforms. It lets operators choose the current asset, inspect readiness, and commit or release locks against inbound fragments.

## Narrative Role

This panel answers: what weapons still work, where are they aimed, and what coverage gaps remain?

## Panel Contents

- Asset name
- Coverage sector or protected lane
- Interceptor inventory
- Charge percentage
- Operational state: Standby, Armed, Engaged, Cooling
- Current lock or open status
- Controls for selecting the active asset, cycling readiness, and releasing a lock

## Interactions

- Select one asset as the active targeting source for Threat Board actions
- Toggle readiness between standby and armed when valid
- Recover cooling assets into armed state through a readiness cycle
- Release an existing target lock and return the fragment to manual supervision

## Data Model

```ts
type DefenseAsset = {
  id: string
  name: string
  coverage: string
  interceptors: number
  charge: number
  status: 'Standby' | 'Armed' | 'Engaged' | 'Cooling'
  assignedThreatId: string | null
}
```

## States

- Standby: available but not primed
- Armed: ready for rapid assignment
- Engaged: actively committed to a threat
- Cooling: temporarily unavailable after heavy use or release

## Edge Cases

- Asset has no remaining interceptor depth
- Cooling asset is selected but cannot accept assignments
- Asset is already locked to another threat
- Released lock should revert the paired threat status unless already neutralized

## Acceptance Criteria

- Operators can always identify which asset is currently selected
- Asset status changes are reflected visually and in the mission log
- Assignments made from the Threat Board consume asset resources consistently
- Releasing a lock updates both the asset and the corresponding threat
- Cooling and engaged states are distinct enough to avoid operator error