import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createIssue } from '../services/issueService'
import useGeolocation from '../hooks/useGeolocation'
import LocationPicker from '../components/map/LocationPicker'
import ImageUpload from '../components/common/ImageUpload'
import ErrorMessage from '../components/common/ErrorMessage'
import { CATEGORIES } from '../utils/constants'

export default function ReportIssue() {
  const navigate = useNavigate()
  const { pos, setPos, error: geoError, loading: locating, locate } = useGeolocation()
  const [form, setForm] = useState({ title: '', description: '', category: 'pothole', address: '' })
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!pos) return setError('Choose a location first: use your location or tap the map.')
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('latitude', pos[0])
    fd.append('longitude', pos[1])
    if (photo) fd.append('photo', photo)

    setBusy(true); setError('')
    try {
      const created = await createIssue(fd)
      navigate(`/issues/${created.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h2>Report a Problem</h2>
          <p className="muted">Help your community by reporting local issues.</p>
        </div>
      </div>

      <form className="card form-card" onSubmit={submit}>
        <label htmlFor="title" style={{ marginTop: 0 }}>Problem title</label>
        <input id="title" required maxLength={200} placeholder="Enter a short title" value={form.title} onChange={set('title')} />

        <label htmlFor="category">Category</label>
        <select id="category" value={form.category} onChange={set('category')}>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <label htmlFor="description">Description</label>
        <textarea id="description" rows="4" required placeholder="Describe the problem in detail"
          value={form.description} onChange={set('description')} />

        <label>Upload photo</label>
        <div className="dropzone"><ImageUpload file={photo} onChange={setPhoto} /></div>

        <label htmlFor="address">Landmark or address (optional)</label>
        <input id="address" value={form.address} onChange={set('address')} />

        <label>Location</label>
        <button type="button" className="btn" onClick={locate} disabled={locating}>
          {locating ? 'Finding you…' : '📍 Use my location'}
        </button>{' '}
        <small className="muted">or tap the map to drop a pin</small>
        <ErrorMessage message={geoError} />
        <LocationPicker position={pos} onPick={setPos} />

        <ErrorMessage message={error} />
        <p><button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Submitting…' : 'Submit Report'}</button></p>
      </form>
    </div>
  )
}