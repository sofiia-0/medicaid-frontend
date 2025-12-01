import { authService } from "@/services/authService";
import type { LoginCredentials, Usuario } from "@/types/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        usuarioActual: null as Usuario | null,
        estadoAuth: 'inactivo' as 'inactivo' | 'verificando' | 'autenticado' | 'no autenticado',
        error: null as string | null,
        rutaRedireccion: '/dashboard' as string
    }),
    getters: {
        estaAutenticado: (state) => state.estadoAuth === 'autenticado',
        estaCargando: (state) => state.estadoAuth === 'verificando'
    },
    actions: {
        async inicializarAuth() {
            this.estadoAuth = 'verificando'
            this.error = null

            try{
                const token = authService.getToken()
                const usuarioAlmacenado = authService.getStoredUser()

                if(token && usuarioAlmacenado){
                    const usuario = await authService.getCurrentUser()
                    this.usuarioActual = usuario
                    this.estadoAuth = 'autenticado'
                    console.info('Sesión validada: ', usuario.email)
                }else{
                    this.estadoAuth = 'no autenticado'
                    console.info('No hay sesión activa')
                }

            }catch(error: any){
                console.error('Error validando sesión: ', error.message)
                authService.clearAuthData()
                this.usuarioActual = null
                this.estadoAuth = 'no autenticado',
                this.error = error.message
            }
        },

        async login(credenciales: LoginCredentials){
            this.estadoAuth = 'verificando',
            this.error = null

            try{
                const respuestaAuth = await authService.login(credenciales)
                this.usuarioActual = respuestaAuth.usuario
                this.estadoAuth = 'autenticado'
                console.info('Login exitoso: ', respuestaAuth.usuario.email)

                await this.procesarRedireccionPostLogin()

                return true
            }catch(error: any){
                console.error('Error en login: ', error.message)
                this.error = error.message
                this.estadoAuth = 'no autenticado'
                return false
            }
        },

        async logout(){
            console.log('AuthStore: Iniciando logout...')
            try {
                await authService.logout()
                console.info('AuthStore: Logout exitoso')
            } catch (error: any) {
                console.warn('AuthStore: Error durante logout: ', error.message)
            }finally{
                this.usuarioActual = null
                this.estadoAuth = 'no autenticado'
                console.log('AuthStore: Estado actualizado')
            }
        },

        async procesarRedireccionPostLogin(){
          await new Promise(resolve => setTimeout(resolve, 50))

          const router = (await import('@/router')).default
          const rutaDestino = this.rutaRedireccion || '/dashboard'

          router.push(rutaDestino)

          this.rutaRedireccion = '/dashboard'
        },

        establecerRutaRedireccion(ruta: string){
            this.rutaRedireccion = ruta
        }
    }
})
