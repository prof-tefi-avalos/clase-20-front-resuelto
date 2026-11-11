import jwt from 'jsonwebtoken'
import Usuario from '../models/usuario.model.js'
import { crearError } from './errorHandler.js'

// Middleware: se ejecuta antes del controller en las rutas protegidas.
// Esta versión hace lo mismo que la del ejercicio 1 y además consulta la base (clase 19).
export async function verificarToken(req, res, next) {
  // El front manda: Authorization: Bearer eyJhbGci... (lo agrega el interceptor de api.js).
  const [tipo, token] = (req.headers.authorization ?? '').split(' ')
  if (tipo !== 'Bearer' || !token) throw crearError('Falta el token', 401)

  // payload se declara afuera del try para poder usarlo después.
  let payload
  try {
    // Revisa la firma y el vencimiento. Si algo falla, tira un error.
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw crearError('Token inválido o vencido', 401)
  }

  // El token es una foto del momento del login. Para que un cambio de rol o una cuenta
  // borrada valgan en el acto, buscamos al usuario en la base en cada pedido.
  const usuario = await Usuario.findById(payload.id)
  // Si la cuenta se borró (por ejemplo, con "Borrar mi cuenta"), el token deja de servir.
  if (!usuario) throw crearError('El usuario ya no existe', 401)

  // El rol sale de la base, no del token.
  req.usuario = { id: usuario.id, rol: usuario.rol }
  next()
}

// soloRol('admin') solo deja pasar a los admins. Va después de verificarToken,
// porque usa req.usuario. Sin permiso, responde 403.
export function soloRol(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) throw crearError('No tenés permiso', 403)
    next()
  }
}
