// src/router/index.js
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { supabase } from '../supabase';
import LandingPage from '../views/LandingPage.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/TasksPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/new',
    name: 'NewTask',
    component: () => import('../views/NewTaskPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: () => import('../views/TaskDetailPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsPage.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes
});

// Navigation guard to check auth status
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (requiresAuth && !user) {
    next('/login');
  } else if (!requiresAuth && user && (to.path === '/login' || to.path === '/register' || to.path === '/')) {
    next('/tasks');
  } else {
    next();
  }
});

export default router;