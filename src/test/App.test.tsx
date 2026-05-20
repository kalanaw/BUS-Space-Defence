import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Suppress CSS import errors in jsdom
// App.css is imported in App.tsx; jsdom ignores style content

describe('App — initial render', () => {
  it('displays the dashboard title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Space Defence Command Dashboard/i })).toBeInTheDocument()
  })

  it('shows all 4 stat cards with correct initial values', () => {
    render(<App />)
    const strip = screen.getByRole('region', { name: 'Global status overview' })
    expect(within(strip).getByText('12')).toBeInTheDocument()   // Fragments tracked
    expect(within(strip).getByText('5')).toBeInTheDocument()    // Critical threats
    expect(within(strip).getByText('0')).toBeInTheDocument()    // Active intercepts
    expect(within(strip).getByText('2.4M')).toBeInTheDocument() // Population
  })

  it('shows the countdown timer', () => {
    render(<App />)
    expect(screen.getByText(/First impact in/i)).toBeInTheDocument()
    expect(screen.getByText('47:00')).toBeInTheDocument()
  })

  it('renders all 4 panel headings', () => {
    render(<App />)
    expect(screen.getByText('Collision fragments and impact lanes')).toBeInTheDocument()
    expect(screen.getByText('Colony extraction readiness')).toBeInTheDocument()
    expect(screen.getByText('Orbital batteries and lattice control')).toBeInTheDocument()
    expect(screen.getByText('Operator actions and telemetry')).toBeInTheDocument()
  })
})

describe('Threat Board — filtering', () => {
  it('shows all 12 fragments by default', () => {
    render(<App />)
    const assignButtons = screen.getAllByRole('button', { name: /Assign Selected Asset/i })
    expect(assignButtons).toHaveLength(12)
  })

  it('filters to only Critical threats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Critical' }))
    const assignButtons = screen.getAllByRole('button', { name: /Assign Selected Asset/i })
    expect(assignButtons).toHaveLength(5) // KX-01, 03, 05, 08, 11
  })

  it('restores all threats when All filter is re-selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Critical' }))
    await user.click(screen.getByRole('button', { name: 'All' }))
    const assignButtons = screen.getAllByRole('button', { name: /Assign Selected Asset/i })
    expect(assignButtons).toHaveLength(12)
  })

  it('Unassigned filter shows all threats when none are assigned', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Unassigned' }))
    const assignButtons = screen.getAllByRole('button', { name: /Assign Selected Asset/i })
    expect(assignButtons).toHaveLength(12)
  })

  it('Assigned filter shows no threats initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Assigned' }))
    expect(screen.queryAllByRole('button', { name: /Assign Selected Asset/i })).toHaveLength(0)
  })
})

describe('Defense Grid — asset selection', () => {
  it('shows Aegis Lance Array as selected by default', () => {
    render(<App />)
    const selectedBtns = screen.getAllByRole('button', { name: /Asset Selected/i })
    expect(selectedBtns).toHaveLength(1)
    expect(selectedBtns[0]).toBeInTheDocument()
  })

  it('switches selection when another asset is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    const selectButtons = screen.getAllByRole('button', { name: /^Select Asset$/i })
    await user.click(selectButtons[0]) // select Bastion Coil Net
    expect(screen.getAllByRole('button', { name: /Asset Selected/i })).toHaveLength(1)
    expect(screen.queryAllByRole('button', { name: /^Select Asset$/i })).toHaveLength(3)
  })
})

describe('Threat assignment', () => {
  it('assigns the selected asset to a threat', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Aegis Lance Array is selected by default; assign it to KX-01
    const assignButtons = screen.getAllByRole('button', { name: /Assign Selected Asset/i })
    await user.click(assignButtons[0])

    // Threat status should change from "Inbound" to "Targeted" or "Intercept Window"
    expect(screen.getByText('Targeted')).toBeInTheDocument()
  })

  it('shows the threat under the Assigned filter after assignment', async () => {
    const user = userEvent.setup()
    render(<App />)
    const assignButtons = screen.getAllByRole('button', { name: /Assign Selected Asset/i })
    await user.click(assignButtons[0])
    await user.click(screen.getByRole('button', { name: 'Assigned' }))
    expect(screen.getAllByRole('button', { name: /Assign Selected Asset/i })).toHaveLength(1)
  })

  it('active intercepts stat increments after assignment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: /Assign Selected Asset/i })[0])
    expect(screen.getByText('1')).toBeInTheDocument() // active intercepts
  })
})

