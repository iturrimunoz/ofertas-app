import { useState } from "react"
import { supabase } from "../supabaseClient"

export default function Login({ onLogin }) {
  const [modo, setModo] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)

  const manejarSubmit = async () => {
    setCargando(true)
    setMensaje("")

    if (modo === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMensaje("❌ " + error.message)
      } else {
        onLogin(data.user)
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMensaje("❌ " + error.message)
      } else {
        setMensaje("✅ Revisa tu email para confirmar tu cuenta")
      }
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          📍 Ofertas App
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {modo === "login" ? "Ingresa a tu cuenta" : "Crea tu cuenta de comercio"}
        </p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setModo("login")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              modo === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setModo("registro")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              modo === "registro"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            Registrarse
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={manejarSubmit}
            disabled={cargando}
            className="bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {cargando ? "Cargando..." : modo === "login" ? "Ingresar" : "Registrarse"}
          </button>
        </div>

        {mensaje && (
          <p className="text-sm text-center mt-4 text-gray-600">{mensaje}</p>
        )}
      </div>
    </div>
  )
}