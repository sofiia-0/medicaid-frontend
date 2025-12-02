import { medicamentoService, type CreatedMedicamentoData, type UpdateMedicamentoData } from "@/services/medicamentoService"
import type { Medicamento, PaginatedResponse, Usuario } from "@/types/auth"
import { defineStore } from "pinia" 

interface medicamentoState {
  medicamentos: Medicamento[]
  currentMedicamento: Medicamento | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    perPage: number
    total: number
    lastPage: number
    from: number
    to: number
  } | null
}

export const useMedicamentoStore = defineStore('medicamentos', {
  state: (): medicamentoState => ({
    medicamentos: [],
    currentMedicamento: null,
    loading: false,
    error: null,
    pagination: null
  }),

  getters: {
    getMedicamentoById: (state) => (id: number) => {
      return state.medicamentos.find(medicamento => medicamento.id === id)
    }
  },

  actions: {
    async fetchMedicamentos(page: number = 1, perPage: number = 10) {
      this.loading = true
      this.error = null
      try {
        const response: PaginatedResponse<Medicamento> = await medicamentoService.getMedicamentos(page, perPage)
        this.medicamentos = response.data
        this.pagination = {
          currentPage: response.current_page,
          perPage: response.per_page,
          total: response.total,
          lastPage: response.last_page,
          from: response.from,
          to: response.to
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Error al cargar los usuarios'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(id: number) {
  this.loading = true
  this.error = null
  try {
    const response = await medicamentoService.getMedicamentoById(id)
    // si axios devuelve { data: usuario }
    this.currentMedicamento = response.data || response
  } catch (error: any) {
    this.error = error.response?.data?.message || error.message || 'Error al cargar el medicamento'
    throw error
  } finally {
    this.loading = false
  }
},

    async createMedicamento(medicamentoData: CreatedMedicamentoData) {
      this.loading = true
      this.error = null
      try {
        const newMedicamento = await medicamentoService.createMedicamento(medicamentoData)
        this.medicamentos.push(newMedicamento)
        return newMedicamento
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Error al crear el medicamento'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateMedicamento(id: number, medicamentoData: UpdateMedicamentoData) {
      this.loading = true
      this.error = null
      try {
        const updatedMedicamento = await medicamentoService.updateMedicamento(id, medicamentoData)
        // Actualizar en la lista
        const index = this.medicamentos.findIndex(medicamento => medicamento.id === id)
        if (index !== -1) {
          this.medicamentos[index] = updatedMedicamento
        }

        // Actualizar currentMedicamento si es el mismo
        if (this.currentMedicamento && this.currentMedicamento.id === id) {
          this.currentMedicamento = updatedMedicamento
        }

        return updatedMedicamento
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Error al actualizar el medicamento'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteMedicamento(id: number) {
  this.loading = true
  this.error = null

  try {
    // petición DELETE al backend
    await medicamentoService.deleteMedicamento(id)

    // elimina el usuario del array local
    this.medicamentos = this.medicamentos.filter(medicamento => medicamento.id !== id)

    // actualiza la paginación si existe
    if (this.pagination) {
      this.pagination.total -= 1

      // si la página queda vacía, movernos hacia atrás
      if (this.medicamentos.length === 0 && this.pagination.currentPage > 1) {
        this.pagination.currentPage -= 1
      }
    }

  } catch (error: any) {
    this.error =
      error.response?.data?.message ||
      error.message ||
      "Error al eliminar el medicamento"
    throw error
  } finally {
    this.loading = false
  }
}
,

    clearCurrentMedicamento() {
      this.currentMedicamento = null
    },

    clearError() {
      this.error = null
    }
  }
})
