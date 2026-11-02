export default function StatCard({ label, value, icon, tone = 'green' }) {
  return (
    <div className="stat">
      <span className={`stat-ico ${tone}`} aria-hidden="true">{icon}</span>
      <div>
        <div className="muted small">{label}</div>
        <div className="stat-num">{value}</div>
      </div>
    </div>
  )
}