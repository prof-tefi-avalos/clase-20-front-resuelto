import { Routes, Route } from 'react-router'
import { Navbar } from './componentes/Navbar.jsx'
import { RutaPrivada } from './componentes/RutaPrivada.jsx'
import Catalogo from './paginas/Catalogo.jsx'
import Login from './paginas/Login.jsx'
import Registro from './paginas/Registro.jsx'
import MisLibros from './paginas/MisLibros.jsx'
import Admin from './paginas/Admin.jsx'

export default function App() {
  return (
    <>
      {/* La Navbar está fuera de Routes: se ve en todas las páginas. */}
      <Navbar />
      <main>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Una Route sin path envuelve a otras. Primero se ejecuta RutaPrivada: */}
          {/* si hay sesión, muestra la ruta hija en su Outlet; si no, redirige. */}
          <Route element={<RutaPrivada />}>
            <Route path="/mis-libros" element={<MisLibros />} />
          </Route>

          {/* Igual, pero además exige el rol admin. */}
          <Route element={<RutaPrivada roles={['admin']} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}
