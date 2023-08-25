import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosError
} from 'axios'
import qs from 'qs'
import { config } from './config'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from '@/utils/cookies'

const { result_code, base_url } = config

export const PATH_URL = base_url[import.meta.env.VITE_BASE_PATH]

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: config.request_timeout, // 请求超时时间
  withCredentials: false // 禁用 Cookie 等信息
})

// request拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // post Content-Type设置
    if (
      config.method === 'post' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] ===
        'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }

    // token设置
    const token = getToken()
    // console.log('request token=', token)
    if (token) {
      config.headers['Authorization'] = 'JWT ' + token
    }
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          if (key == 'id') {
            // 获取详情
            url = url.substring(0, url.length - 1)
            url = url + config.params['id'] + '//'
          } else {
            // console.log('params[key]=', config.params[key])
            if (
              config.params[key] != null &&
              config.params[key] != 'null' &&
              config.params[key] != undefined &&
              config.params[key] != 'undefined' &&
              config.params[key] != ''
            ) {
              // url中为空内容去除，除去值=false的特殊情况
              url += `${key}=${encodeURIComponent(config.params[key])}&`
            }
          }
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    // delete参数编码
    // if (config.method === 'delete') {
    //   if (config.params) {
    //     // 根据id删除
    //     let url = config.url as string
    //     url += config.params.id + '/'
    //     config.params = {}
    //     config.url = url
    //     console.log('url=', url)
    //   } else if (config.data) {
    //     //批量删除
    //     config.data = qs.stringify(config.data)
    //   } else {
    //   }
    // }
    // put参数编码
    // if (config.method === 'put') {
    //   console.log(
    //     'config.url=',
    //     config.url,
    //     'config.params=',
    //     config.params,
    //     'config.data=',
    //     config.data
    //   )
    //   if (config.params && config.data) {
    //     //id在url上，参数在body
    //     let url = config.url as string
    //     url += config.params.id + '/'
    //     config.params = {}
    //     config.url = url
    //     console.log('111url=', url)
    // config.data = qs.stringify(config.data)
    // }
    // else if (config.params && config.data) {
    //   let url = config.url as string
    //   url += config.params.id + '/'
    //   config.params = {}
    //   config.url = url
    //   console.log('url=', url)
    // }
    // else if (config.data) {
    //   config.data = qs.stringify(config.data)
    // } else {
    // }
    // }
    return config
  },
  (error: AxiosError) => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // console.log('response=', response)
    const { config, status, data } = response
    if (config.responseType === 'blob') {
      // 如果是文件流，直接过
      console.log('this is blob')
      return response
    } else if (status === result_code) {
      return data
    } else {
      ElMessage.error(data.message)
    }
  },
  (error: AxiosError) => {
    console.log('error=', error)
    if (error && String(error).indexOf('401') > -1) {
      // Unauthorized
      removeToken()
      window.location.href = '/'
    } else if (error && String(error).indexOf('403') > -1) {
      ElMessage.error('当前没有操作权限，请联系管理员。')
    } else {
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  }
)

export { service }
