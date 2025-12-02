import type { PaginatedResponse, Medicamento } from "@/types/auth"
import apiClient from "./api"

export interface CreatedMedicamentoData{
  nombre: string
  tipo: string
  dosis_default: string
}

export interface UpdateMedicamentoData {
  nombre?: string
  tipo?: string
  dosis_default?: string
}

class MedicamentoService{
  async getMedicamentos(page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Medicamento>> {
    const response = await apiClient.get(`/medicamentos?page=${page}&per_page=${perPage}`)
    return response.data
  }

  async getMedicamentoById(id: number): Promise<Medicamento> {
    const response = await apiClient.get(`/medicamentos/${id}`)
    return response.data
  }

  async createMedicamento(medicamentoData: CreatedMedicamentoData): Promise<Medicamento> {
    const response = await apiClient.post('/medicamentos', medicamentoData)
    return response.data
  }

  async updateMedicamento(id: number, medicamentoData: UpdateMedicamentoData): Promise<Medicamento> {
    const response = await apiClient.put(`/medicamentos/${id}`, medicamentoData)
    return response.data
  }

  async deleteMedicamento(id: number): Promise<void> {
    await apiClient.delete(`/medicamentos/${id}`)
  }
}

export const medicamentoService = new MedicamentoService()