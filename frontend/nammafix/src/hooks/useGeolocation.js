import { useState } from 'react'

export default function useGeolocation() {
  const [pos, setPos] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const locate = () => {
    if (!navigator.geolocation) return setError('This browser cannot share location.')
    setLoading(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      (p) => { setPos([p.coords.latitude, p.coords.longitude]); setLoading(false) },
      () => { setError('Location is blocked. Tap the map to place the pin instead.'); setLoading(false) },
    )
  }
  return { pos, setPos, error, loading, locate }
}