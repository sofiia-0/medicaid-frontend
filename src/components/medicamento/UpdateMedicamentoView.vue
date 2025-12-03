<script setup lang="ts">
import type { UpdateMedicamentoData } from '@/services/medicamentoService'
import { useMedicamentoStore } from '@/stores/medicamentoStore'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const medicamentosStore = useMedicamentoStore()
const router = useRouter()
const route = useRoute()

const medicamentoId = Number(route.params.id)

// Formulario
const form = reactive<UpdateMedicamentoData>({
  nombre: '',
  tipo: '',
  dosis_default: '',
})

const loading = ref(false)
const error = ref('')
const successMsg = ref('')

// Cargar datos del medicamento
const loadMedicamento = async () => {
  loading.value = true
  try {
    await medicamentosStore.fetchUserById(medicamentoId)

    if (medicamentosStore.currentMedicamento) {
      form.nombre = medicamentosStore.currentMedicamento.nombre
      form.tipo = medicamentosStore.currentMedicamento.tipo
      form.dosis_default = medicamentosStore.currentMedicamento.dosis_default || ''
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Error al cargar el medicamento'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadMedicamento())

// Validación
const validateForm = (): boolean => {
  if (!form.nombre.trim()) { error.value = 'El nombre es requerido'; return false }
  if (!form.tipo.trim()) { error.value = 'El tipo es requerido'; return false }
  if (!form.dosis_default.trim()) { error.value = 'La dosis por defecto es requerida'; return false }
  return true
}

// Guardar cambios
const submit = async () => {
  error.value = ''
  successMsg.value = ''

  if (!validateForm()) return

  loading.value = true
  try {
    await medicamentosStore.updateMedicamento(medicamentoId, { ...form })

    successMsg.value = `Medicamento ${form.nombre} actualizado exitosamente`

    setTimeout(() => router.push('/medicamentos'), 1500)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Error al actualizar el medicamento'
  } finally {
    loading.value = false
  }
}

const goBack = () => router.push('/medicamentos')
const clearError = () => error.value = ''
const clearSuccess = () => successMsg.value = ''
</script>

<template>
  <div class="crear-usuario-container">

    <!-- Header -->
    <div class="header">
      <div>
        <h1 class="titulo">Actualizar Medicamento</h1>
        <p class="subtitulo">Modificar los datos del medicamento</p>
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
