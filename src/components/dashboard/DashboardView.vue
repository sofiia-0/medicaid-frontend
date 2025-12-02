<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStores'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.usuarioActual)

const navigateTo = (section: string) => {
  router.push(`/${section}`)
}

const appName = import.meta.env.VITE_APP_NAME
</script>

<template>
  <div class="dashboard-container">
    <!-- Banner de bienvenida -->
    <div v-if="user" class="welcome-box">
      <div class="welcome-text">
        <h1>¡Bienvenido, {{ user.nombre }}!</h1>
        <p>Has iniciado sesión correctamente en {{ appName }}</p>
      </div>
      <div class="welcome-icon">👋</div>
    </div>

    <!-- Acciones principales -->
    <div class="actions-box">
      <h2>Acciones Disponibles</h2>
      <div class="actions-grid">
        <!-- Usuarios -->
        <button @click="navigateTo('usuarios')" class="action-btn">
          <div class="action-icon">👥</div>
          <h3>Usuarios</h3>
          <p>Administrar usuarios del sistema</p>
        </button>

        <!-- Medicamentos -->
        <button @click="navigateTo('medicamentos')" class="action-btn">
          <div class="action-icon">💊</div>
          <h3>Medicamentos</h3>
          <p>Gestionar medicamentos disponibles</p>
        </button>

        <!-- Tratamientos -->
        <button @click="navigateTo('tratamientos')" class="action-btn">
          <div class="action-icon">📝</div>
          <h3>Tratamientos</h3>
          <p>Administrar tratamientos de pacientes</p>
        </button>
      </div>
    </div>
  </div>
</template>
