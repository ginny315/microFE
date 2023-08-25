import request from '@/config/axios'

const env = import.meta.env
let serverHost = env.VITE_APP_MULTI === 'true' ? window.g.apiUrl : env.VITE_APP_INTERFACE_URL
// console.log('serverHost=', serverHost)
serverHost = serverHost + '/ums'

// 用户列表
export const getUsers = (params: any) => request.get({ url: `${serverHost}/api/users`, params })
// 获取有效用户
export const getUsersActive = (params: any) =>
  request.get({ url: `${serverHost}/api/users/active`, params })
export const resetUserPwd = (data: any) =>
  request.post({ url: `${serverHost}/api/user/reset-pwd`, data })
export const updateUser = (data: any) => request.put({ url: `${serverHost}/api/user`, data })
export const addUser = (data: any) => request.post({ url: `${serverHost}/api/user`, data })
export const delUser = (data: any) => request.delete({ url: `${serverHost}/api/user`, data })

// 系统
export const getSys = (params: any) => request.get({ url: `${serverHost}/api/subsystem`, params })
export const updateSys = (data: any) => request.put({ url: `${serverHost}/api/subsystem`, data })
export const addSys = (data: any) => request.post({ url: `${serverHost}/api/subsystem`, data })
export const delSys = (data: any) => request.delete({ url: `${serverHost}/api/subsystem`, data })
// 获取用户可操作系统
export const getUserSubSys = (params: any) =>
  request.get({ url: `${serverHost}/api/user/subsystem`, params })

// 菜单
export const getMenu = (params: any) => request.get({ url: `${serverHost}/api/menu`, params })
export const updateMenu = (data: any) => request.put({ url: `${serverHost}/api/menu`, data })
export const addMenu = (data: any) => request.post({ url: `${serverHost}/api/menu`, data })
export const delMenu = (data: any) => request.delete({ url: `${serverHost}/api/menu`, data })
// 上移下移菜单
export const upMenu = (data: any) => request.put({ url: `${serverHost}/api/move_menu/up/`, data })
export const downMenu = (data: any) =>
  request.put({ url: `${serverHost}/api/move_menu/down/`, data })
// 获取子系统、功能模块和操作
export const getSubModule = (params: any) =>
  request.get({ url: `${serverHost}/api/system_module_function`, params })

// 后端系统API
export const getBDApi = (params: any) =>
  request.get({ url: `${serverHost}/api/system_function/`, params })
export const updateBDApi = (data: any) =>
  request.put({ url: `${serverHost}/api/system_function/`, data })
export const addBDApi = (data: any) =>
  request.post({ url: `${serverHost}/api/system_function/`, data })
export const delBDApi = (data: any) =>
  request.delete({ url: `${serverHost}/api/system_function/`, data })
// 获取子系统功能模块
export const getModuleBySys = (params: any) =>
  request.get({ url: `${serverHost}/api/system_module`, params })

// 角色
export const getRole = (params: any) => request.get({ url: `${serverHost}/api/role`, params })
export const getRoleDetail = (params: any) =>
  request.get({ url: `${serverHost}/api/role/`, params })
export const updateRole = (data: any) => request.put({ url: `${serverHost}/api/role`, data })
export const addRole = (data: any) => request.post({ url: `${serverHost}/api/role`, data })
export const delRole = (data: any) => request.delete({ url: `${serverHost}/api/role`, data })
// 配置菜单
export const setMenu = (data: any) => request.post({ url: `${serverHost}/api/role/setmenu`, data })
// 获取用户可管理系统-创建角色
export const getRoleManageSys = (params: any) =>
  request.get({ url: `${serverHost}/api/user/manage_subsystem`, params })
// 根据系统名称获取菜单
export const getMenuByName = (params: any) =>
  request.get({ url: `${serverHost}/subsystem/menu/`, params })
// 系统角色MAP LIST
export const getSysRoleList = (params: any) =>
  request.get({ url: `${serverHost}/api/system_role/list`, params })

// 获取用户可操作系统-首页+操作历史记录
export const getAccessSys = (params: any) =>
  request.get({ url: `${serverHost}/api/user/subsystem`, params })
// 各个子系统均可以获取用户信息
export const getUserInfoSys = (params: any) =>
  request.get({ url: `${serverHost}/api/users/info`, params })

// 获取日志
export const getOpLog = (params: any) => request.get({ url: `${serverHost}/api/logs`, params })
// 导出日志
export const exportLog = () => request.post({ url: `${serverHost}/api/logs`, responseType: 'blob' })
