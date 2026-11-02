import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { CATEGORIES, CATEGORY_ICONS } from '../../utils/constants'
import { timeAgo } from '../../utils/format'

export default function IssueCard({ issue }) {
  const place = issue.address || `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`
  return (
    <Link to={`/issues/${issue.id}`} className="icard">
      {issue.photo
        ? <img src={issue.photo} alt="" loading="lazy" />
        : <div className="icard-ph" aria-hidden="true">{CATEGORY_ICONS[issue.category]}</div>}
      <div className="icard-body">
        <h3>{issue.title}</h3>
        <p className="muted small">📍 {place}</p>
        <div className="icard-meta">
          <span className="pill cat">{CATEGORIES[issue.category]}</span>
          <StatusBadge status={issue.status} />
        </div>
        <div className="icard-foot muted small">
          <span>{timeAgo(issue.created_at)}{issue.distance_km != null && ` · ${issue.distance_km} km`}</span>
          <span aria-label={`${issue.support_count} supports`}>▲ {issue.support_count}</span>
        </div>
      </div>
    </Link>
  )
}