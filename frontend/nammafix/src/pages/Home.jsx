import { Link } from 'react-router-dom'
import useIssues from '../hooks/useIssues'
import { useAuth } from '../context/AuthContext'
import PublicNav from '../components/layout/PublicNav'
import Footer from '../components/layout/Footer'
import IssueCard from '../components/issues/IssueCard'
import Loader from '../components/common/Loader'
import { CATEGORIES, CATEGORY_ICONS } from '../utils/constants'

const LATEST = { ordering: '-created_at' }

const TILES = [
  { icon: '📍', title: 'Report Problems', text: 'Share issues with photos and location' },
  { icon: '🤝', title: 'Get Support', text: 'Let your community back your report' },
  { icon: '🔎', title: 'Track Status', text: 'Follow progress until it is fixed' },
  { icon: '🌱', title: 'See Impact', text: 'Build a better community together' },
]

export default function Home() {
  const { isAuthed } = useAuth()
  const { results, loading } = useIssues(LATEST, 1)

  return (
    <>
      <PublicNav />

      <section className="hero">
        <div className="in">
          <div>
            <h1>Together for a Better Community</h1>
            <p>
              Report local problems, get community support, and track solutions.
              Make your neighbourhood cleaner, safer and better.
            </p>
            <div className="hero-actions">
              <Link to={isAuthed ? '/report' : '/register'} className="btn btn-primary">Report a Problem</Link>
              <Link to="/issues" className="btn btn-light">View Reports</Link>
            </div>
          </div>
          <div className="hero-card">
            {TILES.map((t) => (
              <div className="hero-tile" key={t.title}>
                <span className="ico" aria-hidden="true">{t.icon}</span>
                <b>{t.title}</b>
                <span className="muted small">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cats">
        <h3>Popular Categories</h3>
        <div className="cat-row">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <Link key={key} to={`/issues?category=${key}`} className="cat-chip">
              <span aria-hidden="true">{CATEGORY_ICONS[key]}</span> {label}
            </Link>
          ))}
        </div>

        <div className="sec-head"><h3>Recent reports</h3><Link to="/issues">View all</Link></div>
        {loading && <Loader />}
        {!loading && results.length === 0 && <p className="muted">No reports yet. Be the first to report one.</p>}
        <div className="card-grid">
          {results.slice(0, 4).map((i) => <IssueCard key={i.id} issue={i} />)}
        </div>
      </section>

      <Footer />
    </>
  )
}