import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { myReports } from '../services/issueService'
import IssueCard from '../components/issues/IssueCard'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { STATUSES } from '../utils/constants'

export default function MyReports() {
  const [issues, setIssues] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    myReports().then(setIssues).catch((e) => setError(e.message))
  }, [])

  const shown = issues?.filter((i) => !status || i.status === status)

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h2>My Reports</h2>
          <p className="muted">Track every issue you have reported.</p>
        </div>
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 180 }}>
          <option value="">All status</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <ErrorMessage message={error} />
      {!issues && !error && <Loader />}
      {issues?.length === 0 && (
        <div className="card empty">
          You haven't reported anything yet.<br />
          <Link to="/report" className="btn btn-primary" style={{ marginTop: 12 }}>Report your first issue</Link>
        </div>
      )}
      {issues?.length > 0 && shown.length === 0 && <div className="card empty">No reports with this status.</div>}
      <div className="card-grid">
        {shown?.map((i) => <IssueCard key={i.id} issue={i} />)}
      </div>
    </div>
  )
}