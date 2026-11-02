export default function CommentList({ comments = [] }) {
  if (comments.length === 0) return <p className="muted">No updates yet.</p>
  return (
    <div>
      {comments.map((c) => (
        <div className="comment" key={c.id}>
          <b>{c.user}</b> <small className="muted">{new Date(c.created_at).toLocaleString()}</small>
          <div>{c.text}</div>
        </div>
      ))}
    </div>
  )
}