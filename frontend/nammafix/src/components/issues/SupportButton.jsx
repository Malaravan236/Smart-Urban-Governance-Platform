import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supportIssue, unsupportIssue } from '../../services/issueService'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../common/ErrorMessage'

export default function SupportButton({ issue, onChange }) {
  const { isAuthed } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthed) {
    return (
      <p>
        ▲ {issue.support_count} supports ·{' '}
        <Link to="/login" state={{ from: `/issues/${issue.id}` }}>Login</Link> to support this report.
      </p>
    )
  }

  const toggle = async () => {
    setBusy(true); setError('')
    try {
      await (issue.supported_by_me ? unsupportIssue(issue.id) : supportIssue(issue.id))
      await onChange?.()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <button
        className={`btn ${issue.supported_by_me ? 'on' : ''}`}
        onClick={toggle}
        disabled={busy}
        aria-pressed={issue.supported_by_me}
      >
        ▲ {issue.supported_by_me ? 'Supported' : 'Support'} ({issue.support_count})
      </button>
      <ErrorMessage message={error} />
    </div>
  )
}