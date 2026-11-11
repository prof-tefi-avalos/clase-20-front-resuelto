import mongoose from 'mongoose'

// Conecta Mongoose con MongoDB. La dirección de la base sale del archivo .env
// (MONGODB_URI), que Node carga gracias al flag --env-file del script "dev".
export async function conectarDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`🟢 MongoDB conectado · base: ${mongoose.connection.name}`)
  } catch (err) {
    // Sin base, ninguna ruta funcionaría: mostramos el motivo y cortamos el proceso.
    console.error('🔴 No se pudo conectar a MongoDB:', err.message)
    process.exit(1)
  }
}
