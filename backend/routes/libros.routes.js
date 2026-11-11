import { Router } from 'express'
import {
  listarLibros,
  listarMios,
  crearLibro,
  marcarLeido,
  borrarLibro,
} from '../controllers/libros.controller.js'
import { verificarToken, soloRol } from '../middlewares/auth.js'

const router = Router()

// Cada ruta lista, en orden, lo que se ejecuta. Si un middleware tira un error,
// lo que sigue no se ejecuta y el error va directo al errorHandler.

// Pública: cualquiera ve el catálogo.
router.get('/', listarLibros)
// Con token: verificarToken corre primero y, si pasa, sigue el controller.
router.get('/mios', verificarToken, listarMios)
router.post('/', verificarToken, crearLibro)
router.patch('/:id/leido', verificarToken, marcarLeido)
// Con token y rol admin. El orden importa: verificarToken crea req.usuario,
// y recién después soloRol puede leer su rol.
router.delete('/:id', verificarToken, soloRol('admin'), borrarLibro)

export default router
