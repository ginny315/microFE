import { defineStore } from 'pinia'
import { store } from '@/store/index'

interface IPermissionState {
  routes: any[]
  dynamicRoutes: any[]
}

const hasPermission = (roles: string[], route: any) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

const filterAsyncRoutes = (routes: any[], roles: any[]) => {
  const res: any[] = []
  routes.forEach((route) => {
    const target = { ...route }
    if (hasPermission(roles, target)) {
      if (target.children) {
        target.children = filterAsyncRoutes(target.children, roles)
      }
      res.push(target)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', {
  state: (): IPermissionState => ({
    routes: [],
    dynamicRoutes: []
  }),
  getters: {
    getRoutes(): any[] {
      return this.routes
    },
    getDynamicRoutes(): any[] {
      return this.dynamicRoutes
    }
  },
  actions: {
    generateRoutes(asyncRoutes: any[], roles: any[]) {
      return new Promise((resolve) => {
        const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        this.SET_ROUTES(accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
