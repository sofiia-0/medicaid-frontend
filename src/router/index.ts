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
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/components/dashboard/DashboardView.vue'),
      meta: {
        title: 'Dashboard',
        layout: 'default', // Asumiendo que tienes un layout por defecto
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login', // Todo lo demás redirige a login
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
