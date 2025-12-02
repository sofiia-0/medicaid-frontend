import { usuarioService, type CreatedUserData, type UpdateUserData } from "@/services/usuarioService"
import type { PaginatedResponse, Usuario } from "@/types/auth"
import { defineStore } from "pinia"

interface usuarioState {
  users: Usuario[]
  currentUser: Usuario | null
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

export const useUsuarioStore = defineStore('usuarios', {
  state: (): usuarioState => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    pagination: null
  }),

  getters: {
    getUserById: (state) => (id: number) => {
      return state.users.find(user => user.id === id)
    }
  },

  actions: {
    async fetchUsers(page: number = 1, perPage: number = 10) {
      this.loading = true
      this.error = null
      try {
        const response: PaginatedResponse<Usuario> = await usuarioService.getUsers(page, perPage)
        this.users = response.data
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
    const response = await usuarioService.getUserById(id)
    // si axios devuelve { data: usuario }
    this.currentUser = response.data || response
  } catch (error: any) {
    this.error = error.response?.data?.message || error.message || 'Error al cargar el usuario'
    throw error
  } finally {
    this.loading = false
  }
},

    async createUser(userData: CreatedUserData) {
      this.loading = true
      this.error = null
      try {
        const newUser = await usuarioService.createUser(userData)
        this.users.push(newUser)
        return newUser
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Error al crear el usuario'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id: number, userData: UpdateUserData) {
      this.loading = true
      this.error = null
      try {
        const updatedUser = await usuarioService.updateUser(id, userData)

        // Actualizar en la lista
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users[index] = updatedUser
        }

        // Actualizar currentUser si es el mismo
        if (this.currentUser && this.currentUser.id === id) {
          this.currentUser = updatedUser
        }

        return updatedUser
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Error al actualizar el usuario'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number) {
  this.loading = true
  this.error = null

  try {
    // petición DELETE al backend
    await usuarioService.deleteUser(id)

    // elimina el usuario del array local
    this.users = this.users.filter(user => user.id !== id)

    // actualiza la paginación si existe
    if (this.pagination) {
      this.pagination.total -= 1

      // si la página queda vacía, movernos hacia atrás
      if (this.users.length === 0 && this.pagination.currentPage > 1) {
        this.pagination.currentPage -= 1
      }
    }

  } catch (error: any) {
    this.error =
      error.response?.data?.message ||
      error.message ||
      "Error al eliminar el usuario"
    throw error
  } finally {
    this.loading = false
  }
}
,

    clearCurrentUser() {
      this.currentUser = null
    },

    clearError() {
      this.error = null
    }
  }
})
