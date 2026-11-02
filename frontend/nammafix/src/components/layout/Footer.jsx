import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} NammaFix. Built for a better community.</span>
      <span><Link to="/issues">Reports</Link> · <Link to="/map">Map</Link></span>
    </footer>
  )
}