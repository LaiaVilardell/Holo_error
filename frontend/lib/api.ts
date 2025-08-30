// en frontend/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite se encargará de redirigir esto a http://localhost:8000/api
});

// Esta es la parte mágica:
// "Interceptamos" cada petición para añadir el token de autenticación si existe.
api.interceptors.request.use(
(config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
(error) => {
    return Promise.reject(error);
}
);

export default api;