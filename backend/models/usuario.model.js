import { Schema, model } from 'mongoose'

// El esquema dice qué campos tiene un usuario y qué reglas cumple cada uno.
const usuarioSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  // unique: true crea un índice en MongoDB, así no puede haber dos cuentas con el mismo email.
  // lowercase y trim lo normalizan: "Ana@Club.com " se guarda como "ana@club.com".
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // Acá se guarda el HASH de la contraseña, nunca el texto que escribió la persona.
  // select: false hace que las consultas no traigan este campo, salvo que se pida
  // a propósito con .select('+password'), como hacemos en el login.
  password: { type: String, required: true, select: false },
  // Solo se aceptan estos dos valores. Por defecto, todo usuario nuevo es lector:
  // nadie se puede registrar como admin.
  rol: { type: String, enum: ['lector', 'admin'], default: 'lector' },
}, { timestamps: true })

// El tercer argumento es el nombre de la colección en MongoDB.
export default model('Usuario', usuarioSchema, 'usuarios')
