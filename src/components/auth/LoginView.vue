<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStores'

const appName = import.meta.env.VITE_APP_NAME
const router = useRouter()

const authStore = useAuthStore()
const { estaAutenticado, estaCargando, error } = storeToRefs(authStore)

const form = reactive({
  email: '',
  password: '',
})

const errorLocal = ref<string>('')

const handleSubmit = async () => {
  errorLocal.value = ''

  const exito = await authStore.login({
    email: form.email,
    password: form.password,
  })

  if (!exito) {
    errorLocal.value = error.value || 'Error al iniciar sesión'
  }
}
</script>

<template>
  <div class="fullscreen-center">
    <div class="login-box">
      <h2>Iniciar Sesión</h2>
      <p>Accede a {{ appName }}</p>

      <form @submit.prevent="handleSubmit">
        <input class="input" type="email" v-model="form.email" placeholder="Correo electrónico" />
        <input class="input" type="password" v-model="form.password" placeholder="Contraseña" />

        <div v-if="errorLocal" class="error">{{ errorLocal }}</div>

        <button type="submit" class="btn">
          {{ estaCargando ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>
  </div>
</template>


