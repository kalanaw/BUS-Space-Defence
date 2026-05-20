import { useEffect, useState } from 'react'
import './App.css'

type ThreatSeverity = 'Critical' | 'High' | 'Medium'
type ThreatStatus = 'Inbound' | 'Targeted' | 'Intercept Window' | 'Neutralized'
type ColonyStage = 'Standby' | 'Boarding' | 'Launch' | 'Cleared'
type DefenseStatus = 'Standby' | 'Armed' | 'Engaged' | 'Cooling'
type LogLevel = 'alert' | 'command' | 'system'
type ThreatFilter = 'All' | 'Critical' | 'Assigned' | 'Unassigned'

type Threat = {
  id: string
  fragment: string
  target: string
  etaMinutes: number
  severity: ThreatSeverity
  confidence: number
  trajectory: string
  status: ThreatStatus
  assignedAssetId: string | null
}

type Colony = {
  id: string
  name: string
  population: string
  route: string
  routeRisk: 'Elevated' | 'Critical' | 'Stable'
  readiness: number
  stage: ColonyStage
}

type DefenseAsset = {
  id: string
  name: string
  coverage: string
  interceptors: number
  charge: number
  status: DefenseStatus
  assignedThreatId: string | null
}

type MissionEntry = {
  id: number
  stamp: string
  level: LogLevel
  text: string
}

