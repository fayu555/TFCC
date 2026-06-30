import { useEffect, useState } from "react";

type Player = {
  id: string;
  name: string;
  status: "Available" | "Maybe" | "Unavailable";
};

const initialPlayers: Player[] = [
  { id: "p1", name: "Vishwesh Pallam", status: "Unavailable" },
  { id: "p2", name: "Aditya Vardhan Nandakumar", status: "Unavailable" },
  { id: "p3", name: "Anvesh Varadappagari", status: "Unavailable" },
  { id: "p4", name: "Dharshan Patel", status: "Unavailable" },
  { id: "p5", name: "Fayazuddin Mohammed", status: "Unavailable" },
  { id: "p6", name: "Jevan Reddy Bhavanam", status: "Unavailable" },
  { id: "p7", name: "John Shaik", status: "Unavailable" },
  { id: "p8", name: "Karthick Raja Selvam", status: "Unavailable" },
  { id: "p9", name: "Mahendar", status: "Unavailable" },
  { id: "p10", name: "Neelabh", status: "Unavailable" },
  { id: "p11", name: "Prashanth Errabeli", status: "Unavailable" },
  { id: "p12", name: "Raghu Yarragunta", status: "Unavailable" },
  { id: "p13", name: "Raja Sekhar", status: "Unavailable" },
  { id: "p14", name: "Ranjith Thangellapally", status: "Unavailable" },
  { id: "p15", name: "Saikiran Nomula", status: "Unavailable" },
  { id: "p16", name: "Sairam Chandrasekaran", status: "Unavailable" },
  { id: "p17", name: "Sandeep Bolla", status: "Unavailable" },
  { id: "p18", name: "Shashank Aryasomyajula Rao", status: "Unavailable" },
  { id: "p19", name: "Sreeram Kundoor", status: "Unavailable" },
  { id: "p20", name: "Sri Teja Katakam", status: "Unavailable" },
  { id: "p21", name: "Tulasi Naidu", status: "Unavailable" },
  { id: "p22", name: "Vaibhav Munagala", status: "Unavailable" },
  { id: "p23", name: "Vinay Thota", status: "Unavailable" },
  { id: "p24", name: "Sathvik Gontla", status: "Unavailable" },
];

export function AvailabilityPage() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const stored = window.localStorage.getItem("tfcc-availability");
    if (!stored) return initialPlayers;
    try {
      return JSON.parse(stored) as Player[];
    } catch {
      return initialPlayers;
    }
  });

  useEffect(() => {
    window.localStorage.setItem("tfcc-availability", JSON.stringify(players));
  }, [players]);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const stored = window.localStorage.getItem("tfcc-playing12")
    if (!stored) return []
    try {
      return JSON.parse(stored) as string[]
    } catch {
      return []
    }
  })

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) =>
        players.some((player) => player.id === id && player.status === "Available"),
      ),
    )
  }, [players])

  useEffect(() => {
    window.localStorage.setItem("tfcc-playing12", JSON.stringify(selectedIds))
  }, [selectedIds])

  const onStatusChange = (id: string, status: Player["status"]) => {
    setPlayers((current) =>
      current.map((player) =>
        player.id === id ? { ...player, status } : player,
      ),
    )
  };

  const availableCount = players.filter(
    (player) => player.status === "Available",
  ).length;
  const maybeCount = players.filter(
    (player) => player.status === "Maybe",
  ).length;
  const unavailableCount = players.filter(
    (player) => player.status === "Unavailable",
  ).length;

  const availablePlayers = players.filter(
    (player) => player.status === "Available",
  )

  const playing12 = availablePlayers.filter((player) => selectedIds.includes(player.id)).slice(0, 12)
  const remainingSlots = Math.max(12 - playing12.length, 0)

  const toggleSelect = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((selectedId) => selectedId !== id)
      }
      if (current.length >= 12) {
        return current
      }
      return [...current, id]
    })
  }

  return (
    <div>
      <div className="card">
        <h2>Availability</h2>
        <p>Players can mark availability for upcoming matches.</p>
        <div
          style={{
            display: "flex",
            gap: 16,
            margin: "16px 0",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "#d1fae5",
              padding: "12px 16px",
              borderRadius: 16,
              minWidth: 180,
            }}
          >
            <strong>{availableCount}</strong>
            <div>Available</div>
          </div>
          <div
            style={{
              background: "#fef3c7",
              padding: "12px 16px",
              borderRadius: 16,
              minWidth: 180,
            }}
          >
            <strong>{maybeCount}</strong>
            <div>Maybe / Other</div>
          </div>
          <div
            style={{
              background: "#fee2e2",
              padding: "12px 16px",
              borderRadius: 16,
              minWidth: 180,
            }}
          >
            <strong>{unavailableCount}</strong>
            <div>Unavailable</div>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 24 }}>
          <h3>Captain: Select Playing 12 from Available Players</h3>
          <p>Choose up to 12 available players for the match.</p>
          <p>
            <strong>{playing12.length}</strong> selected, <strong>{remainingSlots}</strong> slots remaining
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Player</th>
              </tr>
            </thead>
            <tbody>
              {availablePlayers.map((player) => (
                <tr key={player.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(player.id)}
                      onChange={() => toggleSelect(player.id)}
                    />
                  </td>
                  <td>{player.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 16 }}>
            <strong>Playing 12</strong>
            <ul style={{ margin: "8px 0 0 16px" }}>
              {playing12.length
                ? playing12.map((player) => <li key={player.id}>{player.name}</li>)
                : <li>No players selected yet.</li>}
            </ul>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>
                  <select
                    value={player.status}
                    onChange={(e) =>
                      onStatusChange(
                        player.id,
                        e.target.value as Player["status"],
                      )
                    }
                  >
                    <option value="Available">Available</option>
                    <option value="Maybe">Maybe</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
