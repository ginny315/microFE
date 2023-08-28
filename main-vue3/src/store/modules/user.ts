import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { store } from '@/store/index'
import { getToken, setToken, setUserInfo, removeToken, getUserInfo } from '@/utils/cookies'
import { login, logOut } from '@/api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()

export interface IUserInfo {
  name: string
  displayName: string
  pinyin_name: string
  id: number
  dept: object[]
  isAdmin: boolean
  isStaff: boolean
  email: string
  phone: string
}
export interface IUserState {
  token: string
  userInfo: IUserInfo
  avatar: string //未启用
  roles: string[] //未启用
}

export const useUserStore = defineStore('user', {
  state: (): IUserState => ({
    token: getToken() || '',
    userInfo: getUserInfo() || {
      id: null,
      name: '',
      displayName: '',
      isAdmin: false,
      isStaff: false
    },
    avatar: '',
    roles: []
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getUserInfo(): IUserInfo {
      return this.userInfo
    },
    getAvatar(): string {
      return this.avatar
    },
    getRoles(): string[] {
      return this.roles
    }
  },
  actions: {
    async login(userInfo: { name: string; password: string }) {
      const { name, password } = userInfo
      // name = name.trim()
      // password = password.trim()
      const data = await login({ name, password })
      console.log('login data=', data)
      if (data && data.status == 200) {
        const user = data.data
        console.log('login success!  ', user)
        const {
          token,
          user_id,
          name,
          displayName,
          pinyin_name,
          dept,
          isAdmin,
          isStaff,
          email,
          phone
        } = user
        const newUser = {
          name: name,
          id: user_id,
          displayName: displayName,
          pinyin_name: pinyin_name,
          dept: dept,
          isAdmin: isAdmin,
          isStaff: isStaff,
          email: email,
          phone: phone
        }
        console.log('222', newUser)
        this.token = token
        this.userInfo = newUser
        setToken(token, newUser)
        window.location.reload()
      } else {
        console.log('login error...')
        const errMsg = (data && data.msg) || '服务器升级中...'
        ElMessage.error(errMsg)
      }
    },
    async updateUserInfo(userInfo: IUserInfo) {
      // removeToken()
      this.userInfo = userInfo
      const info = (({ name, displayName, isAdmin, isStaff }) => ({
        name,
        displayName,
        isAdmin,
        isStaff
      }))(userInfo)
      setUserInfo(info)
    },
    async logOut() {
      this.resetToken()
    },
    async casdoorLogin(token) {
      this.token = token
      setToken(token)
    },
    async userLogOut() {
      // 自动注销
      this.resetToken()
    },
    async autoOut() {
      // 自动注销
      // this.resetToken()
      removeToken()
      this.token = ''
    },
    async resetToken() {
      // 重置token（清空操作），需重新登录
      removeToken()
      this.token = ''
      // window.location.href = window.location.origin
      // window.location.href = '/'
      // const { status } = await logOut({})
      // if (status == 'ok') {
      //   console.log('logout success')
      window.location.reload()
      // } else {
      //   console.log('logout fail')
      // }
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
