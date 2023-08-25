import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { store } from '@/store/index'
import { getToken, setToken, removeToken, getUserInfo } from '@/utils/cookies'
import { login } from '@/api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()

export interface IUserInfo {
  username: string
  alias_name: string
  pinyin_name: string
  id: number
  dept: object[]
  is_superuser: boolean
  is_staff: boolean
  email: string
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
      username: '',
      alias_name: '',
      is_superuser: false,
      is_staff: false
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
    async login(userInfo: { username: string; password: string }) {
      const { username, password } = userInfo
      // username = username.trim()
      // password = password.trim()
      const data = await login({ username, password })
      console.log('login data=', data)
      if (data && data.status == 200) {
        const user = data.data
        console.log('login success!  ', user)
        const {
          token,
          user_id,
          username,
          alias_name,
          pinyin_name,
          dept,
          is_superuser,
          is_staff,
          email
        } = user
        const newUser = {
          username: username,
          id: user_id,
          alias_name: alias_name,
          pinyin_name: pinyin_name,
          dept: dept,
          is_superuser: is_superuser,
          is_staff: is_staff,
          email: email
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
    async updateUserInfo(token: string, userInfo: IUserInfo) {
      removeToken()
      this.token = token
      this.userInfo = userInfo
      setToken(token, userInfo)
    },
    async logOut() {
      this.resetToken()
    },
    async autoOut() {
      // 自动注销
      this.resetToken()
    },
    resetToken() {
      // 重置token（清空操作），需重新登录
      removeToken()
      this.token = ''
      // window.location.href = window.location.origin
      window.location.href = '/'
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
