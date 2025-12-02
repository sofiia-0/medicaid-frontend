<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStores'
import UserMenu from '@/components/auth/UserMenu.vue'

const appName = import.meta.env.VITE_APP_NAME

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const { estaAutenticado, usuarioActual, estadoAuth } = storeToRefs(authStore)

const usuarioListo = computed(() => usuarioActual.value && usuarioActual.value.usuario_id > 0)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(() => {
  authStore.inicializarAuth()
})
</script>

<template>
  <div style="min-height: 100vh; display: flex; flex-direction: column; background-color: var(--color-base-200)">
    
    <!-- Header visible siempre que esté autenticado -->
    <header v-if="estaAutenticado" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem;">
      <h1 style="font-weight: bold; font-size: 1.5rem;">{{ appName }}</h1>

      <nav style="display: flex; gap: 0.5rem;">
        <button class="btn" :class="{ 'btn-active': route.name === 'dashboard' }" @click="navigateTo('/')">Dashboard</button>
        <button class="btn" :class="{ 'btn-active': route.name === 'usuarios' }" @click="navigateTo('/usuarios')">Usuarios</button>
        <button class="btn" :class="{ 'btn-active': route.name === 'medicamentos' }" @click="navigateTo('/medicamentos')">Medicamentos</button>
        <button class="btn" :class="{ 'btn-active': route.name === 'tratamientos' }" @click="navigateTo('/tratamientos')">Tratamientos</button>
      </nav>

      <UserMenu :user="usuarioActual" @logout="handleLogout" />
    </header>

    <!-- Contenido principal -->
    <main style="flex: 1; width: 90%; max-width: 1200px; margin: 2rem auto;">
      <div v-if="estadoAuth === 'verificando'" style="text-align: center; padding: 2rem">
        Verificando sesión...
      </div>

      <!-- Aquí se renderizan las rutas hijas -->
      <router-view />
    </main>
  </div>
</template>