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
// 设置token
export const setToken = (token: string, userInfo: IUserInfo) => {
  console.log('token=', token)
  console.log('userInfo=', userInfo)
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 24 * 60 * 60 * 1000
  Cookies.set(tokenKey, token, { expires: expires })
  Cookies.set(userKey, JSON.stringify(userInfo), { expires: expires })
}
// 移除token
export const removeToken = () => {
  Cookies.remove(tokenKey) // 移除token
  // Cookies.remove(sessionKey) // 移除session
  Cookies.remove(userKey) // 移除用户信息
}
