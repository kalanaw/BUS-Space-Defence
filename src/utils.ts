export function formatCountdown(secondsRemaining: number): string {
  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatEta(minutes: number): string {
  return `T-${String(minutes).padStart(2, '0')}:00`
}

export function timerTone(secondsRemaining: number): 'red' | 'amber' | 'blue' {
  if (secondsRemaining <= 900) return 'red'
  if (secondsRemaining <= 1800) return 'amber'
  return 'blue'
}

export function evacuatedLives(
  colonies: Array<{ population: string; readiness: number }>,
): number {
  return colonies.reduce(
    (total, colony) =>
      total +
      Math.round(
        (Number(colony.population.replace(/[^\d.]/g, '')) || 0) * colony.readiness,
      ),
    0,
  )
}
