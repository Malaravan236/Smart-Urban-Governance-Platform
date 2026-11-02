import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useIssues from '../hooks/useIssues'
import IssueFilters from '../components/issues/IssueFilters'
import IssueCard from '../components/issues/IssueCard'
import Pagination from '../components/common/Pagination'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'

export default function IssueList() {
  const [params] = useSearchParams()
  const [filters, setFilters] = useState({
    search: '',
    category: params.get('category') || '',
    status: params.get('status') || '',
    ordering: '-created_at',
  })
  const [page, setPage] = useState(1)
  const { results, next, previous, count, loading, error } = useIssues(filters, page)

  // Home page category chips link here with ?category=...
  useEffect(() => {
    setFilters((f) => ({ ...f, category: params.get('category') || '', status: params.get('status') || '' }))
    setPage(1)
  }, [params])

  const changeFilters = (f) => { setFilters(f); setPage(1) }

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h2>All Reports</h2>
          <p className="muted">{count} reports from the community</p>
        </div>
      </div>

      <IssueFilters filters={filters} onChange={changeFilters} />

      {loading && <Loader />}
      <ErrorMessage message={error} />
      {!loading && !error && results.length === 0 && <div className="card empty">No reports match these filters.</div>}
      <div className="card-grid">
        {results.map((i) => <IssueCard key={i.id} issue={i} />)}
      </div>
      <Pagination page={page} hasPrev={!!previous} hasNext={!!next} onPage={setPage} />
    </div>
  )
}