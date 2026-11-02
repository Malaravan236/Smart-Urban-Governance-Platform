import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { myReports } from '../services/issueService'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/common/StatCard'
import IssueCard from '../components/issues/IssueCard'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'

export default function Dashboard() {
  const { user } = useAuth()
  const [issues, setIssues] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    myReports().then(setIssues).catch((e) => setError(e.message))
  }, [])

  if (error) return <ErrorMessage message={error} />
  if (!issues) return <Loader />

  const count = (s) => issues.filter((i) => i.status === s).length

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h2>Welcome back, {user.username}! 👋</h2>
          <p className="muted">Together we can make our community better.</p>
        </div>
      </div>

      <div className="stats">
        <StatCard label="Total Reports" value={issues.length} icon="📄" tone="blue" />
        <StatCard label="Open" value={count('open')} icon="⚠️" tone="red" />
        <StatCard label="In Progress" value={count('in_progress')} icon="⏳" tone="amber" />
        <StatCard label="Resolved" value={count('resolved')} icon="✅" tone="green" />
      </div>

      <div className="sec-head"><h3>Recent Reports</h3><Link to="/my-reports">View all</Link></div>
      {issues.length === 0 ? (
        <div className="card empty">
          You haven't reported anything yet.<br />
          <Link to="/report" className="btn btn-primary" style={{ marginTop: 12 }}>Report your first issue</Link>
        </div>
      ) : (
        <div className="card-grid">
          {issues.slice(0, 4).map((i) => <IssueCard key={i.id} issue={i} />)}
        </div>
      )}
    </div>
  )
}