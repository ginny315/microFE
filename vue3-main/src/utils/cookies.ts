import Cookies from 'js-cookie'
import { IUserInfo } from '@/store/modules/user'

// Token设置，目前为24小时过期
const tokenKey = 'user_access_token'
// const sessionKey = 'casdoor_session_id'
const userKey = 'user'
// 获取token
export const getToken = () => Cookies.get(tokenKey)
// 获取用户信息
export const getUserInfo = () => {
  const user = Cookies.get(userKey)
  if (user) return JSON.parse(user)
  return null
}
// const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 24 * 60 * 60 * 1000
// 设置token
export const setToken = (token: string) => {
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  Cookies.set(tokenKey, token, { expires: expires })
  console.log('token=', Cookies.get(tokenKey))
}

export const setUserInfo = (userInfo: IUserInfo) => {
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  Cookies.set(userKey, JSON.stringify(userInfo), { expires: expires })
  console.log('userInfo=', userInfo, Cookies.get(userKey))
}
// 移除token
export const removeToken = () => {
  Cookies.remove(tokenKey) // 移除token
  // Cookies.remove(sessionKey) // 移除session
  Cookies.remove(userKey) // 移除用户信息
  Cookies.remove('beegosessionID') // 移除后端框架信息
}
