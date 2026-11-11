// Punto de entrada del front. Monta la app en el div#root de index.html.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import { AuthProvider } from './contexto/AuthContext.jsx'
import './index.css'

// El orden de los envoltorios importa:
// - BrowserRouter habilita las rutas y los Link en toda la app.
// - AuthProvider envuelve a App: así cualquier componente de adentro puede leer
//   la sesión con useAuth(). Un componente fuera del Provider recibiría null.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
