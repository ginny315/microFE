import { defineStore } from 'pinia'
import { store } from '@/store/index'
import { BasicLayout, SimpleLayout } from '@/views/layout/index'
import router from '../../router'
import { getUserRoutes } from '@/api/user'

export type MenuType = {
  path: string
  title: string
  fold?: string
  meta?: any
  component: string
  redirect?: string
  children?: Array<MenuType>
}

type RouterType = RouteRecordRaw & {
  hidden?: boolean
  alwaysShow?: boolean
}

interface IPermissionState {
  routes: any[]
  dynamicRoutes: any[]
  menus: any[]
}

const hasPermission = (roles: string[], route: any) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}

const modules = import.meta.glob('../../views/**/*.vue')
const _import = (path: string, fold: string) => () => import(`../../views/${fold}/${path}.vue`)

const assembleRouter = (routers: any) => {
  const addRouter = routers.filter((router: any) => {
    // router.title &&
    //   router.icon &&
    //   (router.meta = {
    //     title: router.title,
    //     icon: router.icon
    //     // alwaysShow: router.alwaysShow || false,
    //     // affix: router.affix || false,
    //   })
    if (router.level === 3) {
      return false
    }
    if (router.name) {
      delete router.name
    }
    if (router.component === 'BasicLayout') {
      router.component = shallowRef(BasicLayout)
    } else if (router.component === 'SimpleLayout') {
      router.component = shallowRef(SimpleLayout)
    } else {
      // console.log('load component')
      if (import.meta.env.MODE === 'dev') {
        router.component = _import(router.component, router.fold)
      } else {
        router.component = modules[`../../views/${router.fold}/${router.component}.vue`]
      }
    }
    if (router.children && router.children.length) {
      router.children = assembleRouter(router.children)
    }
    return true
  })
  return addRouter
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
    dynamicRoutes: [],
    menus: []
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
    },
    async getMenus() {
      try {
        const { data } = await getUserRoutes({})
        // const list: MenuType[] = data
        this.dynamicRoutes = data
        this.menu = JSON.parse(JSON.stringify(data))
        console.log('data=', data, this.menu)
        // 组件路由
        const addRouter = assembleRouter(this.dynamicRoutes)
        console.log(router.getRoutes(), '查看现有路由11')
        // 动态添加菜单
        addRouter.forEach((ts: any) => {
          router.addRoute(ts)
        })
        console.log(addRouter, router.getRoutes(), '查看现有路由22')
      } catch (err) {
        return Promise.reject(err)
      }
    },
    clearMenus() {
      this.dynamicRoutes.length = 0
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
