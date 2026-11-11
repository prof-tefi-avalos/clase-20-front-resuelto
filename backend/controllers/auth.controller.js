import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Usuario from '../models/usuario.model.js'
import Libro from '../models/libro.model.js'
import { crearError } from '../middlewares/errorHandler.js'

// POST /api/auth/registro
// Crea un usuario nuevo. La contraseña se guarda hasheada.
export async function registrar(req, res) {
  // Validamos el largo ANTES de hashear. El hash siempre mide 60 caracteres,
  // así que una regla minlength en el esquema dejaría pasar una contraseña como "123".
  if (typeof req.body.password !== 'string' || req.body.password.length < 8) {
    throw crearError('La contraseña necesita al menos 8 caracteres', 400)
  }

  // Tomamos del body solo los tres campos que se pueden elegir.
  // Si alguien manda rol: 'admin', queda afuera y el usuario se crea como lector.
  const { nombre, email, password } = req.body
  // bcrypt.hash genera un salt aleatorio y calcula el hash con costo 10.
  // El resultado se ve así: $2b$10$... (algoritmo, costo, salt y hash, todo junto).
  // Va con await porque es lento a propósito: devuelve una promesa.
  const hash = await bcrypt.hash(password, 10)
  // En el campo password guardamos el hash. El texto original no queda en ningún lado.
  const usuario = await Usuario.create({ nombre, email, password: hash })

  // 201 significa "creado". Respondemos sin la contraseña ni el hash.
  res.status(201).json({
    data: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
    error: null,
  })
}

// POST /api/auth/login
// Comprueba email y contraseña, y si están bien devuelve un token.
export async function login(req, res) {
  const { email, password } = req.body
  // Si email o password no son textos (por ejemplo, un objeto), cortamos con 400.
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw crearError('Faltan el email o la contraseña', 400)
  }

  // Buscamos al usuario. Como el modelo tiene select: false en password,
  // hay que pedir el hash a propósito con .select('+password').
  const usuario = await Usuario.findOne({ email }).select('+password')

  // Si el email no existe, usuario es null y el && corta ahí, sin llamar a compare.
  // Si existe, bcrypt.compare saca el salt y el costo del hash guardado, hashea lo que
  // escribió la persona y compara. Un hash no se "desencripta": se vuelve a calcular.
  // El await es clave: sin él, coincide sería una promesa, que siempre cuenta como
  // verdadera, y entraría cualquiera.
  const coincide = usuario && await bcrypt.compare(password, usuario.password)
  // Un solo mensaje para los dos casos (email inexistente o contraseña mala),
  // así nadie puede averiguar qué emails tienen cuenta.
  if (!coincide) throw crearError('Email o contraseña incorrectos', 401)

  // Firmamos el token. Tiene tres partes:
  // 1. El payload: los datos que la API va a leer en cada pedido (id y rol).
  //    No está cifrado: cualquiera lo puede leer en jwt.io, por eso no va nada privado.
  // 2. El secreto, del .env. Solo lo tiene la API: sin él, nadie puede fabricar un token válido.
  // 3. Las opciones: expiresIn agrega el vencimiento. A la hora, el token deja de servir.
  const token = jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  )

  // Devolvemos el token y los datos del usuario que necesita el front para la pantalla.
  res.json({
    data: { token, usuario: { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol } },
    error: null,
  })
}

// DELETE /api/auth/cuenta (con token)
// Derecho de supresión (art. 16, Ley 25.326): la persona borra su cuenta y sus datos.
export async function borrarCuenta(req, res) {
  // Primero sus libros y después el usuario. El id sale del token, así que cada uno
  // solo puede borrar su propia cuenta.
  await Libro.deleteMany({ lector: req.usuario.id })
  await Usuario.findByIdAndDelete(req.usuario.id)
  res.status(204).end()
}
