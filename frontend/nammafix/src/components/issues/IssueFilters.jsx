import { CATEGORIES, STATUSES } from '../../utils/constants'

export default function IssueFilters({ filters, onChange }) {
  const set = (k) => (e) => onChange({ ...filters, [k]: e.target.value })
  return (
    <div className="filters">
      <input aria-label="Search reports" placeholder="Search reports" value={filters.search} onChange={set('search')} />
      <select aria-label="Category" value={filters.category} onChange={set('category')}>
        <option value="">All categories</option>
        {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <select aria-label="Status" value={filters.status} onChange={set('status')}>
        <option value="">All status</option>
        {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <select aria-label="Sort by" value={filters.ordering} onChange={set('ordering')}>
        <option value="-created_at">Newest first</option>
        <option value="-support_count">Most supported</option>
      </select>
    </div>
  )
}