<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuarioStore'
import { useAuthStore } from '@/stores/authStores'

// Stores
const usersStore = useUsuarioStore()
const authStore = useAuthStore()
const router = useRouter()

// Usuario actual y nombre de la app
const user = computed(() => authStore.usuarioActual)
const appName = import.meta.env.VITE_APP_NAME

// Paginación
const currentPage = ref(1)
const perPage = 10
const users = computed(() => usersStore.users)
const pagination = computed(() => usersStore.pagination)
const loading = computed(() => usersStore.loading)
const error = computed(() => usersStore.error)

// Cargar usuarios al montar
onMounted(() => {
  loadUsers()
})

const loadUsers = () => {
  usersStore.fetchUsers(currentPage.value, perPage)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  usersStore.fetchUsers(page, perPage)
}

// Navegación
const goToCreateUser = () => {
  router.push('/usuarios/crear')
}

const goToEditUser = (id: number) => {
  router.push(`/usuarios/editar/${id}`)
}

// Eliminar usuario
const deleteUser = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    try {
      await usersStore.deleteUser(id)
      if (users.value.length === 1 && currentPage.value > 1) {
        currentPage.value -= 1
      }
      loadUsers()
    } catch (err) {
      // Error manejado en el store
    }
  }
}

const clearError = () => {
  usersStore.clearError()
}
</script>

<template>
    <!-- Error -->
    <div v-if="error" class="error-box">
      <p>{{ error }}</p>
      <button @click="clearError">Cerrar</button>
    </div>

    <!-- Cargando -->
    <div v-if="loading">Cargando usuarios...</div>

    <!-- Tabla de usuarios -->
    <div v-if="!loading && users.length">
      <button @click="goToCreateUser" class="btn-primary">Crear Usuario</button>

      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Fecha Nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.nombre }} {{ u.apellido }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.telefono }}</td>
            <td>{{ u.fecha_nacimiento }}</td>
            <td>
              <button @click="goToEditUser(u.id)" class="btn-edit">Editar</button>
              <button @click="deleteUser(u.id)" class="btn-delete">Eliminar</button>
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

    <div v-else-if="!loading">No hay usuarios disponibles.</div>
</template>

