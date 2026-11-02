import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useIssues from '../hooks/useIssues'
import { analytics, resolveIssue } from '../services/issueService'
import StatCard from '../components/common/StatCard'
import StatusBadge from '../components/issues/StatusBadge'
import Pagination from '../components/common/Pagination'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { STATUSES, CATEGORIES } from '../utils/constants'

function AdminRow({ issue, onSaved }) {
  const [status, setStatus] = useState('in_progress')
  const [remarks, setRemarks] = useState('')
  const [msg, setMsg] = useState({ text: '', ok: false })
  const [busy, setBusy] = useState(false)

  const save = async () => {
    setBusy(true)
    try {
      await resolveIssue(issue.id, status, remarks)
      setMsg({ text: 'Saved', ok: true })
      onSaved()
    } catch (e) {
      setMsg({ text: e.message, ok: false })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="icard-meta">
        <StatusBadge status={issue.status} />
        <span className="pill cat">{CATEGORIES[issue.category]}</span>
        <span className="muted small">▲ {issue.support_count} · by {issue.user}</span>
      </div>
      <h3 style={{ margin: '4px 0' }}><Link to={`/issues/${issue.id}`}>{issue.title}</Link></h3>
      <p className="muted small" style={{ margin: 0 }}>{issue.address || 'No address given'}</p>

      <div className="filters" style={{ marginTop: 12, marginBottom: 0 }}>
        <select aria-label="New status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {Object.entries(STATUSES).filter(([k]) => k !== 'duplicate').map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <input aria-label="Remarks" placeholder="Remarks (shown in timeline)" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Update status'}</button>
      </div>
      {msg.text && <span className={msg.ok ? 'success' : 'error'}>{msg.text}</span>}
    </div>
  )
}

export default function AdminPanel() {
  const [stats, setStats] = useState(null)
  const [statusFilter, setStatusFilter] = useState('open')
  const [page, setPage] = useState(1)
  const { results, next, previous, loading, error, reload } = useIssues(
    { status: statusFilter, ordering: '-support_count' }, page,
  )

  const loadStats = () => analytics().then(setStats).catch(() => {})
  useEffect(() => { loadStats() }, [])

  const countOf = (s) => stats?.by_status.find((r) => r.status === s)?.count ?? 0

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="muted">Review reports and update their status.</p>
        </div>
      </div>

      <div className="stats">
        <StatCard label="Total Reports" value={stats?.total ?? '–'} icon="📄" tone="blue" />
        <StatCard label="Open" value={stats ? countOf('open') : '–'} icon="⚠️" tone="red" />
        <StatCard label="In Progress" value={stats ? countOf('in_progress') : '–'} icon="⏳" tone="amber" />
        <StatCard label="Resolved" value={stats ? `${stats.resolved_rate}%` : '–'} icon="✅" tone="green" />
      </div>

      <div className="page-head">
        <h3 style={{ margin: 0 }}>Reports</h3>
        <select aria-label="Show reports" value={statusFilter} style={{ width: 200 }}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading && <Loader />}
      <ErrorMessage message={error} />
      {!loading && !error && results.length === 0 && <div className="card empty">Nothing here. All clear. 🎉</div>}
      {results.map((i) => <AdminRow key={i.id} issue={i} onSaved={() => { reload(); loadStats() }} />)}
      <Pagination page={page} hasPrev={!!previous} hasNext={!!next} onPage={setPage} />
    </div>
  )
}
