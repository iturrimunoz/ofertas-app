import { useState, useEffect } from "react"
import OfertaCard from './components/OfertaCard'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import Mapa from './components/Mapa'




export default function App() {
  const [ofertas, setOfertas] = useState([])
  const [filtro, setFiltro] = useState("")
  const [orden, setOrden] = useState("distancia")
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [nuevaOferta, setNuevaOferta] = useState({
    comercio: "",
    producto: "",
    descuento: "",
    distancia: "",
    tiempoRestante: "",
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null)
      setCargando(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

 useEffect(() => {
  if (!usuario) return

  const cargarOfertas = async () => {
    const { data, error } = await supabase
      .from('ofertas')
      .select('*')

    if (error) {
      console.error('Error cargando ofertas:', error)
    } else {
      setOfertas(data)
    }
  }

  cargarOfertas()

  // Escuchar cambios en tiempo real
  const canal = supabase
    .channel('ofertas-canal')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ofertas' },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          setOfertas(prev => [...prev, payload.new])
        }
        if (payload.eventType === 'DELETE') {
          setOfertas(prev => prev.filter(o => o.id !== payload.old.id))
        }
      }
    )
    .subscribe()

  return () => supabase.removeChannel(canal)
}, [usuario])

  const agregarOferta = async () => {
    if (!nuevaOferta.comercio || !nuevaOferta.producto) return

    const { data, error } = await supabase
      .from('ofertas')
      .insert([{
        comercio: nuevaOferta.comercio,
        producto: nuevaOferta.producto,
        descuento: Number(nuevaOferta.descuento),
        distancia: Number(nuevaOferta.distancia),
        tiempo_restante: nuevaOferta.tiempoRestante,
      }])
      .select()

    if (error) {
      console.error('Error agregando oferta:', error)
    } else {
      setOfertas([...ofertas, data[0]])
    }

    setNuevaOferta({ comercio: "", producto: "", descuento: "", distancia: "", tiempoRestante: "" })
    setMostrarForm(false)
  }

  const eliminarOferta = async (id) => {
    const { error } = await supabase
      .from('ofertas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error eliminando oferta:', error)
    } else {
      setOfertas(ofertas.filter(oferta => oferta.id !== id))
    }
  }

  const ofertasFiltradas = ofertas
    .filter(oferta =>
      oferta.comercio.toLowerCase().includes(filtro.toLowerCase()) ||
      oferta.producto.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => orden === "distancia" ? a.distancia - b.distancia : b.descuento - a.descuento)

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Cargando... 📡</p>
      </div>
    )
  }

  if (!usuario) {
    return <Login onLogin={setUsuario} />
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800">
          📍 Ofertas cerca de ti
        </h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-gray-400 hover:text-red-500 transition-all"
        >
          Cerrar sesión
        </button>
      </div>
      <Mapa ofertas={ofertas}/>

      
      <p className="text-sm text-gray-500 mb-4">
        {ofertasFiltradas.length === 0
          ? "Sin ofertas disponibles"
          : `${ofertasFiltradas.length} oferta${ofertasFiltradas.length > 1 ? "s" : ""} disponible${ofertasFiltradas.length > 1 ? "s" : ""}`
        }
      </p>

      <button
        onClick={() => setMostrarForm(!mostrarForm)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all"
      >
        {mostrarForm ? "✕ Cancelar" : "+ Agregar oferta"}
      </button>

      {mostrarForm && (
        <div className="bg-white rounded-2xl shadow p-5 mb-6 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Comercio (ej: Farmacorp)"
            value={nuevaOferta.comercio}
            onChange={(e) => setNuevaOferta({ ...nuevaOferta, comercio: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Producto (ej: Vitamina C)"
            value={nuevaOferta.producto}
            onChange={(e) => setNuevaOferta({ ...nuevaOferta, producto: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            placeholder="Descuento % (ej: 25)"
            value={nuevaOferta.descuento}
            onChange={(e) => setNuevaOferta({ ...nuevaOferta, descuento: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            placeholder="Distancia en metros (ej: 80)"
            value={nuevaOferta.distancia}
            onChange={(e) => setNuevaOferta({ ...nuevaOferta, distancia: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Tiempo restante (ej: 10 min)"
            value={nuevaOferta.tiempoRestante}
            onChange={(e) => setNuevaOferta({ ...nuevaOferta, tiempoRestante: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={agregarOferta}
            className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-all"
          >
            ✓ Guardar oferta
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Buscar comercio o producto..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setOrden("distancia")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            orden === "distancia"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-500 border border-gray-300"
          }`}
        >
          📍 Más cercano
        </button>
        <button
          onClick={() => setOrden("descuento")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            orden === "descuento"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-500 border border-gray-300"
          }`}
        >
          🔥 Mayor descuento
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {ofertasFiltradas.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            😕 No se encontraron ofertas para <strong>"{filtro}"</strong>
          </div>
        ) : (
          ofertasFiltradas.map(oferta => (
            <OfertaCard key={oferta.id} oferta={oferta} onEliminar={eliminarOferta} />
          ))
        )}
      </div>
    </div>
  )
}