import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix icono por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Coordenadas del centro de Santa Cruz de la Sierra
const CENTRO_SANTA_CRUZ = [-17.7863, -63.1812]

// Coordenadas de ejemplo para cada comercio
const coordenadasComercios = {
  "Farmacorp": [-17.7833, -63.1821],
  "Fidalga": [-17.7910, -63.1756],
  "Ventura Mall": [-17.7650, -63.1950],
}

export default function Mapa({ ofertas }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow mb-6" style={{ height: '350px' }}>
      <MapContainer
        center={CENTRO_SANTA_CRUZ}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ofertas.map(oferta => {
          const coords = coordenadasComercios[oferta.comercio]
          if (!coords) return null
          return (
            <div key={oferta.id}>
              <Marker position={coords}>
                <Popup>
                  <strong>{oferta.comercio}</strong><br />
                  {oferta.producto}<br />
                  <span style={{ color: 'green' }}>-{oferta.descuento}%</span>
                </Popup>
              </Marker>
              <Circle
                center={coords}
                radius={oferta.distancia}
                pathOptions={{ color: '#3B82F6', fillColor: '#93C5FD', fillOpacity: 0.3 }}
              />
            </div>
          )
        })}
      </MapContainer>
    </div>
  )
}