describe('Mark Neutralized', () => {
  it('the Mark Neutralized button starts enabled', () => {
    render(<App />)
    const neutralizeBtn = screen.getAllByRole('button', { name: /Mark Neutralized/i })[0]
    expect(neutralizeBtn).not.toBeDisabled()
  })

  it('disables the Mark Neutralized button after clicking it', async () => {
    const user = userEvent.setup()
    render(<App />)
    const neutralizeBtn = screen.getAllByRole('button', { name: /Mark Neutralized/i })[0]
    await user.click(neutralizeBtn)
    expect(neutralizeBtn).toBeDisabled()
  })

  it('changes threat status to Neutralized', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: /Mark Neutralized/i })[0])
    expect(screen.getByText('Neutralized')).toBeInTheDocument()
  })
})

describe('Evacuation Planner', () => {
  it('renders all 3 colonies', () => {
    render(<App />)
    // Colony names also appear in threat targets, so use getAllByText
    expect(screen.getAllByText('Arcadia Ring').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Orion Spindle').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Kepler Haven').length).toBeGreaterThanOrEqual(1)
    // Verify colony-specific text that only appears in the evacuation panel
    expect(screen.getByText('1.1M civilians')).toBeInTheDocument()
    expect(screen.getByText('740K civilians')).toBeInTheDocument()
    expect(screen.getByText('560K civilians')).toBeInTheDocument()
  })

  it('advances colony stage when Advance Phase is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Orion Spindle is on Standby; clicking Advance Phase moves it to Boarding
    const advanceBtns = screen.getAllByRole('button', { name: /Advance Phase/i })
    await user.click(advanceBtns[1]) // Orion Spindle (index 1)
    const boardingLabels = screen.getAllByText('Boarding')
    expect(boardingLabels.length).toBeGreaterThanOrEqual(2)
  })

  it('disables Advance Phase button once a colony reaches Cleared', async () => {
    const user = userEvent.setup()
    render(<App />)
    const advanceBtns = () => screen.getAllByRole('button', { name: /Advance Phase/i })
    // Cycle Arcadia Ring from Boarding → Launch → Cleared (needs 2 more clicks)
    await user.click(advanceBtns()[0])
    await user.click(advanceBtns()[0])
    expect(screen.getByRole('button', { name: 'Cleared' })).toBeDisabled()
  })
})

describe('Defense Grid — Cycle Readiness', () => {
  it('cycles Aegis Lance Array from Armed to Standby', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Aegis Lance Array starts as Armed
    const cycleButtons = screen.getAllByRole('button', { name: /Cycle Readiness/i })
    await user.click(cycleButtons[0])
    // Should now be Standby (Armed → Standby)
    const statuses = screen.getAllByText('Standby')
    expect(statuses.length).toBeGreaterThanOrEqual(2) // Bastion was Standby + Aegis is now
  })
})

describe('Release Lock', () => {
  it('Release Lock button is disabled when no threat is assigned', () => {
    render(<App />)
    const releaseButtons = screen.getAllByRole('button', { name: /Release Lock/i })
    releaseButtons.forEach((btn) => expect(btn).toBeDisabled())
  })

  it('Release Lock becomes enabled after assigning, then releases properly', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Assign Aegis Lance Array to first threat
    await user.click(screen.getAllByRole('button', { name: /Assign Selected Asset/i })[0])
    // Release button for Aegis should now be enabled
    const releaseButtons = screen.getAllByRole('button', { name: /Release Lock/i })
    expect(releaseButtons[0]).not.toBeDisabled()
    await user.click(releaseButtons[0])
    // After release, all Release Lock buttons should be disabled again
    screen.getAllByRole('button', { name: /Release Lock/i }).forEach((btn) =>
      expect(btn).toBeDisabled(),
    )
  })
})

describe('Mission Log', () => {
  it('shows the initial AEGIS mission log entries', () => {
    render(<App />)
    expect(screen.getByText(/Commander Vex broadcast priority omega/i)).toBeInTheDocument()
    expect(screen.getByText(/Kuiper perimeter breach confirmed/i)).toBeInTheDocument()
  })

  it('appends a log entry after assigning an asset', async () => {
    const user = userEvent.setup()
    render(<App />)
    const initialEntries = screen.getAllByRole('paragraph').length
    await user.click(screen.getAllByRole('button', { name: /Assign Selected Asset/i })[0])
    expect(screen.getAllByRole('paragraph').length).toBeGreaterThan(initialEntries)
  })
})
