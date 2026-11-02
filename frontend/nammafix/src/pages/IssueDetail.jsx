import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getIssue, addComment, deleteIssue, } from '../services/issueService'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/issues/StatusBadge'
import SupportButton from '../components/issues/SupportButton'
import CommentList from '../components/issues/CommentList'
import CommentForm from '../components/issues/CommentForm'
import IssueMap from '../components/map/IssueMap'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { CATEGORIES } from '../utils/constants'
import { timeAgo } from '../utils/format'

export default function IssueDetail() {
  const { id } = useParams()
  const { isAuthed } = useAuth()
  const [issue, setIssue] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(
    () => getIssue(id).then((d) => { setIssue(d); setError('') }).catch((e) => setError(e.message)),
    [id],
  )
  useEffect(() => { setIssue(null); load() }, [load])

  const handleDelete = async () => {
  if (!window.confirm('Delete this issue?')) return;

  try {
    await deleteIssue(id);
    window.location.href = '/issues';
  } catch (error) {
    setError(error.message);
  }
};

  const postComment = async (text) => { await addComment(id, text); await load() }

  if (error) return <div className="container"><ErrorMessage message={error} /></div>
  if (!issue) return <Loader />

  return (
    <div className="container">
      <p><Link to="/issues">← Back to reports</Link></p>

      <div className="detail">
        <div>
          {issue.photo && <img className="hero-img" src={issue.photo} alt={issue.title} />}

          <div className="card" style={{ marginTop: 16 }}>
            <div className="icard-meta">
              <StatusBadge status={issue.status} />
              <span className="pill cat">{CATEGORIES[issue.category]}</span>
            </div>
            <h2>{issue.title}</h2>
            <p className="muted small">
              📍 {issue.address || `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`} ·
              reported by {issue.user} · {timeAgo(issue.created_at)}
            </p>

            {issue.duplicate_of && (
              <p className="error">
                This was already reported. See <Link to={`/issues/${issue.duplicate_of}`}>the original report</Link>.
              </p>
            )}

            <h3>Description</h3>
            <p>{issue.description}</p>
          </div>

          <IssueMap issues={[issue]} center={[issue.latitude, issue.longitude]} zoom={16} />
        </div>

        {/* <div className="card">
  <h3>Manage Issue</h3> */}

  {/* <button
    type="button"
    onClick={handleDelete}
    disabled={!isAuthed}
  >
    Delete Issue
  </button> */}
{/* </div> */}

        <div>
          <div className="card">
            <h3>Support this report</h3>
            <SupportButton issue={issue} onChange={load} />
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>Updates and comments ({issue.comments.length})</h3>
            <CommentList comments={issue.comments} />
            {isAuthed
              ? <CommentForm onSubmit={postComment} />
              : <p><Link to="/login" state={{ from: `/issues/${id}` }}>Login</Link> to comment.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}