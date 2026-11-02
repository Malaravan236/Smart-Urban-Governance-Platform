import { STATUSES } from '../../utils/constants'

export default function StatusBadge({ status }) {
  return <span className={`pill ${status}`}>{STATUSES[status] || status}</span>
}