import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material'

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
    <Stack spacing={3}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Match Schedule
          </Typography>
          <Typography color="text.secondary" paragraph>
            View and add upcoming fixtures for the season.
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Opponent</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id} hover>
                    <TableCell>{match.opponent}</TableCell>
                    <TableCell>{match.date}</TableCell>
                    <TableCell>{match.location}</TableCell>
                    <TableCell>{match.time}</TableCell>
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
            Add a Match
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Opponent"
              value={form.opponent}
              onChange={(e) => setForm({ ...form, opponent: e.target.value })}
            />
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <TextField
              fullWidth
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <TextField
              fullWidth
              label="Time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </Stack>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" disabled={!canAdd} onClick={() => {
              setMatches((current) => [
                ...current,
                { id: crypto.randomUUID(), opponent: form.opponent, date: form.date, location: form.location, time: form.time },
              ])
              setForm({ opponent: '', date: '', location: '', time: '' })
            }}>
              Add Match
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  )
}
