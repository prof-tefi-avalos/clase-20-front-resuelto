// Datos de prueba. Los usa la semilla.
import bcrypt from 'bcrypt'
import Usuario from './models/usuario.model.js'
import Libro from './models/libro.model.js'

export async function cargarDatos() {
  // Borra todo lo que haya, para arrancar siempre igual.
  await Usuario.deleteMany({})
  await Libro.deleteMany({})

  // Las contraseñas se guardan hasheadas, igual que en el registro.
  // Por eso, para entrar, el login tiene que usar bcrypt.compare.
  const [ana, beto] = await Usuario.create([
    { nombre: 'Ana', email: 'ana@club.com', password: await bcrypt.hash('lectura123', 10), rol: 'admin' },
    { nombre: 'Beto', email: 'beto@club.com', password: await bcrypt.hash('libros123', 10) },
  ])

  // Cada libro guarda en lector el _id de su dueño.
  await Libro.insertMany([
    { titulo: 'Rayuela', autor: 'Julio Cortázar', paginas: 600, lector: ana._id, leido: true },
    { titulo: 'Ficciones', autor: 'Jorge Luis Borges', paginas: 200, lector: ana._id },
    { titulo: 'El Eternauta', autor: 'Héctor G. Oesterheld', paginas: 350, lector: beto._id },
    { titulo: 'Mafalda 1', autor: 'Quino', paginas: 64, lector: beto._id, leido: true },
  ])

  return { ana, beto }
}
