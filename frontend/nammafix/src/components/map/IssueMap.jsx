import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { DEFAULT_CENTER, STATUS_COLORS, STATUSES } from '../../utils/constants'

function Recenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => { map.setView(center, zoom) }, [center[0], center[1], zoom])
  return null
}

export default function IssueMap({ issues = [], center, zoom = 13, big = false }) {
  const first = issues[0]
  const mid = center || (first ? [first.latitude, first.longitude] : DEFAULT_CENTER)

  return (
    <MapContainer center={mid} zoom={zoom} className={`map ${big ? 'map-big' : ''}`} scrollWheelZoom={big}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
      <Recenter center={mid} zoom={zoom} />
      {issues.map((i) => (
        <CircleMarker
          key={i.id}
          center={[i.latitude, i.longitude]}
          radius={8}
          pathOptions={{ color: STATUS_COLORS[i.status] || STATUS_COLORS.open, fillOpacity: 0.8 }}
        >
          {i.title && (
            <Popup>
              <b>{i.title}</b><br />
              {STATUSES[i.status]} · ▲ {i.support_count}<br />
              <Link to={`/issues/${i.id}`}>View details</Link>
            </Popup>
          )}
        </CircleMarker>
      ))}
    </MapContainer>
  )
}