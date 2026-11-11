// Muestra un libro. children es lo que se ponga entre las etiquetas, por ejemplo
// un botón: así la misma tarjeta sirve en el catálogo, en Mis libros y en Administrar.
export function TarjetaLibro({ libro, children }) {
  return (
    <article className="libro">
      <div className="datos">
        <h2>{libro.titulo}</h2>
        <p>
          {libro.autor}
          {libro.paginas && ` · ${libro.paginas} páginas`}
          {/* lector viene completo solo en el catálogo, gracias al populate de la API. */}
          {libro.lector?.nombre && ` · lo cargó ${libro.lector.nombre}`}
          {libro.leido && <span className="leido"> · ✓ leído</span>}
        </p>
      </div>
      {children}
    </article>
  )
}
