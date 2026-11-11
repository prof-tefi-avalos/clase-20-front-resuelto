import { useEffect, useState } from 'react'
import { api } from '../servicios/api.js'
import { TarjetaLibro } from '../componentes/TarjetaLibro.jsx'

// Solo llegan acá los admins, por la RutaPrivada con roles={['admin']} de App.jsx.
export default function Admin() {
  const [libros, setLibros] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/libros').then(({ data }) => setLibros(data.data))
  }, [])

  async function borrar(id) {
    try {
      // El interceptor agrega el token. La API vuelve a revisar que sea admin
      // (verificarToken y soloRol): si no lo es, responde 403 y cae en el catch.
      await api.delete(`/libros/${id}`)
      // Si salió bien, se saca el libro de la lista sin volver a pedirla.
      setLibros(libros.filter((l) => l._id !== id))
    } catch (err) {
      // El mensaje de error viene de la API, en error.message.
      setError(err.response?.data?.error?.message ?? 'No se pudo borrar')
    }
  }

  return (
    <>
      <h1>Administrar</h1>
      {error && <p className="error">{error}</p>}
      <section className="lista">
        {libros.map((l) => (
          <TarjetaLibro key={l._id} libro={l}>
            <button onClick={() => borrar(l._id)}>Borrar</button>
          </TarjetaLibro>
        ))}
      </section>
    </>
  )
}
