import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/common/Logo'
import ErrorMessage from '../components/common/ErrorMessage'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      await login(form.username, form.password)
      navigate(location.state?.from || '/dashboard', { replace: true })
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
          <h2>Login to your account</h2>
          <div className="field">
            <span className="ico" aria-hidden="true">👤</span>
            <input aria-label="Username" placeholder="Username" required autoComplete="username"
              value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="field">
            <span className="ico" aria-hidden="true">🔒</span>
            <input aria-label="Password" placeholder="Password" className="has-toggle" required
              type={show ? 'text' : 'password'} autoComplete="current-password"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" className="pw-toggle" onClick={() => setShow(!show)}
              aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? '🙈' : '👁️'}
            </button>
          </div>
          <ErrorMessage message={error} />
          <p><button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</button></p>
          <p className="auth-foot muted">Don't have an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </div>
  )
}