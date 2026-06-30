import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

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
    <Stack spacing={3}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Umpire Schedule
          </Typography>
          <Typography color="text.secondary" paragraph>
            Add matches manually, then auto-assign two distinct umpires for each match.
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Match</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Assigned To</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.match}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.assignedTo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Add Match
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Opponent"
              value={scheduleForm.opponent}
              onChange={(e) => setScheduleForm({ ...scheduleForm, opponent: e.target.value })}
            />
            <TextField
              fullWidth
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
            />
            <TextField
              fullWidth
              label="Location"
              value={scheduleForm.location}
              onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
            />
            <TextField
              fullWidth
              type="time"
              label="Time"
              InputLabelProps={{ shrink: true }}
              value={scheduleForm.time}
              onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
            />
          </Stack>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
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
              Save Match
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Auto-assign Umpires
          </Typography>
          <Typography color="text.secondary" paragraph>
            Assign two unique umpires per match from the full team roster. No player is repeated across the current assignments.
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {remainingMatches.length} unassigned match(es), {remainingUmpires.length} available umpire(s)
          </Typography>
          <Button
            variant="contained"
            disabled={!canAutoAssignAll}
            onClick={assignAutoForAll}
            sx={{ mr: 2 }}
          >
            Auto-assign all remaining matches
          </Button>
          <Typography color="error" sx={{ mt: 1 }}>
            {remainingMatches.length > 0 && remainingUmpires.length < remainingMatches.length * 2
              ? 'Not enough available umpires for all remaining matches.'
              : ''}
          </Typography>
        </CardContent>
      </Card>

      <Card elevation={3}> 
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Scheduled Matches
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Opponent</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule.map((match) => (
                  <TableRow key={match.id} hover>
                    <TableCell>{match.opponent}</TableCell>
                    <TableCell>{match.date}</TableCell>
                    <TableCell>{match.location}</TableCell>
                    <TableCell>{match.time}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={isMatchAssigned(match.id) || !canAssignSingleMatch}
                        onClick={() => assignAutoForMatch(match)}
                      >
                        Assign random umpires
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  )
}
