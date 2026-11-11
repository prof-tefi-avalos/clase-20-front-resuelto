# Ejercicio 2 resuelto · El front del Club de lectura

Este es el front terminado, con comentarios en cada parte. Sirve para repasar por tu cuenta cómo se manda el token, cómo se comparte la sesión con Context y cómo cambia la pantalla según quién entró.

## Para correrlo

Dos terminales:

```bash
cd backend
npm install
npm run semilla
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Abrí `http://localhost:5173`. `npm test`, en `frontend/`, corre las pruebas de la Navbar.

| Usuario | Email | Contraseña | Rol |
|---|---|---|---|
| Ana | `ana@club.com` | `lectura123` | admin |
| Beto | `beto@club.com` | `libros123` | lector |

## En qué orden leer el código

El backend es el del ejercicio 1, también comentado. Si no lo leíste, empezá por su README. Acá conviene leer el front en este orden: primero dónde vive la sesión, después cómo se usa.

### 1. `frontend/src/main.jsx` · dónde se monta el contexto
Fijate que `AuthProvider` envuelve a `App`.
**Para entender:** ¿qué le pasaría a un componente que use `useAuth` fuera del `AuthProvider`?

### 2. `frontend/src/contexto/AuthContext.jsx` · la sesión en un solo lugar
Es el archivo más importante. Leé las tres partes numeradas (`createContext`, el `Provider` y `useAuth`) y después `iniciarSesion` y `cerrarSesion`.
**Para entender:** ¿por qué se guardan dos cosas en `localStorage`, el token y el usuario? ¿Por qué la sesión sigue al recargar la página?
**Probalo:** ingresá como Beto y mirá en DevTools → Application → Local Storage.

### 3. `frontend/src/servicios/api.js` · mandar el token en cada pedido
El interceptor agrega `Authorization: Bearer <token>` antes de cada pedido.
**Para entender:** ¿qué parte de la API lee ese header?
**Probalo:** en DevTools → Network, abrí el pedido a `mios` y buscá el header `Authorization`.

### 4. `frontend/src/paginas/Login.jsx` · usar el contexto
La página no sabe nada de tokens: solo llama a `iniciarSesion`.

### 5. `frontend/src/App.jsx` y `componentes/RutaPrivada.jsx` · rutas protegidas
En `App.jsx`, mirá cómo una `Route` sin `path` envuelve a `/mis-libros` y otra a `/admin`. Después leé `RutaPrivada`.
**Para entender:** ¿qué hace `<Outlet />`? ¿Para qué sirve `replace` en el `Navigate`?
**Probalo:** sin sesión, escribí `/mis-libros` en la barra. Como Beto, escribí `/admin`.

### 6. `frontend/src/componentes/Navbar.jsx` · la UI según quién entró
Leé las tres condiciones: `&&`, `?.` y el ternario.
**Para entender:** ¿qué pasaría sin el `?.` en `usuario?.rol`? ¿Ocultar "Administrar" impide que Beto borre un libro?
**Probalo:** tocá Salir y mirá cómo cambia el menú sin recargar.

### 7. `frontend/src/paginas/MisLibros.jsx` · una página que usa todo
Pide los libros con el token, agrega uno sin mandar el dueño y tiene el botón "Borrar mi cuenta" (art. 16, Ley 25.326).

### 8. `backend/middlewares/auth.js` · la otra punta
Compará esta versión de `verificarToken` con la del ejercicio 1: además busca al usuario en la base. Por eso, después de "Borrar mi cuenta", ese token deja de servir en el acto.

### 9. Plus: `frontend/src/componentes/Navbar.test.jsx` · pruebas de la pantalla
Prueban lo que ve una persona: qué links aparecen con y sin sesión.

## El viaje completo de un login

1. En `Login.jsx`, el formulario llama a `iniciarSesion(email, password)`.
2. `iniciarSesion` hace `POST /api/auth/login`. La API compara la contraseña con bcrypt y devuelve el token y el usuario.
3. El contexto guarda los dos en `localStorage` y llama a `setUsuario`.
4. Como cambió el estado del contexto, la `Navbar` se vuelve a renderizar y muestra "Hola, Beto" y "Mis libros".
5. `Login.jsx` navega a `/mis-libros`. `RutaPrivada` ve que hay usuario y muestra la página.
6. `MisLibros` pide `GET /api/libros/mios`. El interceptor agrega el token, `verificarToken` lo valida y la API devuelve solo los libros de Beto.
