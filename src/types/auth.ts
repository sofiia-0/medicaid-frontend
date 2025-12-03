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

export interface TratamientoMedicamento {
  medicamento_id: number
  dosis: string
  frecuencia_horas: number
}

export interface Tratamiento {
  id: number
  usuario_id: number
  frecuencia_horas: number
  fecha_inicio: string
  fecha_fin: string | null
  hora_inicio: string
  notas: string | null
  medicamentos: TratamientoMedicamento[]
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
