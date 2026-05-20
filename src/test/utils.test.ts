import { describe, it, expect } from 'vitest'
import { formatCountdown, formatEta, timerTone, evacuatedLives } from '../utils'

describe('formatCountdown', () => {
  it('formats the initial 47-minute countdown correctly', () => {
    expect(formatCountdown(47 * 60)).toBe('47:00')
  })

  it('zero-pads minutes and seconds below 10', () => {
    expect(formatCountdown(65)).toBe('01:05')
  })

  it('handles exactly zero seconds', () => {
    expect(formatCountdown(0)).toBe('00:00')
  })

  it('handles a mid-countdown value', () => {
    expect(formatCountdown(23 * 60 + 42)).toBe('23:42')
  })
})

describe('formatEta', () => {
  it('formats double-digit ETAs', () => {
    expect(formatEta(47)).toBe('T-47:00')
  })

  it('zero-pads single-digit ETAs', () => {
    expect(formatEta(5)).toBe('T-05:00')
  })

  it('formats the shortest tracked fragment ETA', () => {
    expect(formatEta(15)).toBe('T-15:00')
  })
})

describe('timerTone', () => {
  it('returns blue when more than 30 minutes remain', () => {
    expect(timerTone(47 * 60)).toBe('blue')
    expect(timerTone(1801)).toBe('blue')
  })

  it('returns amber between 15 and 30 minutes', () => {
    expect(timerTone(1800)).toBe('amber')
    expect(timerTone(901)).toBe('amber')
  })

  it('returns red at or below 15 minutes', () => {
    expect(timerTone(900)).toBe('red')
    expect(timerTone(0)).toBe('red')
  })
})

describe('evacuatedLives', () => {
  it('sums lives across all colonies based on readiness', () => {
    const colonies = [
      { population: '1.1M', readiness: 38 },  // 1.1 * 38 = 41.8 → 42
      { population: '740K', readiness: 26 },   // 740 * 26 = 19240
      { population: '560K', readiness: 49 },   // 560 * 49 = 27440
    ]
    const result = evacuatedLives(colonies)
    expect(result).toBe(42 + 19240 + 27440)
  })

  it('returns 0 when readiness is 0', () => {
    const colonies = [{ population: '1.1M', readiness: 0 }]
    expect(evacuatedLives(colonies)).toBe(0)
  })

  it('returns the full population count when readiness is 100', () => {
    const colonies = [{ population: '500K', readiness: 100 }]
    expect(evacuatedLives(colonies)).toBe(500 * 100)
  })

  it('handles an empty colony list', () => {
    expect(evacuatedLives([])).toBe(0)
  })
})
