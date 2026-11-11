import Libro from '../models/libro.model.js'
import { crearError } from '../middlewares/errorHandler.js'

// En las rutas protegidas, verificarToken ya dejó en req.usuario los datos del token:
// { id, rol }. Los controllers usan req.usuario.id para saber quién hizo el pedido.

// GET /api/libros (público): todos los libros, con el nombre de quien los cargó.
export async function listarLibros(req, res) {
  // populate reemplaza el id de lector por el documento del usuario, solo con su nombre.
  const libros = await Libro.find().sort({ titulo: 1 }).populate('lector', 'nombre')
  res.json({ data: libros, error: null })
}

// GET /api/libros/mios (con token): solo los libros del usuario que hizo el pedido.
export async function listarMios(req, res) {
  const libros = await Libro.find({ lector: req.usuario.id }).sort({ titulo: 1 })
  res.json({ data: libros, error: null })
}

// POST /api/libros (con token)
export async function crearLibro(req, res) {
  // El dueño sale del token, que está firmado, y no del body, que lo escribe cualquiera.
  // Así nadie puede cargar un libro a nombre de otra persona.
  const { titulo, autor, paginas } = req.body
  const libro = await Libro.create({ titulo, autor, paginas, lector: req.usuario.id })
  res.status(201).json({ data: libro, error: null })
}

// PATCH /api/libros/:id/leido (con token)
export async function marcarLeido(req, res) {
  // El filtro pide las dos cosas: ese id Y que sea del usuario del token.
  // Si el libro es de otra persona, no lo encuentra y devuelve null.
  const libro = await Libro.findOneAndUpdate(
    { _id: req.params.id, lector: req.usuario.id },
    { leido: true },
    // returnDocument: 'after' hace que devuelva el libro ya actualizado.
    { returnDocument: 'after' },
  )
  if (!libro) throw crearError('No existe o no es tuyo', 404)
  res.json({ data: libro, error: null })
}

// DELETE /api/libros/:id (con token y rol admin)
export async function borrarLibro(req, res) {
  const libro = await Libro.findByIdAndDelete(req.params.id)
  if (!libro) throw crearError('No existe ese libro', 404)
  // 204 significa "salió bien y no hay nada que devolver".
  res.status(204).end()
}
