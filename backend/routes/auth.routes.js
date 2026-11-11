import { Router } from 'express'
import { registrar, login, borrarCuenta } from '../controllers/auth.controller.js'
import { verificarToken } from '../middlewares/auth.js'

const router = Router()

// Públicas: para registrarse o iniciar sesión no hace falta token.
router.post('/registro', registrar)
router.post('/login', login)
// Con token: solo se puede borrar la cuenta propia.
router.delete('/cuenta', verificarToken, borrarCuenta)

export default router
