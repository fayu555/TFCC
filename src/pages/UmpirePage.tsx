import { useEffect, useMemo, useState } from 'react'

type Match = {
  id: string
  opponent: string
  date: string
  location: string
  time: string
}

type Player = {
  id: string
  name: string
  status?: string
}

type UmpireAssignment = {
  id: string
  matchId: string
  match: string
  date: string
  assignedTo: string
}

const initialAssignments: UmpireAssignment[] = []
const initialMatches: Match[] = []

function loadFromStorage<T>(key: string, fallback: T): T {
  const stored = window.localStorage.getItem(key)
  if (!stored) return fallback
  try {
    return JSON.parse(stored) as T
  } catch {
    return fallback
  }
}

export function UmpirePage() {
  const [assignments, setAssignments] = useState<UmpireAssignment[]>(() =>
    loadFromStorage<UmpireAssignment[]>('tfcc-umpires', initialAssignments),
  )
  const [schedule, setSchedule] = useState<Match[]>(() =>
    loadFromStorage<Match[]>('tfcc-schedule', initialMatches),
  )
  const [scheduleForm, setScheduleForm] = useState({
    opponent: '',
    date: '',
    location: '',
    time: '',
  })

  const teamPlayers = useMemo(
    () => loadFromStorage<Player[]>('tfcc-availability', []),
    [],
  )

  useEffect(() => {
    window.localStorage.setItem('tfcc-umpires', JSON.stringify(assignments))
  }, [assignments])

  useEffect(() => {
    window.localStorage.setItem('tfcc-schedule', JSON.stringify(schedule))
  }, [schedule])

  const assignedNames = useMemo(
    () => new Set(assignments.flatMap((item) => item.assignedTo.split(' & '))),
    [assignments],
  )

  const remainingUmpires = useMemo(
    () => teamPlayers.filter((player) => !assignedNames.has(player.name)),
    [teamPlayers, assignedNames],
  )

  const remainingMatches = useMemo(
    () => schedule.filter((match) => !assignments.some((item) => item.matchId === match.id)),
    [schedule, assignments],
  )

  const canAddSchedule =
    scheduleForm.opponent && scheduleForm.date && scheduleForm.location && scheduleForm.time
  const canAutoAssignAll = remainingMatches.length > 0 && remainingUmpires.length >= remainingMatches.length * 2
  const canAssignSingleMatch = remainingUmpires.length >= 2

  const isMatchAssigned = (matchId: string) => assignments.some((item) => item.matchId === matchId)

  const pickTwoRandom = (players: Player[]) => {
    const pool = [...players]
    const firstIndex = Math.floor(Math.random() * pool.length)
    const first = pool.splice(firstIndex, 1)[0]
    const secondIndex = Math.floor(Math.random() * pool.length)
    const second = pool.splice(secondIndex, 1)[0]
    return { selected: [first, second], remaining: pool }
  }

  const assignAutoForMatch = (match: Match) => {
    if (remainingMatches.every((m) => m.id !== match.id)) return
    if (!canAssignSingleMatch) return

    const { selected } = pickTwoRandom(remainingUmpires)
    setAssignments((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        matchId: match.id,
        match: `${match.opponent} at ${match.location}`,
        date: match.date,
        assignedTo: `${selected[0].name} & ${selected[1].name}`,
      },
    ])
  }

  const assignAutoForAll = () => {
    if (!canAutoAssignAll) return

    setAssignments((current) => {
      let available = [...remainingUmpires]
      const newAssignments = remainingMatches.map((match) => {
        const result = pickTwoRandom(available)
        available = result.remaining
        const [umpire1, umpire2] = result.selected
        return {
          id: crypto.randomUUID(),
          matchId: match.id,
          match: `${match.opponent} at ${match.location}`,
          date: match.date,
          assignedTo: `${umpire1.name} & ${umpire2.name}`,
        }
      })
      return [...current, ...newAssignments]
    })
  }

  return (
    <div className="page page--umpire">
      <div className="page-header">
        <div>
          <p className="eyebrow">Umpires</p>
          <h1 className="page-title">Umpire assignments</h1>
          <p className="page-subtitle">Track match assignments and pick two available umpires for every fixture.</p>
        </div>
      </div>

      <section className="card">
        <div className="section-head">
          <div>
            <h2>Umpire schedule</h2>
            <p className="text-muted">Review current umpires and assignment history.</p>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Match</th>
                <th>Date</th>
                <th>Assigned to</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '18px 14px', textAlign: 'center' }}>
                    No umpires assigned yet.
                  </td>
                </tr>
              ) : (
                assignments.map((item) => (
                  <tr key={item.id}>
                    <td>{item.match}</td>
                    <td>{item.date}</td>
                    <td>{item.assignedTo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <h2>Add match</h2>
            <p className="text-muted">Create a new match so the captain can assign umpires later.</p>
          </div>
        </div>

        <div className="form-grid">
          <label className="input-group">
            <span className="input-label">Opponent</span>
            <input
              className="input-field"
              value={scheduleForm.opponent}
              onChange={(e) => setScheduleForm({ ...scheduleForm, opponent: e.target.value })}
              placeholder="Opponent name"
            />
          </label>
          <label className="input-group">
            <span className="input-label">Date</span>
            <input
              className="input-field"
              type="date"
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
            />
          </label>
          <label className="input-group">
            <span className="input-label">Location</span>
            <input
              className="input-field"
              value={scheduleForm.location}
              onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
              placeholder="Venue"
            />
          </label>
          <label className="input-group">
            <span className="input-label">Time</span>
            <input
              className="input-field"
              type="time"
              value={scheduleForm.time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
            />
          </label>
        </div>

        <div className="card-actions">
          <button
            className="button"
            type="button"
            disabled={!canAddSchedule}
            onClick={() => {
              setSchedule((current) => [
                ...current,
                {
                  id: crypto.randomUUID(),
                  opponent: scheduleForm.opponent,
                  date: scheduleForm.date,
                  location: scheduleForm.location,
                  time: scheduleForm.time,
                },
              ])
              setScheduleForm({ opponent: '', date: '', location: '', time: '' })
            }}
          >
            Save match
          </button>
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <h2>Auto-assign umpires</h2>
            <p className="text-muted">Automatically select two different umpires for each pending match.</p>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: '18px' }}>
          <div className="stat-card">
            <strong>{remainingMatches.length}</strong>
            <span>unassigned matches</span>
          </div>
          <div className="stat-card">
            <strong>{remainingUmpires.length}</strong>
            <span>available umpires</span>
          </div>
        </div>

        <button className="button" type="button" disabled={!canAutoAssignAll} onClick={assignAutoForAll}>
          Auto-assign all remaining matches
        </button>
        {remainingMatches.length > 0 && remainingUmpires.length < remainingMatches.length * 2 && (
          <p className="alert">Not enough available umpires for all remaining matches.</p>
        )}
      </section>

      <section className="card">
        <div className="section-head">
          <div>
            <h2>Scheduled matches</h2>
            <p className="text-muted">Assign umpires per match when the roster is ready.</p>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Opponent</th>
                <th>Date</th>
                <th>Location</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedule.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '18px 14px', textAlign: 'center' }}>
                    No scheduled matches yet.
                  </td>
                </tr>
              ) : (
                schedule.map((match) => (
                  <tr key={match.id}>
                    <td>{match.opponent}</td>
                    <td>{match.date}</td>
                    <td>{match.location}</td>
                    <td>{match.time}</td>
                    <td>
                      <button
                        className="button button-secondary"
                        type="button"
                        disabled={isMatchAssigned(match.id) || !canAssignSingleMatch}
                        onClick={() => assignAutoForMatch(match)}
                      >
                        Assign random umpires
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
