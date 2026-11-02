export default function Pagination({ page, hasPrev, hasNext, onPage }) {
  if (!hasPrev && !hasNext) return null
  return (
    <div className="pager">
      <button className="btn" disabled={!hasPrev} onClick={() => onPage(page - 1)}>Previous</button>
      <span>Page {page}</span>
      <button className="btn" disabled={!hasNext} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  )
}