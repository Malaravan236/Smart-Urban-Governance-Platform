import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, useMap, useMapEvents } from 'react-leaflet'
import { DEFAULT_CENTER } from '../../utils/constants'

function ClickToPick({ onPick }) {
  useMapEvents({ click: (e) => onPick([e.latlng.lat, e.latlng.lng]) })
  return null
}

function Follow({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 16))
  }, [position?.[0], position?.[1]])
  return null
}

export default function LocationPicker({ position, onPick }) {
  return (
    <>
      <MapContainer center={position || DEFAULT_CENTER} zoom={13} className="map">
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
        <ClickToPick onPick={onPick} />
        <Follow position={position} />
        {position && (
          <CircleMarker center={position} radius={10} pathOptions={{ color: '#0a3326', fillColor: '#16a34a', fillOpacity: 1 }} />
        )}
      </MapContainer>
      <small className="muted">
        {position ? `Pin at ${position[0].toFixed(5)}, ${position[1].toFixed(5)}` : 'No location chosen yet.'}
      </small>
    </>
  )
}