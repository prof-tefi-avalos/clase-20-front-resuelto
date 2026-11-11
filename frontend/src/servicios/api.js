import axios from 'axios'

// Una instancia de axios con la dirección base de la API (/api, del archivo .env).
// Todas las páginas hacen sus pedidos con api, por ejemplo api.get('/libros').
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptor de request: esta función se ejecuta ANTES de cada pedido de api.
// Si hay un token guardado, lo agrega en el header Authorization con el formato
// Bearer <token>, que es el que lee verificarToken en la API.
// Se escribe una sola vez y vale para todos los pedidos.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  // Hay que devolver config; si no, el pedido no sale.
  return config
})
