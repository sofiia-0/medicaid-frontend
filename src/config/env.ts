export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:9000/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MEDICAID',
  MODE: import.meta.env.MODE || 'development',
} as const

// Validar variables de desarrollo
if (import.meta.env.MODE === 'development') {
  console.info('Configuración cargada: ', env)
  if (!import.meta.env.VITE_API_URL) {
    console.warn('No se ha encontrado la variable de entorno VITE_API_URL')
  }
}
