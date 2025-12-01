import axios, { type AxiosInstance } from 'axios'
import { env } from '@/config/env'

// Configuración base de la API
const API_BASE_URL = env.API_URL

console.info('Configurando API base URL: ' + API_BASE_URL)

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 segundos
})

apiClient.interceptors.request.use(
  (config) => {
    // Obtener token de localStorage
    const token = localStorage.getItem('token')

    // Si existe token, agregarlo al header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Logs en desarrollo
    if (env.MODE === 'development') {
      console.info(`${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        headers: config.headers?.Authorization ? 'Con Token' : 'Sin Token',
      })
    }

    return config
  },
  (error) => {
    console.error('Error en la solicitud', error)
    return Promise.reject(error)
  },
)

// Interceptor de respuesta
apiClient.interceptors.response.use(
  (response) => {
    if (env.MODE === 'development') {
      console.info(
        `${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      )
    }
    return response
  },
  (error) => {
    if (env.MODE === 'development') {
      console.error(`Error: ${error.response?.status}: `, {
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
      })
    }

    // Manejo de error 401
    if (error.response?.status === 401) {
      console.warn('Token expirado o inválido')
      // Limpiar datos de autenticación
      localStorage.removeItem('token')
      localStorage.removeItem('user_data')
      // Redirigir a la página de login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
