import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'Inicio',
        meta: {
          requiresAuth: true,
          showInDrawer: true,
          icon: 'home'
        }
      }
    ],
  },
  {
    path: '/accounts',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/AccountsPage.vue'),
        name: 'Contas',
        meta: {
          requiresAuth: true,
          showInDrawer: true,
          icon: 'account_balance'
        }
      }
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/CleanLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue'),
        name: 'Login'
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
