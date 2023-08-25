import { service } from './service'

import { config } from './config'

const { default_headers } = config

const request = (option: any) => {
  const { url, method, params, data, headersType, responseType } = option
  const formatUrl =
    method == 'put' || method == 'delete' ? formateURLWithId(url, data, headersType) : url
  return service({
    url: formatUrl,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers
    }
  })
}
export default {
  get: <T = any>(option: any) => {
    return request({ method: 'get', ...option }) as unknown as T
  },
  post: <T = any>(option: any) => {
    return request({ method: 'post', ...option }) as unknown as T
  },
  delete: <T = any>(option: any) => {
    return request({ method: 'delete', ...option }) as unknown as T
  },
  put: <T = any>(option: any) => {
    return request({ method: 'put', ...option }) as unknown as T
  }
}

export function formateURLWithId(link: string, data: any, headersType?: any) {
  let url = link
  console.log('format id=', data, headersType)
  if (headersType == 'multipart/form-data') {
    const id = data.get('id')
    url = url + id + '/'
  } else {
    if ('id' in data) {
      url = url + data['id'] + '/'
    }
  }
  return url
}
