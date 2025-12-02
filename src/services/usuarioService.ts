import type { PaginatedResponse, Usuario } from "@/types/auth"
import apiClient from "./api"

export interface CreatedUserData{
  nombre: string
  apellido: string
  email: string
  password: string
  telefono: string
  fecha_nacimiento: Date
}

export interface UpdateUserData {
  nombre?: string
  apellido?: string
  email?: string
  password?: string
  telefono?: string
  fecha_nacimiento?: Date
}

class UsuarioService{
  async getUsers(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Usuario>> {
    const response = await apiClient.get(`/usuarios?page=${page}&per_page=${perPage}`)
    return response.data
  }

  async getUserById(id: number): Promise<Usuario> {
    const response = await apiClient.get(`/usuarios/${id}`)
    return response.data
  }

  async createUser(userData: CreatedUserData): Promise<Usuario> {
    const response = await apiClient.post('/usuarios', userData)
    return response.data
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<Usuario> {
    const response = await apiClient.put(`/usuarios/${id}`, userData)
    return response.data
  }

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/usuarios/${id}`)
  }
}

export const usuarioService = new UsuarioService()