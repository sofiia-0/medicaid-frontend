import AppLayout from '@/components/layout/AppLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Solo importamos el login
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/auth/LoginView.vue'),
      meta: {
        title: 'Iniciar Sesión',
        layout: 'empty', // Si quieres un layout vacío para login
      },
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
         {
          path: '',
          name: 'dashboard',
          component: () => import('@/components/dashboard/DashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'usuarios',
          name: 'usuarios',
          component: () => import('@/components/usuarios/UsuarioView.vue'),
          meta: { title: 'Usuarios' },
        },
        {
          path: '/usuarios/crear',
          name: 'crearUsuario',
          component: () => import('@/components/usuarios/UserCreateView.vue'),
          meta: { title: 'Crear Usuario' },
        },
        { path: '/usuarios/editar/:id', 
           name: 'UsuariosEditar',
           component: () => import('@/components/usuarios/UserEditView.vue')
          },
          // Medicamentos
          {
          path: 'medicamentos',
          name: 'medicamentos',
          component: () => import('@/components/medicamento/MedicamentoView.vue'),
          meta: { title: 'Medicamentos' },
        },
        {
          path: '/medicamentos/crear',
          name: 'crearMedicamento',
          component: () => import('@/components/medicamento/CreateMedicamentoView.vue'),
          meta: { title: 'Crear Medicamento' },
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/', // Todo lo demás redirige a login
    },
  ],
})

// Cambiar el título de la página
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Medic-aid`
  }
  next()
})

export default router
