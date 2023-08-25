import { defineStore } from 'pinia'
import { store } from '@/store/index'

export enum DeviceType { // 定义设备枚举类型
  Mobile,
  Desktop
}

export interface IAppState {
  // 定义app接口类型
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
}

export interface ISidebar {
  // 定义sidebar接口类型
  opened: boolean
  withoutAnimation: boolean
}

export const useAppStore = defineStore('app', {
  state: (): IAppState => ({
    device: DeviceType.Desktop,
    sidebar: {
      opened: true,
      withoutAnimation: false
    }
  }),
  getters: {
    getDevice(): DeviceType {
      return this.device
    },
    getSidebar(): ISidebar {
      return this.sidebar
    }
  },
  actions: {
    toggleDevice(device: DeviceType) {
      this.device = device
    },
    toggleSideBar(opened: boolean) {
      this.sidebar.opened = opened
    }
  }
})

export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
