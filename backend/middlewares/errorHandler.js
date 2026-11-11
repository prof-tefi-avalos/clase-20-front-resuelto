// Crea un error con un status HTTP, para tirarlo con throw.
// Ejemplo: throw crearError('No tenés permiso', 403)
export function crearError(message, status = 500) {
  const error = new Error(message)
  error.status = status
  return error
}

// Express reconoce un manejador de errores porque tiene CUATRO parámetros.
// En Express 5, un throw dentro de una función async también llega acá, sin try/catch.
export function errorHandler(err, req, res, next) {
  // Solo mostramos en consola los errores inesperados (los que no tienen status).
  if (!err.status) console.error(err)

  // Falló una regla del esquema (required, min, enum...). Es culpa de los datos: 400.
  if (err.name === 'ValidationError') {
    const campos = {}
    for (const [campo, detalle] of Object.entries(err.errors)) {
      campos[campo] = detalle.message
    }
    return res.status(400).json({ data: null, error: { message: 'Hay datos inválidos', campos } })
  }

  // Un valor no se pudo convertir al tipo del esquema, por ejemplo un id mal formado en la URL.
  if (err.name === 'CastError') {
    return res.status(400).json({ data: null, error: { message: `"${err.value}" no es un valor válido para ${err.path}` } })
  }

  // Clave duplicada: lo tira MongoDB por el índice de unique (por ejemplo, un email repetido).
  if (err.code === 11000) {
    const [campo, valor] = Object.entries(err.keyValue)[0]
    return res.status(409).json({ data: null, error: { message: `Ya existe un registro con ${campo} = ${valor}` } })
  }

  // Todo lo demás: nuestros crearError (401, 403, 404...) o un error inesperado (500).
  res.status(err.status || 500).json({
    data: null,
    error: { message: err.message || 'Error interno del servidor' },
  })
}
