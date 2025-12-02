<script setup lang="ts">
import type { CreatedMedicamentoData } from '@/services/medicamentoService'
import { useMedicamentoStore } from '@/stores/medicamentoStore'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const medicamentosStore = useMedicamentoStore()
const router = useRouter()

const form = reactive<CreatedMedicamentoData>({
  nombre: '',
    tipo: '',
    dosis_default: '',
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

  if (!form.tipo.trim()) {
    error.value = 'El tipo es requerido'
    return false
  }

  if (!form.dosis_default.trim()) {
    error.value = 'La dosis por defecto es requerida'
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
    const nuevoMedicamento = await medicamentosStore.createMedicamento({
      nombre: form.nombre.trim(),
        tipo: form.tipo.trim(),
        dosis_default: form.dosis_default.trim(),
    })

    successMsg.value = `Medicamento ${nuevoMedicamento.nombre} creado exitosamente`

    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      router.push('/medicamentos')
    }, 1500)
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Error al crear el medicamento'

  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/medicamentos')
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
        <h1 class="titulo">Crear Medicamento</h1>
        <p class="subtitulo">Agregar nuevo medicamento al sistema</p>
      </div>
      <button @click="goBack" class="btn-volver">
        <span>←</span> Volver a Medicamentos
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
            <p class="field-hint">Ej: Paracetamol</p>
          </div>

            <!-- Tipo -->  
            <div class="form-field">
            <label for="tipo">Tipo <span class="req">*</span></label>
            <input id="tipo" v-model="form.tipo" type="text" required placeholder="Ingresa el tipo" :disabled="loading" />
            <p class="field-hint">Ej: Antibiótico</p>
          </div>

            <!-- Dosis por defecto -->  
            <div class="form-field">
            <label for="dosis_default">Dosis por defecto <span class="req">*</span></label>
            <input id="dosis_default" v-model="form.dosis_default" type="text" required placeholder="Ingresa la dosis por defecto" :disabled="loading" />
            <p class="field-hint">Ej: 500mg</p>
          </div>
        </div>

        <!-- Información -->
        <div class="info-box">
          <h3>Información importante:</h3>
          <ul>
            <li>• Todos los campos marcados con <span class="req">*</span> son obligatorios</li>
          </ul>
        </div>

        <!-- Acciones -->
        <div class="acciones">
          <button type="button" @click="goBack" class="btn-cancelar" :disabled="loading">
            Cancelar
          </button>

          <button type="submit" class="btn-crear" :disabled="loading">
            <span v-if="loading" class="loader"></span>
            <span>{{ loading ? 'Creando...' : 'Crear Medicamento' }}</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
