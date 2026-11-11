// Plus opcional: pruebas con React Testing Library (clase 19).
// Se corre con: npm test (no hace falta levantar la API).
// La idea es probar lo que ve una persona: links y botones, no detalles internos.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../contexto/AuthContext.jsx'
import { Navbar } from './Navbar.jsx'

// Renderiza la Navbar con lo que necesita: un router (por los Link) y el
// AuthProvider (por useAuth). Si recibe un usuario, lo deja en localStorage,
// que es de donde lo lee el contexto al arrancar.
function mostrarNavbar(usuario) {
  if (usuario) localStorage.setItem('usuario', JSON.stringify(usuario))
  render(
    <MemoryRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </MemoryRouter>,
  )
}

// Antes de cada test se limpia localStorage, para que un test no vea la sesión del anterior.
beforeEach(() => localStorage.clear())

test('sin sesión muestra Ingresar y no Mis libros', () => {
  mostrarNavbar(null)
  // getByRole busca como una persona: "un link que dice Ingresar". Si no lo encuentra, falla.
  expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument()
  // Para comprobar que algo NO está se usa queryByRole, que devuelve null en vez de fallar.
  expect(screen.queryByRole('link', { name: 'Mis libros' })).not.toBeInTheDocument()
})

test('un lector ve Mis libros, pero no Administrar', () => {
  mostrarNavbar({ id: '1', nombre: 'Beto', rol: 'lector' })
  expect(screen.getByRole('link', { name: 'Mis libros' })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Administrar' })).not.toBeInTheDocument()
})

test('al tocar Salir vuelve a mostrar Ingresar', async () => {
  mostrarNavbar({ id: '2', nombre: 'Ana', rol: 'admin' })
  // userEvent simula el click, como en el navegador.
  await userEvent.click(screen.getByRole('button', { name: 'Salir' }))
  expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument()
})
