<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMedicamentoStore } from '@/stores/medicamentoStore'
import { useAuthStore } from '@/stores/authStores'

// Stores
const medicamentosStore = useMedicamentoStore()
const authStore = useAuthStore()
const router = useRouter()

// Usuario actual y nombre de la app
const user = computed(() => authStore.usuarioActual)
const appName = import.meta.env.VITE_APP_NAME

// Paginación
const currentPage = ref(1)
const perPage = 10
const medicamentos = computed(() => medicamentosStore.medicamentos)
const pagination = computed(() => medicamentosStore.pagination)
const loading = computed(() => medicamentosStore.loading)
const error = computed(() => medicamentosStore.error)


// Cargar medicamentos al montar
onMounted(() => {
  loadMedicamentos()
})

const loadMedicamentos = () => {
  medicamentosStore.fetchMedicamentos(currentPage.value, perPage)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  medicamentosStore.fetchMedicamentos(page, perPage)
}
    
// Navegación
const goToCreateMedicamento = () => {
  router.push('/medicamentos/crear')
}

const goToEditMedicamento = (id: number) => {
  router.push(`/medicamentos/editar/${id}`)
}

// Eliminar medicamento
const deleteMedicamento = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este medicamento?')) {
    try {
      await medicamentosStore.deleteMedicamento(id)
      if (medicamentos.value.length === 1 && currentPage.value > 1) {
        currentPage.value -= 1
      }
      loadMedicamentos()
    } catch (err) {
      // Error manejado en el store
    }
  }
}

const clearError = () => {
  medicamentosStore.clearError()
}
</script>

<template>
  <!-- Error -->
  <div v-if="error" class="error-box">
    <p>{{ error }}</p>
    <button @click="clearError">Cerrar</button>
  </div>

  <!-- Cargando -->
  <div v-if="loading">Cargando medicamentos...</div>
  <button @click="goToCreateMedicamento" class="btn-primary">Crear Medicamento</button>
  <!-- Tabla de medicamentos -->
  <div v-if="!loading && medicamentos.length">

    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <TH>Tipo</TH>
          <TH>Concentración</TH>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in medicamentos" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.nombre }}</td>
          <td>{{ u.tipo }}</td>
          <td>{{ u.dosis_default }}</td>
          <td>
            <button @click="goToEditMedicamento(u.id)" class="btn-edit">Editar</button>
            <button @click="deleteMedicamento(u.id)" class="btn-delete">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div v-if="pagination.totalPages > 1" class="pagination">
      <button
        v-for="page in pagination.totalPages"
        :key="page"
        @click="handlePageChange(page)"
        :disabled="currentPage === page"
      >
        {{ page }}
      </button>
    </div>
  </div>

  <div v-else-if="!loading">No hay medicamentos!!.</div>
</template>
