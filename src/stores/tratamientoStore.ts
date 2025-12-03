import { defineStore } from "pinia"
import { ref } from "vue"
import type { Tratamiento, PaginatedResponse } from "@/types/auth"
import { tratamientoService } from "@/services/tratamientoService"

export const useTratamientoStore = defineStore("tratamientos", () => {
  const tratamientos = ref<Tratamiento[]>([])
  const current = ref<Tratamiento | null>(null)
  const pagination = ref({ totalPages: 1 })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTratamientos = async (page = 1, perPage = 10) => {
    loading.value = true
    try {
      const res: PaginatedResponse<Tratamiento> = await tratamientoService.getAll(page, perPage)
      tratamientos.value = res.data
      pagination.value.totalPages = res.totalPages
      error.value = null
    } catch (err: any) {
      error.value = err?.response?.data?.message || "Error al cargar tratamientos"
    } finally {
      loading.value = false
    }
  }

  const getTratamiento = async (id: number) => {
    loading.value = true
    try {
      const res = await tratamientoService.getById(id)
      current.value = res
      return res
    } catch (err: any) {
      error.value = err?.response?.data?.message || "No se pudo cargar el tratamiento"
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTratamiento = async (payload: any) => {
    loading.value = true
    try {
      const res = await tratamientoService.create(payload)
      error.value = null
      return res
    } catch (err: any) {
      error.value = err?.response?.data?.message || "Error al crear tratamiento"
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTratamiento = async (id: number, payload: any) => {
    loading.value = true
    try {
      const res = await tratamientoService.update(id, payload)
      error.value = null
      return res
    } catch (err: any) {
      error.value = err?.response?.data?.message || "Error al actualizar tratamiento"
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTratamiento = async (id: number) => {
    loading.value = true
    try {
      await tratamientoService.delete(id)
      error.value = null
    } catch (err: any) {
      error.value = err?.response?.data?.message || "Error al eliminar tratamiento"
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => (error.value = null)

  return {
    tratamientos,
    current,
    pagination,
    loading,
    error,
    fetchTratamientos,
    getTratamiento,
    createTratamiento,
    updateTratamiento,
    deleteTratamiento,
    clearError
  }
})
