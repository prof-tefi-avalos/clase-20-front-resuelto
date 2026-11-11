// Punto de entrada de la API. Se ejecuta con "npm run dev".
// Acá se arma la aplicación de Express, se conectan las rutas y se levanta el servidor.
import express from 'express'
import { conectarDB } from './config/db.js'
import authRouter from './routes/auth.routes.js'
import librosRouter from './routes/libros.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

// Middleware global: convierte el body de cada pedido (que llega como texto JSON)
// en un objeto, y lo deja en req.body. Sin esto, req.body sería undefined.
app.use(express.json())

// Cada router se monta en un prefijo. Las rutas de auth.routes.js quedan como
// /api/auth/registro y /api/auth/login; las de libros.routes.js, como /api/libros/...
app.use('/api/auth', authRouter)
app.use('/api/libros', librosRouter)

// El manejador de errores va siempre al final. Cualquier throw de un middleware o
// de un controller termina acá, y se convierte en una respuesta con su status.
app.use(errorHandler)

const PORT = process.env.PORT ?? 3000

// Primero se conecta a MongoDB y recién después se empiezan a recibir pedidos.
await conectarDB()

app.listen(PORT, () => {
  console.log(`🚀 API en http://localhost:${PORT}/api/libros`)
})
