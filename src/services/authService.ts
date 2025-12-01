import apiClient from './api'
import type { LoginCredentials, AuthResponse, Usuario } from '@/types/auth'
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/login', credentials)

    // Guardar token y datos del usuario
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user_data', JSON.stringify(response.data.usuario))
    }

    return response.data
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/logout')
    } catch (error) {
      console.warn('Error durante logout:', error)
    } finally {
      this.clearAuthData()
    }
  }

  async getCurrentUser(): Promise<Usuario> {
    const response = await apiClient.get<Usuario>('/me')
    // Actualizar datos en localStorage
    localStorage.setItem('user_data', JSON.stringify(response.data))
    return response.data
  }

  getStoredUser(): Usuario | null {
    try {
      const userData = localStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  clearAuthData(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user_data')
  }
}

export const authService = new AuthService()
