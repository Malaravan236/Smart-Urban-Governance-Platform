import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function BottomNav() {
  const { isAuthed } = useAuth()
  const items = [
    { to: '/', label: 'Home', icon: '🏠', end: true },
    { to: '/map', label: 'Map', icon: '🗺️' },
    { to: isAuthed ? '/report' : '/login', label: 'Report', icon: '➕' },
    { to: '/issues', label: 'Reports', icon: '📋' },
    { to: isAuthed ? '/profile' : '/login', label: isAuthed ? 'Profile' : 'Login', icon: '👤' },
  ]
  return (
    <nav className="bottom-nav" aria-label="Quick links">
      {items.map((i) => (
        <NavLink key={i.label} to={i.to} end={i.end}>
          <span aria-hidden="true">{i.icon}</span>{i.label}
        </NavLink>
      ))}
    </nav>
  )
}