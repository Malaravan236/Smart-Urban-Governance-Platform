import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppLayout() {
  const { isAuthed, user } = useAuth()
  return (
    <div className="app">
      <Sidebar />
      <div className="app-main">
        <div className="app-top">
          {isAuthed ? (
            <>
              <Link to="/report" className="btn btn-primary">+ Report issue</Link>
              <Link to="/profile" className="user-chip">
                <span className="avatar sm">{user.username[0].toUpperCase()}</span>
                {user.username}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
        <main className="app-content"><Outlet /></main>
      </div>
      <BottomNav />
    </div>
  )
}