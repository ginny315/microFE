import request from '@/config/axios'

const serverHost = import.meta.env.VITE_APP_INTERFACE_URL
console.log('serverHost=', serverHost)

export const login = (data: any) => request.post({ url: `${serverHost}/api/login/`, data })
export const getUserInfo = (data: any) =>
  request.post({ url: `${serverHost}/api/getcurrentuser/`, data })
export const updateUserPwd = (data: any) => request.put({ url: `${serverHost}/api/user/`, data })
export const updateUserPhone = (data: any) => request.put({ url: `${serverHost}/api/user/`, data })
//用户列表
export const getUsers = (params: any) => request.get({ url: `${serverHost}/api/user/`, params })
export const resetUserPwd = (data: any) => request.put({ url: `${serverHost}/api/user/`, data })
export const updateUser = (data: any) => request.put({ url: `${serverHost}/api/user/`, data })
export const addUser = (data: any) => request.post({ url: `${serverHost}/api/user/`, data })
export const delUser = (data: any) => request.delete({ url: `${serverHost}/api/user/`, data })
//下载文件
export const downloadFile = (data: any) =>
  request.post({ url: `${serverHost}/api/attachment/`, data, responseType: 'blob' })
export const downloadDynamicFile = () =>
  request.post({ url: `${serverHost}/api/export/dynamic_data/`, responseType: 'blob' })
//查看文件
export const lookFile = (params: any) =>
  request.get({ url: `${serverHost}/api/attachment/`, params, responseType: 'blob' })
