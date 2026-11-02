import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container">
      <div className="card empty">
        <h2>Page not found</h2>
        <p>The page you opened doesn't exist.</p>
        <Link to="/issues" className="btn btn-primary">Browse reports</Link>{' '}
        <Link to="/" className="btn">Go home</Link>
      </div>
    </div>
  )
}