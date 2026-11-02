import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../common/Logo'

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊', auth: true },
  { to: '/report', label: 'Create Report', icon: '➕', auth: true },
  { to: '/my-reports', label: 'My Reports', icon: '📋', auth: true },
  { to: '/issues', label: 'All Reports', icon: '🗂️' },
  { to: '/map', label: 'Map', icon: '🗺️' },
  { to: '/profile', label: 'Profile', icon: '👤', auth: true },
  { to: '/admin', label: 'Admin', icon: '🛡️', staff: true },
]

export default function Sidebar() {
  const { isAuthed, isStaff, logout } = useAuth()
  const navigate = useNavigate()
  const visible = LINKS.filter((l) => (!l.auth || isAuthed) && (!l.staff || isStaff))

  return (
    <aside className="sidebar">
      <Logo to="/" />
      <nav aria-label="Sidebar" style={{ display: 'contents' }}>
        {visible.map((l) => (
          <NavLink key={l.to} to={l.to} className="side-link">
            <span aria-hidden="true">{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="side-spacer" />
      {isAuthed && (
        <button className="side-link" onClick={() => { logout(); navigate('/') }}>
          <span aria-hidden="true">🚪</span> Logout
        </button>
      )}
    </aside>
  )
}