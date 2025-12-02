<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStores'

import type { Usuario } from '@/types/auth'

interface Props {
  user?: Usuario
}

const props = withDefaults(defineProps<Props>(), {
  user: () => ({
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: new Date()
  })
})

const emit = defineEmits<{
  logout: []
}>()

const authStore = useAuthStore()
const isMenuOpen = ref(false)

const userInitials = computed(() => {
  return `${props.user?.nombre.charAt(0)}${props.user?.apellido.charAt(0)}`.toUpperCase()
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  emit('logout')
  authStore.logout()
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu-container')) {
    isMenuOpen.value = false
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>