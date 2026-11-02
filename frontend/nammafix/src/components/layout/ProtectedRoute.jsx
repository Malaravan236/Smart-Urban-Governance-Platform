import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, staffOnly = false }) {
  const { isAuthed, isStaff } = useAuth()
  const location = useLocation()

  if (!isAuthed) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (staffOnly && !isStaff) {
    return (
      <div className="container">
        <h2>Staff only</h2>
        <p className="muted">Your account doesn't have access to this page.</p>
      </div>
    )
  }
  return children
}