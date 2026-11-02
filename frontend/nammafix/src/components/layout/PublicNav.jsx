import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../common/Logo'

export default function PublicNav() {
  const { isAuthed } = useAuth()
  return (
    <header className="pub-nav">
      <div className="in">
        <Logo />
        <nav className="pub-links" aria-label="Main">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/issues">Reports</NavLink>
          <NavLink to="/map">Map</NavLink>
        </nav>
        <div className="pub-actions">
          {isAuthed ? (
            <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}