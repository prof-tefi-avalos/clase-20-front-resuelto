import { useState } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../servicios/api.js'

export default function Registro() {
  // Formulario controlado: el estado guarda lo que se escribe en cada input.
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Una sola función para los tres inputs: usa el name del input como clave.
  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function enviar(e) {
    e.preventDefault()
    try {
      // La API hashea la contraseña antes de guardarla.
      await api.post('/auth/registro', form)
      navigate('/login')
    } catch (err) {
      // Por ejemplo: "La contraseña necesita al menos 8 caracteres" o un email repetido.
      setError(err.response?.data?.error?.message ?? 'No se pudo crear la cuenta')
    }
  }

  return (
    <form className="angosto" onSubmit={enviar}>
      <h1>Crear cuenta</h1>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={cambiar} required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={cambiar} required />
      <input name="password" type="password" placeholder="Contraseña (8 o más)" value={form.password} onChange={cambiar} required />
      <button className="primario">Crear cuenta</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
