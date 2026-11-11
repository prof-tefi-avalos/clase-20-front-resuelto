import { useEffect, useState } from 'react'
import { api } from '../servicios/api.js'
import { useAuth } from '../contexto/AuthContext.jsx'
import { TarjetaLibro } from '../componentes/TarjetaLibro.jsx'

// Página privada (ver RutaPrivada en App.jsx). Todos sus pedidos llevan el token,
// gracias al interceptor de api.js: por eso la API sabe de quién son los libros.
export default function MisLibros() {
  const { cerrarSesion } = useAuth()
  const [libros, setLibros] = useState([])
  const [error, setError] = useState(null)

  // Pide solo los libros del usuario. Sin token, la API responde 401 "Falta el token".
  useEffect(() => {
    api.get('/libros/mios')
      .then(({ data }) => setLibros(data.data))
      .catch((err) => setError(err.response?.data?.error?.message ?? 'No se pudo cargar'))
  }, [])

  async function agregar(e) {
    e.preventDefault()
    const datos = new FormData(e.target)
    try {
      // No mandamos el dueño: la API lo saca del token.
      const { data } = await api.post('/libros', {
        titulo: datos.get('titulo'),
        autor: datos.get('autor'),
        paginas: datos.get('paginas') || undefined,
      })
      setLibros([...libros, data.data])
      e.target.reset()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'No se pudo agregar')
    }
  }

  async function marcarLeido(id) {
    try {
      const { data } = await api.patch(`/libros/${id}/leido`)
      // Reemplaza en la lista el libro que cambió por el que devolvió la API.
      setLibros(libros.map((l) => (l._id === id ? data.data : l)))
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'No se pudo actualizar')
    }
  }

  // Derecho de supresión (art. 16, Ley 25.326): la persona borra su cuenta.
  async function borrarCuenta() {
    if (!confirm('¿Seguro? Se borran tu cuenta y tus libros, y no se puede deshacer.')) return
    try {
      // No hace falta mandar el id: la API sabe quién es por el token.
      await api.delete('/auth/cuenta')
      // La cuenta ya no existe: se cierra la sesión y RutaPrivada manda al login.
      cerrarSesion()
    } catch (err) {
      setError(err.response?.data?.error?.message ?? 'No se pudo borrar la cuenta')
    }
  }

  return (
    <>
      <h1>Mis libros</h1>
      <form className="linea" onSubmit={agregar}>
        <input name="titulo" placeholder="Título" required />
        <input name="autor" placeholder="Autor" required />
        <input name="paginas" type="number" min="1" placeholder="Páginas" />
        <button className="primario">Agregar</button>
      </form>
      {error && <p className="error">{error}</p>}
      {libros.length === 0 && <p className="vacio">Todavía no cargaste libros.</p>}
      <section className="lista">
        {libros.map((l) => (
          <TarjetaLibro key={l._id} libro={l}>
            {!l.leido && <button onClick={() => marcarLeido(l._id)}>Ya lo leí</button>}
          </TarjetaLibro>
        ))}
      </section>
      <button className="peligro" onClick={borrarCuenta}>Borrar mi cuenta</button>
    </>
  )
}
