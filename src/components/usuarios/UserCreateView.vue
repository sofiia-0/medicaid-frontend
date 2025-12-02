<script setup lang="ts">
import type { CreatedUserData } from '@/services/usuarioService'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const usersStore = useUsuarioStore()
const router = useRouter()

const form = reactive<CreatedUserData>({
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

// Validación
const validateForm = (): boolean => {
  if (!form.nombre.trim()) {
    error.value = 'El nombre es requerido'
    return false
  }

  if (!form.apellido.trim()) {
    error.value = 'El apellido es requerido'
    return false
  }

  if (!form.email.trim()) {
    error.value = 'El email es requerido'
    return false
  }

  if (!form.password.trim()) {
    error.value = 'La contraseña es requerida'
    return false
  }

  if (!form.telefono.trim()) {
    error.value = 'El teléfono es requerido'
    return false
  }

  if (!form.fecha_nacimiento) {
    error.value = 'La fecha de nacimiento es requerida'
    return false
  }

  // Validación de email básica
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    error.value = 'El formato de email no es valido'
    return false
  }

  return true
}

const submit = async () => {
  // Limpiar mensajes
  error.value = ''
  successMsg.value = ''

  // Validar formulario
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const nuevoUsuario = await usersStore.createUser({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      password: form.password,
      telefono: form.telefono.trim(),
      fecha_nacimiento: form.fecha_nacimiento,
    })

    successMsg.value = `Usuario ${nuevoUsuario.nombre} ${nuevoUsuario.apellido} creado exitosamente`

    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      router.push('/usuarios')
    }, 1500)
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Error al crear el usuario'

    // Manejo de errores específicos
    if (e.response?.data?.errors) {
      const errors = e.response.data.errors
      if (errors.email) {
        error.value = `Email: ${errors.email[0]}`
      } else if (errors.password) {
        error.value = `Contraseña: ${errors.password[0]}`
      }
    }
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/usuarios')
}

const clearError = () => {
  error.value = ''
}

const clearSuccess = () => {
  successMsg.value = ''
}
</script>
<template>
  <div class="crear-usuario-container">

    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="titulo">Crear Usuario</h1>
        <p class="subtitulo">Agregar nuevo usuario al sistema</p>
      </div>
      <button @click="goBack" class="btn-volver">
        <span>←</span> Volver a Usuarios
      </button>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="successMsg" class="msg-exito">
      <div class="msg-texto">
        <span>✅</span>
        <span>{{ successMsg }}</span>
      </div>
      <button @click="clearSuccess" class="msg-close">×</button>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="msg-error">
      <div class="msg-texto">
        <span>⚠️</span>
        <span>{{ error }}</span>
      </div>
      <button @click="clearError" class="msg-close">×</button>
    </div>

    <!-- Formulario -->
    <div class="form-card">
      <form @submit.prevent="submit" class="form">

        <div class="form-grid">
          <!-- Nombre -->
          <div class="form-field">
            <label for="nombre">Nombre <span class="req">*</span></label>
            <input id="nombre" v-model="form.nombre" type="text" required placeholder="Ingresa el nombre" :disabled="loading" />
            <p class="field-hint">Ej: Juan</p>
          </div>

          <!-- Apellido -->
          <div class="form-field">
            <label for="apellido">Apellido <span class="req">*</span></label>
            <input id="apellido" v-model="form.apellido" type="text" required placeholder="Ingresa el apellido" :disabled="loading" />
            <p class="field-hint">Ej: Pérez</p>
          </div>
        </div>

        <!-- Email -->
        <div class="form-field">
          <label for="email">Email <span class="req">*</span></label>
          <input id="email" v-model="form.email" type="email" required placeholder="usuario@ejemplo.com" :disabled="loading" />
          <p class="field-hint">El email debe ser único en el sistema</p>
        </div>

        <!-- Contraseña -->
        <div class="form-field">
          <label for="password">Contraseña <span class="req">*</span></label>
          <input id="password" v-model="form.password" type="password" required placeholder="Mínimo 6 caracteres" minlength="6" :disabled="loading" />
          <p class="field-hint">La contraseña debe tener al menos 6 caracteres</p>
        </div>

        <!-- telefono -->
        <div class="form-field">
          <label for="telefono">Teléfono <span class="req">*</span></label>
          <input id="telefono" v-model="form.telefono" type="tel" required placeholder="Ingresa el teléfono" :disabled="loading" />
          <p class="field-hint">Ingresa un número de teléfono válido</p>
        </div>

        <!-- Fecha de Nacimiento -->
        <div class="form-field">
          <label for="fecha_nacimiento">Fecha de Nacimiento <span class="req">*</span></label>
          <input id="fecha_nacimiento" v-model="form.fecha_nacimiento" type="date" required :disabled="loading" />  
        </div>

        <!-- Información -->
        <div class="info-box">
          <h3>Información importante:</h3>
          <ul>
            <li>• Todos los campos marcados con <span class="req">*</span> son obligatorios</li>
            <li>• El email debe ser único y válido</li>
            <li>• La contraseña se almacenará de forma segura</li>
            <li>• El tipo de usuario determina los permisos en el sistema</li>
          </ul>
        </div>

        <!-- Acciones -->
        <div class="acciones">
          <button type="button" @click="goBack" class="btn-cancelar" :disabled="loading">
            Cancelar
          </button>

          <button type="submit" class="btn-crear" :disabled="loading">
            <span v-if="loading" class="loader"></span>
            <span>{{ loading ? 'Creando...' : 'Crear Usuario' }}</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
