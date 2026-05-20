# Countdown Timer Specification

## Purpose

The Countdown Timer is the global urgency anchor for the entire SPA. It keeps the first-impact clock visible at all times and escalates the dashboard mood as time decays.

## Narrative Role

This element answers the only question no operator can ignore: how much time is left before the first colony is hit?

## Placement

- Persistent command HUD in the top shell rather than one of the 2x2 panel cells
- Visually paired with the scenario briefing so the timer feels central, not auxiliary

## Behavior

- Starts at 47 minutes
- Ticks down once per second
- Changes visual urgency by threshold
- Continues running while the operator works anywhere else on the page

## Thresholds

- Blue state: more than 30 minutes remaining
- Amber state: 15 to 30 minutes remaining
- Red state: 15 minutes or less remaining

## Data Model

```ts
type CountdownState = {
  secondsRemaining: number
  display: string
  tone: 'blue' | 'amber' | 'red'
}
```

## Edge Cases

- Timer must stop cleanly at zero and never go negative
- Visual state transitions should not interrupt interaction with the rest of the app
- Timestamp formatting in Mission Log should remain consistent with the active timer output

## Acceptance Criteria

- The timer is visible on first load without scrolling
- Operators can read the countdown instantly on desktop and mobile widths
- Threshold changes visibly affect urgency styling
- Timer state can be reused by other features for alerts and event stamps
- The timer does not displace the 2x2 operational grid