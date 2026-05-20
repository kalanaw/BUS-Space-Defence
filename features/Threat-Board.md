# Threat Board Specification

## Purpose

The Threat Board is the primary triage surface for the AEGIS crew. It presents all 12 inbound asteroid fragments, their collision lanes, severity, confidence, and current intercept status so operators can decide what must be targeted first.

## Narrative Role

This panel answers the command question: which fragment kills people first if nothing is done?

## Panel Contents

- Fragment identifier and call sign
- Target colony or orbital lane
- ETA to impact
- Severity classification: Critical, High, Medium
- Trajectory confidence percentage
- Engagement state: Inbound, Targeted, Intercept Window, Neutralized
- Action controls for assigning the selected defense asset and marking a fragment as neutralized

## Interactions

- Filter visible threats by `All`, `Critical`, `Assigned`, and `Unassigned`
- Assign the currently selected defense asset from Defense Grid to a threat
- Mark a threat as neutralized to simulate a successful intercept or fragmentation event
- Reflect assignment state back into the Defense Grid and Mission Log

## Data Model

```ts
type Threat = {
  id: string
  fragment: string
  target: string
  etaMinutes: number
  severity: 'Critical' | 'High' | 'Medium'
  confidence: number
  trajectory: string
  status: 'Inbound' | 'Targeted' | 'Intercept Window' | 'Neutralized'
  assignedAssetId: string | null
}
```

## States

- Default: all tracked fragments visible and sorted by urgency
- Filtered: list shows subset without losing access to primary actions
- Assigned: targeted fragment shows assigned state and logs the action
- Neutralized: fragment stays visible for auditability but can no longer be re-neutralized
- Critical warning: unresolved critical fragments should remain visually dominant

## Edge Cases

- Selected defense asset is cooling and cannot be assigned
- Selected defense asset is already locked to another fragment
- Threat is already neutralized
- No asset is selected when an operator tries to assign one

## Acceptance Criteria

- Operators can review all 12 threats without navigating away from the page
- Critical fragments are easy to distinguish at a glance
- Assigning an asset changes both threat and defense state consistently
- Neutralizing a threat updates the mission log and frees or cools the assigned asset as designed
- Filters do not hide state changes or break threat actions