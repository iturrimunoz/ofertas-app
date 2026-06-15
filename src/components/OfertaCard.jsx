import { useState } from "react"

export default function OfertaCard({ oferta, onEliminar }) {
  const [reclamada, setReclamada] = useState(false)

  return (
    <div className={`bg-white rounded-2xl shadow p-5 flex justify-between items-center transition-all ${reclamada ? "opacity-50" : ""}`}>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          {oferta.comercio}
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mt-1">
          {oferta.producto}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          📍 {oferta.distancia}m de distancia
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setReclamada(!reclamada)}
            className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all ${
              reclamada
                ? "bg-gray-100 text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {reclamada ? "✓ Reclamada" : "Reclamar oferta"}
          </button>
          <button
            onClick={() => onEliminar(oferta.id)}
            className="text-sm font-medium px-4 py-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-all"
          >
            🗑 Eliminar
          </button>
        </div>
      </div>
      <div className="text-right">
        <span className="bg-green-100 text-green-700 text-xl font-bold px-4 py-2 rounded-xl">
          -{oferta.descuento}%
        </span>
        <p className="text-xs text-orange-500 font-medium mt-2">
          ⏱ {oferta.tiempo_restante}
        </p>
      </div>
    </div>
  )
}