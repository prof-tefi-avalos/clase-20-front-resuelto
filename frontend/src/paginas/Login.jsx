import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../contexto/AuthContext.jsx'

export default function Login() {
  // La lógica del login vive en el contexto: la página solo llama a iniciarSesion.
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  async function enviar(e) {
    e.preventDefault()
    // FormData lee los inputs del formulario por su atributo name.
    const datos = new FormData(e.target)
    try {
      await iniciarSesion(datos.get('email'), datos.get('password'))
      navigate('/mis-libros')
    } catch (err) {
      // Si la API responde 401, axios tira un error y mostramos su mensaje.
      setError(err.response?.data?.error?.message ?? 'No se pudo ingresar')
    }
  }

  return (
    <form className="angosto" onSubmit={enviar}>
      <h1>Ingresar</h1>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Contraseña" required />
      <button className="primario">Entrar</button>
      {error && <p className="error">{error}</p>}
      <p>¿No tenés cuenta? <Link to="/registro">Creala</Link></p>
    </form>
  )
}
