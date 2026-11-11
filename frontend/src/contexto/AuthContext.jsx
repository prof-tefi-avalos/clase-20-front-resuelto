import { createContext, useContext, useState } from 'react'
import { api } from '../servicios/api.js'

// Context permite compartir la sesión con toda la app sin pasarla por props
// de componente en componente (prop drilling).
// 1. Se crea el contexto. null es lo que recibe quien lo lea fuera del Provider.
const AuthContext = createContext(null)

// Lee el usuario que quedó guardado de un login anterior.
// localStorage guarda solo texto, por eso se convierte con JSON.parse.
function leerUsuarioGuardado() {
  const guardado = localStorage.getItem('usuario')
  return guardado ? JSON.parse(guardado) : null
}

// 2. El Provider: un componente que guarda la sesión y se la da a sus hijos.
export function AuthProvider({ children }) {
  // El estado arranca con lo guardado en localStorage. Por eso, al recargar la
  // página, la sesión sigue. Se pasa la función (sin paréntesis) para que React
  // la ejecute una sola vez, al crear el componente.
  const [usuario, setUsuario] = useState(leerUsuarioGuardado)

  async function iniciarSesion(email, password) {
    // Pide el login. La API responde { data: { token, usuario }, error }, y axios
    // pone esa respuesta en data: por eso se lee data.data.
    const { data } = await api.post('/auth/login', { email, password })
    // El token es para la API: lo usa el interceptor de api.js en cada pedido.
    localStorage.setItem('token', data.data.token)
    // El usuario es para la pantalla. Se guarda como texto con JSON.stringify.
    localStorage.setItem('usuario', JSON.stringify(data.data.usuario))
    // Al cambiar el estado, todos los componentes que usan useAuth se vuelven a
    // renderizar: por ejemplo, la Navbar muestra "Hola, Beto".
    setUsuario(data.data.usuario)
  }

  function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  // Lo que comparte el contexto: quién entró y las dos funciones de sesión.
  const valor = { usuario, iniciarSesion, cerrarSesion }
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

// 3. Un hook propio para leer el contexto: en cualquier componente se escribe
// const { usuario } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
