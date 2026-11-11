import { Link } from 'react-router'
import { useAuth } from '../contexto/AuthContext.jsx'

// UI dinámica: el menú cambia según quién entró, leyendo el contexto.
// Cuando cambia el usuario del contexto (login o Salir), se vuelve a renderizar sola.
export function Navbar() {
  const { usuario, cerrarSesion } = useAuth()

  return (
    <nav>
      <Link to="/">Catálogo</Link>
      {/* && muestra lo de la derecha solo si lo de la izquierda es verdadero. */}
      {usuario && <Link to="/mis-libros">Mis libros</Link>}
      {/* Sin sesión, usuario es null: el ?. evita el error y devuelve undefined. */}
      {usuario?.rol === 'admin' && <Link to="/admin">Administrar</Link>}

      <div className="derecha">
        {/* Ternario: con sesión, el saludo y Salir; sin sesión, los links para entrar. */}
        {usuario ? (
          <>
            <span>Hola, {usuario.nombre}</span>
            <button onClick={cerrarSesion}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login">Ingresar</Link>
            <Link to="/registro">Crear cuenta</Link>
          </>
        )}
      </div>
    </nav>
  )
}
