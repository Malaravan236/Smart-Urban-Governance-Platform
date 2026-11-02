import { useState } from 'react'
import ErrorMessage from '../common/ErrorMessage'

export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      await onSubmit(text)
      setText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="comment">Add a comment</label>
      <textarea id="comment" rows="2" placeholder="Write a comment…" value={text} onChange={(e) => setText(e.target.value)} />
      <ErrorMessage message={error} />
      <p><button className="btn btn-primary" disabled={busy || !text.trim()}>{busy ? 'Posting…' : 'Post'}</button></p>
    </form>
  )
}