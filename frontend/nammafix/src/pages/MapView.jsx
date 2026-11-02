import { useEffect, useState } from 'react'
import { nearbyIssues } from '../services/issueService'
import useGeolocation from '../hooks/useGeolocation'
import IssueMap from '../components/map/IssueMap'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { CATEGORIES, STATUSES, STATUS_COLORS, DEFAULT_CENTER } from '../utils/constants'

export default function MapView() {
  const { pos, error: geoError, loading: locating, locate } = useGeolocation()
  const center = pos || DEFAULT_CENTER
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [f, setF] = useState({ category: '', status: '', search: '' })

  useEffect(() => {
    setLoading(true)
    nearbyIssues(center[0], center[1], 20)
      .then((d) => { setIssues(d); setError('') })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [center[0], center[1]])

  const q = f.search.trim().toLowerCase()
  const shown = issues.filter((i) =>
    (!f.category || i.category === f.category) &&
    (!f.status || i.status === f.status) &&
    (!q || i.title.toLowerCase().includes(q) || (i.address || '').toLowerCase().includes(q)),
  )

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h2>Map</h2>
          <p className="muted">{shown.length} issues within 20 km</p>
        </div>
        <button className="btn" onClick={locate} disabled={locating}>
          {locating ? 'Finding you…' : '📍 Use my location'}
        </button>
      </div>

      <div className="filters">
        <input aria-label="Search reports" placeholder="Search reports" value={f.search}
          onChange={(e) => setF({ ...f, search: e.target.value })} />
        <select aria-label="Category" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
          <option value="">All categories</option>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select aria-label="Status" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
          <option value="">All status</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="legend">
        {['open', 'in_progress', 'resolved'].map((s) => (
          <span key={s}><i className="dot" style={{ background: STATUS_COLORS[s] }} />{STATUSES[s]}</span>
        ))}
      </div>

      <ErrorMessage message={geoError || error} />
      {loading && <Loader />}
      <IssueMap issues={shown} center={center} zoom={pos ? 14 : 12} big />
    </div>
  )
}