import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { myReports } from '../services/issueService'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/common/StatCard'
import StatusBadge from '../components/issues/StatusBadge'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { timeAgo } from '../utils/format'

export default function Profile() {
  const { user, isStaff, logout } = useAuth()
  const navigate = useNavigate()
  const [issues, setIssues] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    myReports().then(setIssues).catch((e) => setError(e.message))
  }, [])

  const count = (s) => issues?.filter((i) => i.status === s).length ?? 0
  const supports = issues?.reduce((sum, i) => sum + i.support_count, 0) ?? 0

  return (
    <div className="container">
      <div className="page-head"><h2>My Profile</h2></div>

      <div className="card profile-head">
        <span className="avatar lg">{user.username[0].toUpperCase()}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>{user.username} {isStaff && <span className="pill cat">Staff</span>}</h3>
          <p className="muted" style={{ margin: 0 }}>{user.email || 'No email added'}</p>
        </div>
        <button className="btn" onClick={() => { logout(); navigate('/') }}>Logout</button>
      </div>

      <div className="stats" style={{ marginTop: 18 }}>
        <StatCard label="Reports" value={issues?.length ?? '–'} icon="📄" tone="blue" />
        <StatCard label="Resolved" value={issues ? count('resolved') : '–'} icon="✅" tone="green" />
        <StatCard label="In Progress" value={issues ? count('in_progress') : '–'} icon="⏳" tone="amber" />
        <StatCard label="Supports received" value={issues ? supports : '–'} icon="▲" tone="red" />
      </div>

      <div className="sec-head"><h3>My recent reports</h3><Link to="/my-reports">View all</Link></div>
      <ErrorMessage message={error} />
      {!issues && !error && <Loader />}
      {issues?.length === 0 && <div className="card empty">No reports yet.</div>}
      {issues?.length > 0 && (
        <div className="card">
          {issues.slice(0, 5).map((i) => (
            <div className="trow" key={i.id}>
              <h3><Link to={`/issues/${i.id}`}>{i.title}</Link></h3>
              <StatusBadge status={i.status} />
              <span className="muted small">{timeAgo(i.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}