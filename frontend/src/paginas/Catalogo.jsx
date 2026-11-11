import { useEffect, useState } from 'react'
import { api } from '../servicios/api.js'
import { TarjetaLibro } from '../componentes/TarjetaLibro.jsx'

// Página pública: lista todos los libros. Funciona con o sin sesión.
export default function Catalogo() {
  const [libros, setLibros] = useState([])

  // Se pide la lista una vez, al montar la página ([] = sin dependencias).
  useEffect(() => {
    api.get('/libros').then(({ data }) => setLibros(data.data))
  }, [])

  return (
    <>
      <h1>Catálogo del club</h1>
      <section className="lista">
        {libros.map((l) => <TarjetaLibro key={l._id} libro={l} />)}
      </section>
    </>
  )
}