const initialThreats: Threat[] = [
  {
    id: 'th-01',
    fragment: 'KX-01 Helios Spear',
    target: 'Arcadia Ring',
    etaMinutes: 47,
    severity: 'Critical',
    confidence: 97,
    trajectory: 'Polar descent / 19.3 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-02',
    fragment: 'KX-02 Ember Wake',
    target: 'Orion Spindle',
    etaMinutes: 44,
    severity: 'High',
    confidence: 93,
    trajectory: 'Mid-orbit shear / 17.1 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-03',
    fragment: 'KX-03 Vanta Shard',
    target: 'Arcadia Ring',
    etaMinutes: 41,
    severity: 'Critical',
    confidence: 96,
    trajectory: 'Shadow plane / 20.2 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-04',
    fragment: 'KX-04 Needle Rain',
    target: 'Kepler Haven',
    etaMinutes: 39,
    severity: 'Medium',
    confidence: 89,
    trajectory: 'Equatorial sweep / 15.4 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-05',
    fragment: 'KX-05 Ash Crown',
    target: 'Orion Spindle',
    etaMinutes: 36,
    severity: 'Critical',
    confidence: 98,
    trajectory: 'Direct burn / 22.1 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-06',
    fragment: 'KX-06 Tidal Scar',
    target: 'Kepler Haven',
    etaMinutes: 33,
    severity: 'High',
    confidence: 91,
    trajectory: 'Cross-lane slice / 16.8 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-07',
    fragment: 'KX-07 Ion Pike',
    target: 'Arcadia Ring',
    etaMinutes: 29,
    severity: 'Medium',
    confidence: 87,
    trajectory: 'Drift collapse / 14.9 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-08',
    fragment: 'KX-08 Red Meridian',
    target: 'Kepler Haven',
    etaMinutes: 27,
    severity: 'Critical',
    confidence: 94,
    trajectory: 'Rake vector / 18.6 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-09',
    fragment: 'KX-09 Rift Cinder',
    target: 'Orion Spindle',
    etaMinutes: 24,
    severity: 'High',
    confidence: 88,
    trajectory: 'Debris cone / 16.2 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-10',
    fragment: 'KX-10 Black Static',
    target: 'Arcadia Ring',
    etaMinutes: 21,
    severity: 'Medium',
    confidence: 84,
    trajectory: 'Lateral skip / 13.5 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-11',
    fragment: 'KX-11 Dusk Hammer',
    target: 'Kepler Haven',
    etaMinutes: 18,
    severity: 'Critical',
    confidence: 97,
    trajectory: 'Terminal plunge / 21.4 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
  {
    id: 'th-12',
    fragment: 'KX-12 Pale Orbit',
    target: 'Orion Spindle',
    etaMinutes: 15,
    severity: 'High',
    confidence: 90,
    trajectory: 'Wake fracture / 17.9 km/s',
    status: 'Inbound',
    assignedAssetId: null,
  },
]

const initialColonies: Colony[] = [
  {
    id: 'co-01',
    name: 'Arcadia Ring',
    population: '1.1M',
    route: 'Transfer Gate North / Corridor-7',
    routeRisk: 'Critical',
    readiness: 38,
    stage: 'Boarding',
  },
  {
    id: 'co-02',
    name: 'Orion Spindle',
    population: '740K',
    route: 'Dock Spine East / Lancer Convoy',
    routeRisk: 'Elevated',
    readiness: 26,
    stage: 'Standby',
  },
  {
    id: 'co-03',
    name: 'Kepler Haven',
    population: '560K',
    route: 'Solar Lift South / Relay B',
    routeRisk: 'Elevated',
    readiness: 49,
    stage: 'Boarding',
  },
]

const initialDefenseAssets: DefenseAsset[] = [
  {
    id: 'df-01',
    name: 'Aegis Lance Array',
    coverage: 'Arcadia Ring / Inner Pole',
    interceptors: 12,
    charge: 84,
    status: 'Armed',
    assignedThreatId: null,
  },
  {
    id: 'df-02',
    name: 'Bastion Coil Net',
    coverage: 'Orion Spindle / Mid Belt',
    interceptors: 9,
    charge: 72,
    status: 'Standby',
    assignedThreatId: null,
  },
  {
    id: 'df-03',
    name: 'Sentinel Rail Cluster',
    coverage: 'Kepler Haven / South Arc',
    interceptors: 7,
    charge: 65,
    status: 'Armed',
    assignedThreatId: null,
  },
  {
    id: 'df-04',
    name: 'Nova Screen IX',
    coverage: 'Cross-colony lattice',
    interceptors: 6,
    charge: 58,
    status: 'Cooling',
    assignedThreatId: null,
  },
]

const initialMissionLog: MissionEntry[] = [
  {
    id: 1,
    stamp: 'T-47:00',
    level: 'alert',
    text: 'Commander Vex broadcast priority omega. Kuiper perimeter breach confirmed.',
  },
  {
    id: 2,
    stamp: 'T-46:42',
    level: 'system',
    text: 'Deep-space sensor mesh recovered 12 fragment signatures and 3 projected colony impact lanes.',
  },
  {
    id: 3,
    stamp: 'T-46:11',
    level: 'command',
    text: 'AEGIS command uplink restored in degraded mode. Replacement dashboard authorized.',
  },
]

const evacuationSequence: ColonyStage[] = ['Standby', 'Boarding', 'Launch', 'Cleared']

function formatCountdown(secondsRemaining: number) {
  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function formatEta(minutes: number) {
  return `T-${String(minutes).padStart(2, '0')}:00`
}

function App() {
  const [secondsRemaining, setSecondsRemaining] = useState(47 * 60)
  const [threats, setThreats] = useState(initialThreats)
  const [colonies, setColonies] = useState(initialColonies)
  const [defenseAssets, setDefenseAssets] = useState(initialDefenseAssets)
  const [missionLog, setMissionLog] = useState(initialMissionLog)
  const [selectedAssetId, setSelectedAssetId] = useState<string>('df-01')
  const [threatFilter, setThreatFilter] = useState<ThreatFilter>('All')

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((currentSeconds) => {
        if (currentSeconds <= 0) {
          window.clearInterval(timer)
          return 0
        }

        return currentSeconds - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const appendMissionLog = (level: LogLevel, text: string) => {
    setMissionLog((currentLog) => [
      {
        id: currentLog[0]?.id ? currentLog[0].id + 1 : 1,
        stamp: `T-${formatCountdown(secondsRemaining)}`,
        level,
        text,
      },
      ...currentLog,
    ])
  }

  const cycleEvacuation = (colonyId: string) => {
    const colony = colonies.find((entry) => entry.id === colonyId)

    if (!colony) {
      return
    }

    const nextStageIndex = Math.min(
      evacuationSequence.indexOf(colony.stage) + 1,
      evacuationSequence.length - 1,
    )
    const nextStage = evacuationSequence[nextStageIndex]
    const nextReadiness = Math.min(colony.readiness + 24, 100)

    setColonies((currentColonies) =>
      currentColonies.map((entry) =>
        entry.id === colonyId
          ? {
              ...entry,
              stage: nextStage,
              readiness: nextReadiness,
            }
          : entry,
      ),
    )

    appendMissionLog(
      'command',
      `${colony.name} advanced to ${nextStage.toUpperCase()} via ${colony.route}. Readiness ${nextReadiness}%.`,
    )
  }

  const toggleAssetReadiness = (assetId: string) => {
    const asset = defenseAssets.find((entry) => entry.id === assetId)

    if (!asset) {
      return
    }

    let nextStatus: DefenseStatus = asset.status
    let nextCharge = asset.charge

    if (asset.status === 'Standby') {
      nextStatus = 'Armed'
      nextCharge = Math.min(asset.charge + 12, 100)
    } else if (asset.status === 'Armed') {
      nextStatus = 'Standby'
    } else if (asset.status === 'Cooling') {
      nextStatus = 'Armed'
      nextCharge = Math.min(asset.charge + 20, 100)
    }

    setDefenseAssets((currentAssets) =>
      currentAssets.map((entry) =>
        entry.id === assetId
          ? {
              ...entry,
              status: nextStatus,
              charge: nextCharge,
            }
          : entry,
      ),
    )

    if (nextStatus !== asset.status || nextCharge !== asset.charge) {
      appendMissionLog(
        'system',
        `${asset.name} set to ${nextStatus.toUpperCase()} with capacitor charge at ${nextCharge}%.`,
      )
    }
  }

  const releaseAsset = (assetId: string) => {
    const asset = defenseAssets.find((entry) => entry.id === assetId)

    if (!asset || !asset.assignedThreatId) {
      return
    }

    const releasedThreat = threats.find((entry) => entry.id === asset.assignedThreatId)

    setDefenseAssets((currentAssets) =>
      currentAssets.map((entry) =>
        entry.id === assetId
          ? {
              ...entry,
              assignedThreatId: null,
              status: 'Cooling',
              charge: Math.max(entry.charge - 10, 20),
            }
          : entry,
      ),
    )

    setThreats((currentThreats) =>
      currentThreats.map((entry) =>
        entry.id === asset.assignedThreatId
          ? {
              ...entry,
              assignedAssetId: null,
              status: entry.status === 'Neutralized' ? 'Neutralized' : 'Inbound',
            }
          : entry,
      ),
    )

    appendMissionLog(
      'alert',
      `${asset.name} released from ${releasedThreat?.fragment ?? 'assigned fragment'}. Tracking reverted to manual supervision.`,
    )
  }

  const assignSelectedAsset = (threatId: string) => {
    const selectedAsset = defenseAssets.find((asset) => asset.id === selectedAssetId)
    const threat = threats.find((entry) => entry.id === threatId)

    if (!selectedAsset || !threat) {
      return
    }

    if (selectedAsset.status === 'Cooling') {
      appendMissionLog('alert', `${selectedAsset.name} remains in cooling cycle and cannot be assigned.`)
      return
    }

    if (selectedAsset.assignedThreatId && selectedAsset.assignedThreatId !== threatId) {
      appendMissionLog('alert', `${selectedAsset.name} is already locked to another fragment.`)
      return
    }

    setDefenseAssets((currentAssets) =>
      currentAssets.map((asset) =>
        asset.id === selectedAssetId
          ? {
              ...asset,
              assignedThreatId: threatId,
              interceptors: Math.max(asset.interceptors - 1, 0),
              charge: Math.max(asset.charge - 14, 0),
              status: 'Engaged',
            }
          : asset,
      ),
    )

    setThreats((currentThreats) =>
      currentThreats.map((entry) => {
        if (entry.id !== threatId) {
          return entry
        }

        const nextStatus: ThreatStatus = entry.severity === 'Medium' ? 'Intercept Window' : 'Targeted'

        return {
          ...entry,
          assignedAssetId: selectedAssetId,
          status: nextStatus,
        }
      }),
    )

    appendMissionLog(
      'command',
      `${selectedAsset.name} committed against ${threat.fragment}. Colony lane ${threat.target} now under active intercept watch.`,
    )
  }

  const markThreatNeutralized = (threatId: string) => {
    const threat = threats.find((entry) => entry.id === threatId)

    if (!threat) {
      return
    }

    setThreats((currentThreats) =>
      currentThreats.map((entry) =>
        entry.id === threatId
          ? {
              ...entry,
              status: 'Neutralized',
            }
          : entry,
      ),
    )

    if (threat.assignedAssetId) {
      setDefenseAssets((currentAssets) =>
        currentAssets.map((asset) =>
          asset.id === threat.assignedAssetId
            ? {
                ...asset,
                assignedThreatId: null,
                status: 'Cooling',
              }
            : asset,
        ),
      )
    }

    appendMissionLog('system', `${threat.fragment} broke apart outside terminal corridor. Fragment signature downgraded.`)
  }

  const filteredThreats = threats.filter((threat) => {
    if (threatFilter === 'Critical') {
      return threat.severity === 'Critical'
    }

    if (threatFilter === 'Assigned') {
      return Boolean(threat.assignedAssetId)
    }

    if (threatFilter === 'Unassigned') {
      return !threat.assignedAssetId
    }

    return true
  })

  const currentAsset = defenseAssets.find((asset) => asset.id === selectedAssetId)
  const criticalThreats = threats.filter((threat) => threat.severity === 'Critical' && threat.status !== 'Neutralized').length
  const activeIntercepts = defenseAssets.filter((asset) => asset.assignedThreatId).length
  const evacuatedLives = colonies.reduce((total, colony) => total + Math.round((Number(colony.population.replace(/[^\d.]/g, '')) || 0) * colony.readiness), 0)
  const timerTone = secondsRemaining <= 900 ? 'red' : secondsRemaining <= 1800 ? 'amber' : 'blue'

  return (
    <div className="app-shell">
      <header className="command-header">
        <div className="command-header__copy">
          <p className="eyebrow">AEGIS orbital defense platform :: year 2147</p>
          <h1>Space Defence Command Dashboard</h1>
          <p className="command-brief">
            A rogue asteroid swarm breached the Kuiper perimeter. Twelve fragments are inbound toward Arcadia Ring,
            Orion Spindle, and Kepler Haven. The legacy control system is gone. This console is the replacement.
          </p>
        </div>

        <div className={`countdown countdown--${timerTone}`}>
          <span className="countdown__label">First impact in</span>
          <strong className="countdown__value">{formatCountdown(secondsRemaining)}</strong>
          <span className="countdown__note">Commander Vex: build, track, route, and hold the line.</span>
        </div>
      </header>

      <section className="status-strip" aria-label="Global status overview">
        <article>
          <span>Fragments tracked</span>
          <strong>12</strong>
        </article>
        <article>
          <span>Critical trajectories</span>
          <strong>{criticalThreats}</strong>
        </article>
        <article>
          <span>Active intercepts</span>
          <strong>{activeIntercepts}</strong>
        </article>
        <article>
          <span>Population under command</span>
          <strong>2.4M</strong>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel panel--threats">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Threat Board</p>
              <h2>Collision fragments and impact lanes</h2>
            </div>
            <div className="filter-pills" role="tablist" aria-label="Threat filters">
              {(['All', 'Critical', 'Assigned', 'Unassigned'] as ThreatFilter[]).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={filter === threatFilter ? 'is-active' : ''}
                  onClick={() => setThreatFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="asset-banner">
            <span>Selected defense asset</span>
            <strong>{currentAsset?.name ?? 'None selected'}</strong>
            <small>{currentAsset?.coverage ?? 'Select an asset in Defense Grid to commit intercepts.'}</small>
          </div>

          <div className="threat-list">
            {filteredThreats.map((threat) => (
              <div key={threat.id} className="threat-card">
                <div className="threat-card__headline">
                  <div>
                    <p>{threat.fragment}</p>
                    <span>{threat.target}</span>
                  </div>
                  <span className={`severity severity--${threat.severity.toLowerCase()}`}>{threat.severity}</span>
                </div>

                <dl className="threat-metrics">
                  <div>
                    <dt>ETA</dt>
                    <dd>{formatEta(threat.etaMinutes)}</dd>
                  </div>
                  <div>
                    <dt>Confidence</dt>
                    <dd>{threat.confidence}%</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{threat.status}</dd>
                  </div>
                </dl>

                <p className="trajectory">{threat.trajectory}</p>

                <div className="threat-actions">
                  <button type="button" onClick={() => assignSelectedAsset(threat.id)}>
                    Assign Selected Asset
                  </button>
                  <button
                    type="button"
                    className="button-ghost"
                    onClick={() => markThreatNeutralized(threat.id)}
                    disabled={threat.status === 'Neutralized'}
                  >
                    Mark Neutralized
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel panel--evacuation">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Evacuation Planner</p>
              <h2>Colony extraction readiness</h2>
            </div>
            <div className="summary-chip">
              <span>Estimated evac readiness</span>
              <strong>{Math.round(colonies.reduce((sum, colony) => sum + colony.readiness, 0) / colonies.length)}%</strong>
            </div>
          </div>

          <div className="colony-list">
            {colonies.map((colony) => (
              <div key={colony.id} className="colony-card">
                <div className="colony-card__headline">
                  <div>
                    <p>{colony.name}</p>
                    <span>{colony.population} civilians</span>
                  </div>
                  <span className={`route-risk route-risk--${colony.routeRisk.toLowerCase()}`}>{colony.routeRisk}</span>
                </div>

                <p className="colony-route">{colony.route}</p>
                <div className="progress-track" aria-hidden="true">
                  <div className="progress-track__fill" style={{ width: `${colony.readiness}%` }} />
                </div>

                <div className="colony-card__footer">
                  <div>
                    <strong>{colony.stage}</strong>
                    <span>{colony.readiness}% complete</span>
                  </div>
                  <button type="button" onClick={() => cycleEvacuation(colony.id)} disabled={colony.stage === 'Cleared'}>
                    {colony.stage === 'Cleared' ? 'Cleared' : 'Advance Phase'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel panel--defense">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Defense Grid</p>
              <h2>Orbital batteries and lattice control</h2>
            </div>
            <div className="summary-chip">
              <span>Selected</span>
              <strong>{currentAsset?.name ?? 'None'}</strong>
            </div>
          </div>

          <div className="defense-list">
            {defenseAssets.map((asset) => (
              <div
                key={asset.id}
                className={`defense-card ${asset.id === selectedAssetId ? 'defense-card--selected' : ''}`}
              >
                <div className="defense-card__headline">
                  <div>
                    <p>{asset.name}</p>
                    <span>{asset.coverage}</span>
                  </div>
                  <span className={`asset-state asset-state--${asset.status.toLowerCase()}`}>{asset.status}</span>
                </div>

                <dl className="defense-metrics">
                  <div>
                    <dt>Interceptors</dt>
                    <dd>{asset.interceptors}</dd>
                  </div>
                  <div>
                    <dt>Charge</dt>
                    <dd>{asset.charge}%</dd>
                  </div>
                  <div>
                    <dt>Lock</dt>
                    <dd>{asset.assignedThreatId ?? 'Open'}</dd>
                  </div>
                </dl>

                <div className="defense-actions">
                  <button type="button" onClick={() => setSelectedAssetId(asset.id)}>
                    {asset.id === selectedAssetId ? 'Asset Selected' : 'Select Asset'}
                  </button>
                  <button type="button" className="button-ghost" onClick={() => toggleAssetReadiness(asset.id)}>
                    Cycle Readiness
                  </button>
                  <button
                    type="button"
                    className="button-ghost"
                    onClick={() => releaseAsset(asset.id)}
                    disabled={!asset.assignedThreatId}
                  >
                    Release Lock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel panel--log">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Mission Log</p>
              <h2>Operator actions and telemetry</h2>
            </div>
            <div className="summary-chip">
              <span>Lives moved to safety</span>
              <strong>{evacuatedLives.toLocaleString()}</strong>
            </div>
          </div>

          <div className="log-list" role="log" aria-live="polite">
            {missionLog.map((entry) => (
              <div key={entry.id} className={`log-entry log-entry--${entry.level}`}>
                <div className="log-entry__stamp">{entry.stamp}</div>
                <div>
                  <p>{entry.text}</p>
                  <span>{entry.level}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export default App
