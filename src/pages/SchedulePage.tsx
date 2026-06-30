import { useState } from 'react'

type Match = {
  id: string
  opponent: string
  date: string
  location: string
  time: string
}

const initialMatches: Match[] = [
  { id: '1', opponent: 'Rare-HT', date: '2026-28-06', location: 'River Forest Park, Durham', time: '5:00 PM' },
]

export function SchedulePage() {
  const [matches, setMatches] = useState(initialMatches)
  const [form, setForm] = useState({ opponent: '', date: '', location: '', time: '' })

  const canAdd = Boolean(form.opponent && form.date && form.location && form.time)

  return (
    <div className="page page--schedule">
      <div className="page-header">
        <div>
          <p className="eyebrow">Schedule</p>
          <h1 className="page-title">Match schedule</h1>
          <p className="page-subtitle">View and add upcoming fixtures for the season.</p>
        </div>
      </div>

      <section className="card">
        <div className="section-head">
          <div>
            <h2>Upcoming matches</h2>
            <p className="text-muted">Keep the team informed on dates, locations, and match times.</p>
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
              </tr>
            </thead>
            <tbody>
              {matches.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '18px 14px', textAlign: 'center' }}>
                    No matches added yet.
                  </td>
                </tr>
              ) : (
                matches.map((match) => (
                  <tr key={match.id}>
                    <td>{match.opponent}</td>
                    <td>{match.date}</td>
                    <td>{match.location}</td>
                    <td>{match.time}</td>
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
            <h2>Add a match</h2>
            <p className="text-muted">Schedule the next fixture and share it with the team.</p>
          </div>
        </div>

        <div className="form-grid">
          <label className="input-group">
            <span className="input-label">Opponent</span>
            <input
              className="input-field"
              value={form.opponent}
              onChange={(e) => setForm({ ...form, opponent: e.target.value })}
              placeholder="Opponent name"
            />
          </label>

          <label className="input-group">
            <span className="input-label">Date</span>
            <input
              className="input-field"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>

          <label className="input-group">
            <span className="input-label">Location</span>
            <input
              className="input-field"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Match venue"
            />
          </label>

          <label className="input-group">
            <span className="input-label">Time</span>
            <input
              className="input-field"
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </label>
        </div>

        <div className="card-actions">
          <button
            className="button"
            type="button"
            disabled={!canAdd}
            onClick={() => {
              setMatches((current) => [
                ...current,
                { id: crypto.randomUUID(), opponent: form.opponent, date: form.date, location: form.location, time: form.time },
              ])
              setForm({ opponent: '', date: '', location: '', time: '' })
            }}
          >
            Add match
          </button>
        </div>
      </section>
    </div>
  )
}
