export interface LoginCredentials {
  email: string
  password: string
}

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  fecha_nacimiento: Date
}

export interface Medicamento {
  id: number
  nombre: string
  tipo: string
  dosis_default: string
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}

export interface ApiError {
  errors?: Record<string, string[]>
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}
