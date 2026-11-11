import { Schema, model } from 'mongoose'

const libroSchema = new Schema({
  titulo: { type: String, required: [true, 'El título es obligatorio'], trim: true },
  autor: { type: String, required: [true, 'El autor es obligatorio'], trim: true },
  paginas: { type: Number, min: [1, 'Tiene que tener al menos una página'] },
  leido: { type: Boolean, default: false },
  // El dueño del libro: el _id del usuario que lo cargó
  // ref: 'Usuario' indica a qué modelo apunta ese id (sirve para populate).
  lector: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
}, { timestamps: true })

export default model('Libro', libroSchema, 'libros')
