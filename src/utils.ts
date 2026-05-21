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

export function parsePopulation(population: string): number {
  const match = population.match(/^([\d.]+)\s*([KkMm]?)$/)
  if (!match) return 0
  const value = parseFloat(match[1])
  const suffix = match[2].toUpperCase()
  if (suffix === 'M') return value * 1_000_000
  if (suffix === 'K') return value * 1_000
  return value
}

export function evacuatedLives(
  colonies: Array<{ population: string; readiness: number }>,
): number {
  return colonies.reduce(
    (total, colony) =>
      total +
      Math.round((parsePopulation(colony.population) * colony.readiness) / 100),
    0,
  )
}
