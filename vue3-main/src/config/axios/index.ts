import { service } from './service'

import { config } from './config'

const { default_headers } = config

const request = (option: any) => {
  const { url, method, params, data, headersType, responseType } = option
  let formatUrl = url
  if (method == 'delete') {
    formatUrl = formateURLWithId(url, data, headersType)
  } else if (method == 'put') {
    formatUrl = formateURLOnlyPut(url, data, headersType)
  } else {
  }
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
  if (headersType == 'multipart/form-data') {
    const id = data.get('id')
    url = url + '/' + id
  } else {
    if ('id' in data) {
      url = url + '/' + data['id']
    }
  }
  return url
}

function formateURLOnlyPut(link: string, data: any, headersType?: any) {
  let url = link
  if (headersType == 'multipart/form-data') {
    const putId = data.get('putId')
    if (putId) {
      url = url + '/' + putId
    }
  } else {
    if ('putId' in data) {
      url = url + '/' + data['putId']
    }
  }
  return url
}
