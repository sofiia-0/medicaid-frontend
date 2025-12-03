import apiClient from "./api"
import type { PaginatedResponse, Tratamiento } from "@/types/auth"

export const tratamientoService = {
  async getAll(page: number = 1, perPage: number = 10) {
    const response = await apiClient.get<PaginatedResponse<Tratamiento>>("/tratamientos", {
      params: { page, perPage }
    })
    return response.data
  },

  async getById(id: number) {
    const response = await apiClient.get<Tratamiento>(`/tratamientos/${id}`)
    return response.data
  },

  async create(payload: Partial<Tratamiento>) {
    const response = await apiClient.post("/tratamientos", payload)
    return response.data
  },

  async update(id: number, payload: Partial<Tratamiento>) {
    const response = await apiClient.put(`/tratamientos/${id}`, payload)
    return response.data
  },

  async delete(id: number) {
    const response = await apiClient.delete(`/tratamientos/${id}`)
    return response.data
  }
}
