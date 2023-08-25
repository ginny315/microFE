import request from '@/config/axios'

const env = import.meta.env
let serverHost = env.VITE_APP_MULTI === 'true' ? window.g.apiUrl : env.VITE_APP_INTERFACE_URL
// console.log('serverHost=', serverHost)
serverHost = serverHost + '/ums'

export const login = (data: any) => request.post({ url: `${serverHost}/api/login/`, data })

export const updateUserPwd = (data: any) =>
  request.post({ url: `${serverHost}/api/user/update-pwd`, data })
export const updateUserInfo = (data: any) =>
  request.put({ url: `${serverHost}/api/userinfo`, data })

export const getUserInfo = (params: any) =>
  request.get({ url: `${serverHost}/api/userinfo`, params })
export const getAccount = (params: any) =>
  request.get({ url: `${serverHost}/api/get-account`, params })
export const logOut = (params: any) => request.post({ url: `${serverHost}/api/signout`, params })
export const getApps = (params: any) =>
  request.get({ url: `${serverHost}/api/get-applications`, params })
export const getUserRoutes = (params: any) =>
  request.get({ url: `${serverHost}/subsystem/menu/UMS`, params })

// 获取验证码
export const sendCode = (data: any) =>
  request.post({ url: `${serverHost}/send_verification_code`, data })
// 验证邮箱和验证码
export const verifyCode = (data: any) => request.post({ url: `${serverHost}/check_email`, data })
// 重置密码
export const setPwd = (data: any) => request.post({ url: `${serverHost}/set_pwd`, data })
