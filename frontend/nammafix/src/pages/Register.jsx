import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/common/Logo'
import ErrorMessage from '../components/common/ErrorMessage'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setBusy(true); setError('')
    try {
      await register(form.username, form.password, form.email)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-head">
          <Logo />
          <p>Report Problems. Connect Communities. Track Solutions.</p>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <h2>Create your account</h2>
          <div className="field">
            <span className="ico" aria-hidden="true">👤</span>
            <input aria-label="Username" placeholder="Username (no spaces)" required autoComplete="username"
              value={form.username} onChange={set('username')} />
          </div>
          <div className="field">
            <span className="ico" aria-hidden="true">✉️</span>
            <input aria-label="Email" type="email" placeholder="Email address" autoComplete="email"
              value={form.email} onChange={set('email')} />
          </div>
          <div className="field">
            <span className="ico" aria-hidden="true">🔒</span>
            <input aria-label="Password" type="password" placeholder="Password (min 8 characters)" required minLength={8}
              autoComplete="new-password" value={form.password} onChange={set('password')} />
          </div>
          <div className="field">
            <span className="ico" aria-hidden="true">🔒</span>
            <input aria-label="Confirm password" type="password" placeholder="Confirm password" required
              autoComplete="new-password" value={form.confirm} onChange={set('confirm')} />
          </div>
          <ErrorMessage message={error} />
          <p><button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button></p>
          <p className="auth-foot muted">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  )
}