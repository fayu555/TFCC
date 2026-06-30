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

type Expense = {
  id: string
  description: string
  amount: number
  payer: string
  splitBetween: string
  date: string
}

const initialExpenses: Expense[] = [
]

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const stored = window.localStorage.getItem('tfcc-expenses')
    if (!stored) return initialExpenses
    try {
      return JSON.parse(stored) as Expense[]
    } catch {
      return initialExpenses
    }
  })
  const [form, setForm] = useState({ description: '', amount: '', payer: '', splitBetween: '1', date: '' })

  useEffect(() => {
    window.localStorage.setItem('tfcc-expenses', JSON.stringify(expenses))
  }, [expenses])

  const total = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses])
  const canAdd = Boolean(form.description && form.amount && form.payer && form.date)

  return (
    <Stack spacing={3}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Team Expenses
          </Typography>
          <Typography component="p" color="text.secondary" sx={{ mb: 2 }}>
            Track spending and split payments for match events and club costs.
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payer</TableCell>
                  <TableCell>Split</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} hover>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>${expense.amount.toFixed(0)}</TableCell>
                    <TableCell>{expense.payer}</TableCell>
                    <TableCell>{expense.splitBetween} people</TableCell>
                    <TableCell>{expense.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography sx={{ mt: 2, fontWeight: 700 }}>Total spent: ${total.toFixed(0)}</Typography>
        </CardContent>
      </Card>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Add Expense
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <TextField
              fullWidth
              label="Payer"
              value={form.payer}
              onChange={(e) => setForm({ ...form, payer: e.target.value })}
            />
            <TextField
              fullWidth
              label="Split Between"
              type="number"
              value={form.splitBetween}
              onChange={(e) => setForm({ ...form, splitBetween: e.target.value })}
            />
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Stack>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" disabled={!canAdd} onClick={() => {
              setExpenses((current) => [
                ...current,
                {
                  id: crypto.randomUUID(),
                  description: form.description,
                  amount: Number(form.amount),
                  payer: form.payer,
                  splitBetween: form.splitBetween,
                  date: form.date,
                },
              ])
              setForm({ description: '', amount: '', payer: '', splitBetween: '1', date: '' })
            }}>
              Add Expense
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  )
}
