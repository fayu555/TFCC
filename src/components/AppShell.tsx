import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Schedule', to: '/schedule' },
  { label: 'Expenses', to: '/expenses' },
  { label: 'Availability', to: '/availability' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Umpires', to: '/umpires' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className={`app-shell ${drawerOpen ? 'sidebar-open' : ''}`}>
      <header className="topbar">
        <button className="topbar__toggle" type="button" onClick={() => setDrawerOpen(true)}>
          ☰
        </button>
        <div className="topbar__brand">
          <p className="eyebrow">The Force Cricket Club</p>
          <p className="title">TFCC Management</p>
        </div>
      </header>

      <aside className={`sidebar ${drawerOpen ? 'open' : ''}`}>
        <div className="sidebar__head">
          <div>
            <p className="eyebrow">Team</p>
            <h2>TFCC</h2>
            <p className="text-muted">Lets build the legacy!</p>
          </div>
          <button className="sidebar__close" type="button" onClick={() => setDrawerOpen(false)}>
            ×
          </button>
        </div>

        <nav className="sidebar__nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}
              onClick={() => setDrawerOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="overlay" onClick={() => setDrawerOpen(false)} />

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
