import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import SimpleLayout from '@/views/layout/simple.vue'
import EmyptLayout from '@/views/layout/emypt.vue'
import NotFound from '@/views/error/404.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    // component: () => import('@/views/login/index.vue'),
    component: defineAsyncComponent(() => import('@/views/login/auth.vue')),
    meta: { hidden: true }
  },
  {
    path: '/forget1',
    component: defineAsyncComponent(() => import('@/views/login/forget.vue')),
    meta: { hidden: true }
  },
  {
    path: '/forget',
    component: EmyptLayout,
    meta: { hidden: true },
    children: [
      {
        path: '/forget',
        component: defineAsyncComponent(() => import('@/views/login/forget.vue'))
      }
    ]
  },
  {
    path: '/404',
    component: defineAsyncComponent(() => import('@/views/error/404.vue')),
    meta: { hidden: true }
  },
  {
    path: '/cb',
    component: defineAsyncComponent(() => import('@/views/home/callback.vue')),
    meta: { hidden: true }
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  {
    path: '/',
    component: SimpleLayout,
    meta: { hidden: true },
    children: [
      {
        path: '/',
        component: defineAsyncComponent(() => import('@/views/home/index.vue'))
      },
      {
        path: '/myinfo',
        component: defineAsyncComponent(() => import('@/views/home/myinfo.vue'))
      },
      {
        path: '/help',
        component: defineAsyncComponent(() => import('@/views/home/help.vue'))
      },
      {
        path: '/opLog',
        component: () => import('@/views/manage/opLog.vue')
      },
      {
        path: '/mypage',
        component: () => import('@/views/home/mypage.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: SimpleLayout,
    children: [
      {
        path: '/user',
        component: defineAsyncComponent(() => import('@/views/manage/user.vue'))
      }
    ]
  }
]

export const asyncRoutes: Array<RouteRecordRaw> = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 手动启用历史记录模式
  routes: constantRoutes
})

export default router
