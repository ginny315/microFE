import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/views/layout/basic.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/404',
    component: defineAsyncComponent(() => import('@/views/error/404.vue')),
    meta: { hidden: true }
  },
  {
    path: '/',
    name: 'user',
    component: BasicLayout,
    meta: {
      title: '用户管理',
      icon: 'userm',
      hidden: false,
      level: 1
    },
    children: [
      {
        path: '/',
        component: defineAsyncComponent(() => import('@/views/user-manage/index.vue'))
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
