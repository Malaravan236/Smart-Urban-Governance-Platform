import { Link } from 'react-router-dom'

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="logo">
      <span className="logo-mark" aria-hidden="true">◉</span>
      NammaFix
    </Link>
  )
}