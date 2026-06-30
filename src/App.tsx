import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ExpensesPage } from './pages/ExpensesPage'
import { GalleryPage } from './pages/GalleryPage'
import { SchedulePage } from './pages/SchedulePage'
import { AvailabilityPage } from './pages/AvailabilityPage'
import { UmpirePage } from './pages/UmpirePage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate replace to="/schedule" />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/umpires" element={<UmpirePage />} />
      </Routes>
    </AppShell>
  )
}
