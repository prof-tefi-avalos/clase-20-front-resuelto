import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../contexto/AuthContext.jsx'

// Envuelve a las rutas que necesitan sesión (ver App.jsx).
// roles es opcional: si se pasa, además exige uno de esos roles.
export function RutaPrivada({ roles }) {
  const { usuario } = useAuth()

  // Sin sesión: redirige al login. replace hace que el botón Atrás no vuelva acá.
  if (!usuario) {
    return <Navigate to="/login" replace />
  }
  // Con sesión, pero sin el rol pedido: vuelve al catálogo.
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />
  }

  // Todo bien: Outlet muestra la ruta hija que corresponda (MisLibros o Admin).
  // Esto mejora la experiencia, pero no es la seguridad: la API también lo controla.
  return <Outlet />
}
