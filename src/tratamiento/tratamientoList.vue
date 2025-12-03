<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useTratamientoStore } from "@/stores/tratamientoStore"

const store = useTratamientoStore()
const router = useRouter()

const currentPage = ref(1)
const perPage = 10

onMounted(() => {
  store.fetchTratamientos(currentPage.value, perPage)
})

const goToCreate = () => router.push("/tratamientos/crear")
const goToEdit = (id: number) => router.push(`/tratamientos/editar/${id}`)

const changePage = (p: number) => {
  currentPage.value = p
  store.fetchTratamientos(p, perPage)
}

const deleteTratamiento = async (id: number) => {
  if (!confirm("¿Eliminar este tratamiento?")) return

  await store.deleteTratamiento(id)

  if (store.tratamientos.length === 1 && currentPage.value > 1) {
    currentPage.value--
  }

  store.fetchTratamientos(currentPage.value, perPage)
}
</script>

<template>
  <div>
    <button @click="goToCreate" class="btn-primary">Crear Tratamiento</button>

    <div v-if="store.loading">Cargando tratamientos...</div>

    <table
      v-if="!store.loading && store.tratamientos.length"
      class="users-table"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Inicio</th>
          <th>Medicamentos</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="t in store.tratamientos" :key="t.id">
          <td>{{ t.id }}</td>

          <td>{{ t.usuario?.nombre ?? ('ID ' + t.usuario_id) }}</td>

          <!-- Mostrar fecha + solo hora (HH:MM) -->
          <td>
            {{ t.fecha_inicio }}
            {{ t.hora_inicio ? t.hora_inicio.slice(11, 16) : '' }}
          </td>

          <td>
            <ul>
              <li
                v-for="m in t.medicamentos"
                :key="m.id"
              >
                <!-- Mostrar nombre + dosis + frecuencia -->
                {{ m.nombre }}
                <span v-if="m.dosis"> - {{ m.dosis }}</span>
                ({{ m.frecuencia_horas }}h)
              </li>
            </ul>
          </td>

          <td>
            <button class="btn-edit" @click="goToEdit(t.id)">Editar</button>
            <button class="btn-delete" @click="deleteTratamiento(t.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mensaje cuando NO hay tratamientos -->
    <div v-if="!store.loading && !store.tratamientos.length">
      No hay tratamientos.
    </div>

    <!-- Paginación -->
    <div v-if="store.pagination.totalPages > 1" class="pagination">
      <button
        v-for="page in store.pagination.totalPages"
        :key="page"
        @click="changePage(page)"
        :disabled="currentPage === page"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>
