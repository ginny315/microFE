import fileDownload from 'js-file-download'

// 获取文件后缀
export const getFileType = (name) => {
  if (name) {
    if (name.lastIndexOf('.') > -1) {
      return name.slice(name.lastIndexOf('.') + 1)
    } else {
      return false
    }
  }
}

export const acceptList = ['.pdf', '.doc', '.docx', '.jpg', '.png', '.xlsx', '.xls']
export const suffixList = ['pdf', 'doc', 'docx', 'jpg', 'png', 'xlsx', 'xls']

export const createUrl = (blob: Blob) => {
  let fileURL = null
  if (typeof window.createObjectURL == 'function') {
    // basic
    fileURL = window.createObjectURL(blob)
  } else if (typeof window.webkitURL == 'function') {
    // webkit or chrome
    try {
      fileURL = window.webkitURL.createObjectURL(blob)
    } catch (error) {
      console.log(error)
    }
  } else if (typeof window.URL == 'function') {
    // mozilla(firefox)
    try {
      fileURL = window.URL.createObjectURL(blob)
    } catch (error) {
      console.log(error)
    }
  }
  return fileURL
}

// 下载文件
export const fileDownloadFun = (res: any, name?: string) => {
  if (name) {
    fileDownload(res.data, name)
  } else {
    let fileName = ''
    let contentDisposition = ''
    if (res.headers['content-disposition']) contentDisposition = res.headers['content-disposition']
    if (res.headers['Content-Disposition']) contentDisposition = res.headers['Content-Disposition']
    const result = contentDisposition.split("filename*=utf-8''")[1]
    console.log('result=', result)
    if (result == undefined) {
      // fileName = '导出文件.xlsx'
      ElMessage.error('下载文件失败')
    } else {
      fileName = decodeURIComponent(result)
      console.log('download=', res.data, 'file=', fileName)
      fileDownload(res.data, fileName)
    }
  }
}

// 【暂不用】下载文件
export const download = (res: any, name?: string) => {
  const data = res.data
  if (!res.data) {
    return
  }
  let fileName = ''
  if (name) {
    fileName = name
  } else {
    let contentDisposition = ''
    //浏览器问题可能会出现 content-disposition 匹配不到
    if (res.headers['content-disposition']) contentDisposition = res.headers['content-disposition']
    if (res.headers['Content-Disposition']) contentDisposition = res.headers['Content-Disposition']
    const result = contentDisposition.split("filename*=utf-8''")[1]
    console.log('result=', result)
    if (result == undefined) {
      fileName = '导出文件.xlsx'
    } else {
      fileName = decodeURIComponent(result)
    }
  }
  console.log('fileName=', fileName)
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
}

// 将base64图片转化成blob图片, base64Data base64图片地址
export const dataURItoBlob = (base64Data) => {
  let byteString = base64Data
  if (base64Data.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(base64Data.split(',')[1]) // base64 解码
  } else {
    byteString = unescape(base64Data.split(',')[1])
  }
  // 获取文件类型
  const mimeString = base64Data.split(',')[0].match(/:(.*?);/)[1] // mime类型

  const uintArr = new Uint8Array(byteString.length) // 创建视图

  for (let i = 0; i < byteString.length; i++) {
    uintArr[i] = byteString.charCodeAt(i)
  }
  // 生成blob图片
  const blob = new Blob([uintArr], {
    type: mimeString
  })
  console.log(uintArr, blob)
  return URL.createObjectURL(blob)
}

export const getBase64Img = (url) => {
  const reader = new FileReader()
  reader.readAsDataURL(url)
  reader.onload = function (e) {
    const base64Data = e.target.result
    console.log(dataURItoBlob(base64Data)) // 调用dataURItoBlob转换方法
  }
}

// formdata形式的数据转换，文件files，其他参数params
export const fdWithFiles = (fileList: Array<any>, params: Object, fileName?: string) => {
  const fd = new FormData()
  if (fileList.length > 0) {
    fileList.forEach((item) => {
      console.log('item.raw=', item.raw)
      const name = fileName ? fileName : 'files'
      fd.append(name, item.raw)
    })
  }
  for (const key in params) {
    // fd.append(key, params[key])
    // 参数为数组，数组为空不传
    if (Array.isArray(params[key])) {
      if (params[key].length > 0) fd.append(key, params[key])
    } else {
      // 参数为对象，对象为空不传
      if (params[key]) fd.append(key, params[key])
    }
  }
  return fd
}

// 多组文件+参数 params=[{fileList:[], fileName:''}]
export const fdWithMultiFiles = (filesAll: Array<any>, params: Object) => {
  const fd = new FormData()
  filesAll.forEach((i) => {
    if (i.fileList.length > 0) {
      i.fileList.forEach((item) => {
        const name = i.fileName ? i.fileName : 'files'
        fd.append(name, item.raw)
      })
    }
  })
  for (const key in params) {
    // fd.append(key, params[key])
    // 参数为数组
    if (Array.isArray(params[key])) {
      if (params[key].length > 0) fd.append(key, params[key])
      // params[key].forEach((item) => {
      //   fd.append(key, item)
      // })
    } else {
      if (params[key]) fd.append(key, params[key])
    }
  }
  return fd
}
