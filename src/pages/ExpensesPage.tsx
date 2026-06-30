import { useEffect, useMemo, useState } from 'react'

type Expense = {
  id: string
  description: string
  amount: number
  payer: string
  splitBetween: string
  date: string
}

const initialExpenses: Expense[] = []

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
    <div className="page page--expenses">
      <div className="page-header">
        <div>
          <p className="eyebrow">Team</p>
          <h1 className="page-title">Team Expenses</h1>
          <p className="page-subtitle">Track spending and split payments for match events and club costs.</p>
        </div>
        <div className="summary-card">
          <span>Total spent</span>
          <strong>${total.toFixed(0)}</strong>
        </div>
      </div>

      <section className="card">
        <div className="section-head">
          <div>
            <h2>Expense history</h2>
            <p className="text-muted">Review payments and shared costs for every fixture.</p>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Payer</th>
                <th>Split</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '18px 14px', textAlign: 'center' }}>
                    No expenses recorded yet.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>${expense.amount.toFixed(0)}</td>
                    <td>{expense.payer}</td>
                    <td>{expense.splitBetween} people</td>
                    <td>{expense.date}</td>
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
            <h2>Add Expense</h2>
            <p className="text-muted">Record a new expense for match day spending.</p>
          </div>
        </div>

        <div className="form-grid">
          <label className="input-group">
            <span className="input-label">Description</span>
            <input
              className="input-field"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What was purchased?"
            />
          </label>

          <label className="input-group">
            <span className="input-label">Amount</span>
            <input
              className="input-field"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0"
            />
          </label>

          <label className="input-group">
            <span className="input-label">Payer</span>
            <input
              className="input-field"
              value={form.payer}
              onChange={(e) => setForm({ ...form, payer: e.target.value })}
              placeholder="Name"
            />
          </label>

          <label className="input-group">
            <span className="input-label">Split Between</span>
            <input
              className="input-field"
              type="number"
              value={form.splitBetween}
              onChange={(e) => setForm({ ...form, splitBetween: e.target.value })}
              placeholder="1"
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
        </div>

        <div className="card-actions">
          <button
            className="button"
            type="button"
            disabled={!canAdd}
            onClick={() => {
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
            }}
          >
            Add expense
          </button>
        </div>
      </section>
    </div>
  )
}
