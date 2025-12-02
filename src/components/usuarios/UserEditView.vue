<script setup lang="ts">
import type { UpdateUserData } from '@/services/usuarioService'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const usersStore = useUsuarioStore()
const router = useRouter()
const route = useRoute()

const userId = Number(route.params.id)

// Formulario
const form = reactive<UpdateUserData>({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  telefono: '',
  fecha_nacimiento: new Date(),
})

const loading = ref(false)
const error = ref('')
const successMsg = ref('')

// Cargar datos del usuario
const loadUser = async () => {
  loading.value = true
  try {
    await usersStore.fetchUserById(userId)
    if (usersStore.currentUser) {
      form.nombre = usersStore.currentUser.nombre
      form.apellido = usersStore.currentUser.apellido
      form.email = usersStore.currentUser.email
      form.telefono = usersStore.currentUser.telefono || ''
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Error al cargar el usuario'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadUser())

// Validación
const validateForm = (): boolean => {
  if (!form.nombre.trim()) { error.value = 'El nombre es requerido'; return false }
  if (!form.apellido.trim()) { error.value = 'El apellido es requerido'; return false }
  if (!form.email.trim()) { error.value = 'El email es requerido'; return false }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) { error.value = 'El email no es válido'; return false }

  // Validar teléfono solo números si no está vacío
  if (form.telefono && !/^\d+$/.test(form.telefono)) {
    error.value = 'El teléfono solo puede contener números'
    return false
  }

  return true
}

// Guardar cambios
const submit = async () => {
  error.value = ''
  successMsg.value = ''

  if (!validateForm()) return

  loading.value = true
  try {
    // Crear payload sin password si está vacío
    const payload = { ...form }
    if (!payload.password) delete payload.password

    await usersStore.updateUser(userId, payload)
    successMsg.value = `Usuario ${form.nombre} actualizado exitosamente`
    setTimeout(() => router.push('/usuarios'), 1500)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Error al actualizar el usuario'
  } finally {
    loading.value = false
  }
}

const goBack = () => router.push('/usuarios')
const clearError = () => error.value = ''
const clearSuccess = () => successMsg.value = ''
</script>

<template>
  <div class="editar-usuario-container">

    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="titulo">Editar Usuario</h1>
        <p class="subtitulo">Modificar los datos del usuario</p>
      </div>
      <button @click="goBack" class="btn-volver">
        ← Volver a Usuarios
      </button>
    </div>

    <!-- Mensaje éxito -->
    <div v-if="successMsg" class="msg-exito">
      <div class="msg-texto">
        <span>✅</span>{{ successMsg }}
      </div>
      <button @click="clearSuccess" class="msg-close">×</button>
    </div>

    <!-- Mensaje error -->
    <div v-if="error" class="msg-error">
      <div class="msg-texto">
        <span>⚠️</span>{{ error }}
      </div>
      <button @click="clearError" class="msg-close">×</button>
    </div>

    <!-- Formulario -->
    <div class="form-card">
      <form @submit.prevent="submit" class="form">

        <div class="form-grid">
          <div class="form-field">
            <label>Nombre <span class="req">*</span></label>
            <input v-model="form.nombre" type="text" class="input" placeholder="Ingresa el nombre" :disabled="loading" />
          </div>

          <div class="form-field">
            <label>Apellido <span class="req">*</span></label>
            <input v-model="form.apellido" type="text" class="input" placeholder="Ingresa el apellido" :disabled="loading" />
          </div>
        </div>

        <div class="form-field">
          <label>Email <span class="req">*</span></label>
          <input v-model="form.email" type="email" class="input" placeholder="usuario@ejemplo.com" :disabled="loading" />
        </div>

        <div class="form-field">
          <label>Contraseña (opcional)</label>
          <input v-model="form.password" type="password" class="input" placeholder="Nueva contraseña" :disabled="loading" />
        </div>

        <div class="form-field">
          <label>Teléfono</label>
          <input v-model="form.telefono" type="text" class="input" placeholder="Solo números" :disabled="loading" />
        </div>

        <div class="acciones">
          <button type="button" @click="goBack" class="btn-cancelar" :disabled="loading">Cancelar</button>
          <button type="submit" class="btn-guardar" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
