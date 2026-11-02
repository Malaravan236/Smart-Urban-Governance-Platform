import { useEffect, useState } from 'react'
import ErrorMessage from './ErrorMessage'

const MAX_MB = 5

export default function ImageUpload({ file, onChange }) {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const pick = (e) => {
    const f = e.target.files[0]
    if (!f) return onChange(null)
    if (!f.type.startsWith('image/')) return setError('Choose an image file.')
    if (f.size > MAX_MB * 1024 * 1024) return setError(`Photo must be under ${MAX_MB} MB.`)
    setError('')
    onChange(f)
  }

  return (
    <div>
      <input type="file" accept="image/*" capture="environment" onChange={pick} aria-label="Photo" />
      <ErrorMessage message={error} />
      {preview && <img src={preview} alt="Selected preview" style={{ maxWidth: 220, marginTop: 8, borderRadius: 8 }} />}
    </div>
  )
}