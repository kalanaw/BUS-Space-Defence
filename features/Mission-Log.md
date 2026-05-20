# Mission Log Specification

## Purpose

The Mission Log provides the operational audit trail for the replacement command system. It records system telemetry, operator actions, and high-priority alerts in timestamped order.

## Narrative Role

This panel answers: what just happened, who changed the situation, and what matters right now?

## Panel Contents

- Countdown-relative timestamp
- Message body
- Log classification: alert, command, system
- Scrollable event history with newest entries first
- Summary metric showing lives moved to safety

## Interactions

- Automatically append events when evacuation phases change
- Automatically append events when defense assets are armed, assigned, released, or blocked
- Automatically append events when threats are neutralized or tracking degrades
- Present live updates without navigating away from the dashboard

## Data Model

```ts
type MissionEntry = {
  id: number
  stamp: string
  level: 'alert' | 'command' | 'system'
  text: string
}
```

## States

- Alert: critical risk or operator attention required
- Command: explicit human-issued operational action
- System: telemetry, automation, or platform state update

## Edge Cases

- Rapid user interactions can create many events in a short span
- Log ordering must keep newest messages visible first
- Identical action patterns should still create independently understandable entries

## Acceptance Criteria

- Mission events appear immediately after related user actions
- Log styles make alert severity and event origin easy to scan
- Timestamps stay aligned to the active countdown context
- The panel remains readable when the list grows long
- The log preserves enough detail to reconstruct command decisions during the demo