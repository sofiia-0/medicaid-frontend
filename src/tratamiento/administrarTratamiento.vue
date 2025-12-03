<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useTratamientoStore } from "@/stores/tratamientoStore"
import { useUsuarioStore } from "@/stores/usuarioStore"
import { useMedicamentoStore } from "@/stores/medicamentoStore"

// Stores
const tratamientoStore = useTratamientoStore()
const usuarioStore = useUsuarioStore()
const medicamentoStore = useMedicamentoStore()

// Router
const route = useRoute()
const router = useRouter()
const id = Number(route.params.id || 0)

// Formulario
const form = ref({
  usuario_id: null as number | null,
  frecuencia_horas: 6,
  fecha_inicio: "",
  fecha_fin: "",
  hora_inicio: "",
  notas: "",
  medicamentos: [] as {
    medicamento_id: number | null
    dosis: string
    frecuencia_horas: number
  }[]
})

// Cargar datos al montar
onMounted(async () => {
  await usuarioStore.fetchUsers(1, 1000)
  usuarioStore.users.sort((a, b) => a.nombre.localeCompare(b.nombre))

  await medicamentoStore.fetchMedicamentos(1, 1000)

  if (id) {
    const data = await tratamientoStore.getTratamiento(id)
    form.value = {
      usuario_id: data.usuario_id,
      frecuencia_horas: data.frecuencia_horas,
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin ?? "",
      hora_inicio: data.hora_inicio,
      notas: data.notas ?? "",
      medicamentos: data.medicamentos
      .map((m) => ({
        medicamento_id: m.id ?? null,
        dosis: m.dosis ?? "",
        frecuencia_horas: m.frecuencia_horas ?? data.frecuencia_horas
      }))
      .filter(m => m.medicamento_id !== null)
    }
  }
})

// Agregar / eliminar medicamentos
const addMedicamento = () => {
  if (medicamentoStore.medicamentos.length === 0) return
  form.value.medicamentos.push({
    medicamento_id: medicamentoStore.medicamentos[0].id,
    dosis: "",
    frecuencia_horas: form.value.frecuencia_horas
  })
}

const removeMedicamento = (index: number) => {
  form.value.medicamentos.splice(index, 1)
}

// Construir payload seguro
const buildPayload = () => {
  const medicamentosValidos = form.value.medicamentos
    .filter(m => m.medicamento_id !== null)
    .map(m => ({
      medicamento_id: m.medicamento_id!,
      dosis: m.dosis || "",
      frecuencia_horas: Number(m.frecuencia_horas) || form.value.frecuencia_horas
    }))

  return {
    usuario_id: form.value.usuario_id!,
    frecuencia_horas: Number(form.value.frecuencia_horas),
    fecha_inicio: form.value.fecha_inicio,
    fecha_fin: form.value.fecha_fin || null,
    hora_inicio: form.value.hora_inicio,
    notas: form.value.notas || "",
    medicamentos: medicamentosValidos
  }
}


// Guardar tratamiento
const save = async () => {
  if (!form.value.usuario_id) return alert("Debe seleccionar un usuario")
  if (!form.value.fecha_inicio) return alert("Debe seleccionar fecha de inicio")
  if (!form.value.medicamentos.length) return alert("Debe agregar al menos un medicamento")

  const payload = buildPayload()
  console.log("Payload a enviar:", payload)

  try {
    if (id) {
      await tratamientoStore.updateTratamiento(id, payload)
    } else {
      await tratamientoStore.createTratamiento(payload)
    }
    router.push("/tratamientos")
  } catch (err) {
    console.error("Error al guardar tratamiento:", err)
    alert("Error al guardar el tratamiento. Revisa la consola.")
  }
}

// Eliminar tratamiento
const deleteTratamiento = async () => {
  if (!id) return
  if (!confirm("¿Eliminar tratamiento?")) return
  await tratamientoStore.deleteTratamiento(id)
  router.push("/tratamientos")
}
</script>

<template>
  <div class="container">
    <h1>Administrar Tratamiento</h1>

    <!-- Datos generales -->
    <section>
      <h2>Información del Tratamiento</h2>

      <label>Usuario:</label>
      <select v-model="form.usuario_id">
        <option disabled value="">Seleccione usuario</option>
        <option v-for="u in usuarioStore.users" :key="u.id" :value="u.id">
          {{ u.nombre }} {{ u.apellido }} ({{ u.rol ?? "Usuario" }})
        </option>
      </select>

      <label>Frecuencia (horas):</label>
      <input type="number" v-model="form.frecuencia_horas" min="1" />

      <label>Fecha Inicio:</label>
      <input type="date" v-model="form.fecha_inicio" />

      <label>Fecha Fin:</label>
      <input type="date" v-model="form.fecha_fin" />

      <label>Hora Inicio:</label>
      <input type="time" v-model="form.hora_inicio" />

      <label>Notas:</label>
      <textarea v-model="form.notas" placeholder="Opcional"></textarea>
    </section>

    <!-- Medicamentos -->
    <section>
      <h2>Medicamentos</h2>

      <div v-for="(m, i) in form.medicamentos" :key="i" class="med-block">
        <select v-model="m.medicamento_id">
          <option disabled value="">Seleccione medicamento</option>
          <option v-for="med in medicamentoStore.medicamentos" :key="med.id" :value="med.id">
            {{ med.nombre }}
          </option>
        </select>

        <input v-model="m.dosis" placeholder="Dosis" />
        <input type="number" v-model="m.frecuencia_horas" min="1" placeholder="Horas" />

        <button @click="removeMedicamento(i)" class="btn-delete">Eliminar</button>
      </div>

      <button class="btn-primary" @click="addMedicamento">
        + Agregar Medicamento
      </button>
    </section>

    <!-- Acciones -->
    <section class="actions">
      <button class="btn-primary" @click="save">Guardar</button>
      <button class="btn-secondary" @click="router.back()">Cancelar</button>

      <button v-if="id" class="btn-delete" @click="deleteTratamiento">Eliminar</button>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 28px;
}

h2 {
  margin-bottom: 15px;
  color: #34495e;
}

section {
  margin-bottom: 30px;
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="number"],
input[type="date"],
input[type="time"],
textarea,
select {
  width: 100%;
  padding: 8px 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

textarea {
  min-height: 60px;
  resize: vertical;
}

button {
  cursor: pointer;
  font-size: 14px;
  padding: 8px 14px;
  margin-top: 10px;
  border: none;
  border-radius: 6px;
  transition: 0.2s;
}

.btn-primary {
  background-color: #1abc9c;
  color: white;
}

.btn-primary:hover {
  background-color: #16a085;
}

.btn-secondary {
  background-color: #ecf0f1;
  color: #333;
  margin-left: 10px;
}

.btn-secondary:hover {
  background-color: #bdc3c7;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  margin-left: 10px;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.med-block {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.med-block input,
.med-block select {
  flex: 1;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>
