// Deja la base como al principio: Ana (admin), Beto (lector) y cuatro libros.
// Se corre con: npm run semilla
import mongoose from 'mongoose'
import { cargarDatos } from './datos.js'

try {
  await mongoose.connect(process.env.MONGODB_URI)
  await cargarDatos()
  console.log(`🌱 Semilla lista: 2 usuarios y 4 libros en ${mongoose.connection.name}`)
} catch (err) {
  console.error('🔴 La semilla falló:', err.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
