export const preText = (pretext: string) => {
  return pretext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>')
}

export const afterText = (pretext: string) => {
  return pretext.replace(/<br\/>/g, '\n')
}

export const isValidUsername = (str: string) => ['admin', 'editor'].indexOf(str.trim()) >= 0

// 判断是外链，直接跳转。否则使用router-link进行路由跳转
export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

export const matchRedirect = (path: string) => {
  const n = path.search('redirect')
  return path.slice(n + 9, path.length)
}

export const isEmail = (s: string) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

//判断是否是JSON格式
export const isJSON = (str) => {
  if (typeof str == 'string') {
    try {
      const obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}

//判断是移动端还是 pc 端 ，true 表示是移动端，false 表示是 pc 端
export function isMobileOrPc() {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}

export const isDev = () => {
  return import.meta.env.VUE_APP_MOCK
}

export const validateNumber = (rule: any, value: number, callback: Function) => {
  if (!isValidNumber(value)) {
    callback(new Error('请输入整数'))
  } else {
    callback()
  }
}
//
export const validateText50 = (rule: any, value: string, callback: Function) => {
  if (!isValidName50(value)) {
    callback(new Error('请输入0-50位中文、字母或数字，支持部分特殊符号'))
  } else {
    callback()
  }
}

export const validateTestname = (rule: any, value: string, callback: Function) => {
  if (!isValidTestname(value)) {
    callback(new Error('请输入1-50中英文、数字，支持-_字符'))
  } else {
    callback()
  }
}

export const validateText50Required = (rule: any, value: string, callback: Function) => {
  if (!isValidName50Required(value)) {
    callback(new Error('请输入1-50位中文、字母或数字，支持部分特殊符号'))
  } else {
    callback()
  }
}

export const validateText100 = (rule: any, value: string, callback: Function) => {
  if (!isValidName100(value)) {
    callback(new Error('请输入0-100位中文、字母或数字，支持部分特殊符号'))
  } else {
    callback()
  }
}

export const validateText200 = (rule: any, value: string, callback: Function) => {
  if (!isValidName200(value)) {
    callback(new Error('请输入0-200位中文、字母或数字，支持部分特殊符号'))
  } else {
    callback()
  }
}

export const validateText20 = (rule: any, value: string, callback: Function) => {
  if (!isValidName20(value)) {
    callback(new Error('请输入1-20位中文、字母或数字，支持部分特殊符号'))
  } else {
    callback()
  }
}

export const validatePhone = (rule: any, value: string, callback: Function) => {
  if (!isValidPhone(value)) {
    callback(new Error('请输入正确的手机号，15位以内数字，支持+ -等特殊符号'))
  } else {
    callback()
  }
}

export const validateLandlinePhone = (rule: any, value: string, callback: Function) => {
  if (!isValidLandlinePhone(value)) {
    callback(new Error('请输入正确的座机号，15位以内数字，支持+ -等特殊符号'))
  } else {
    callback()
  }
}

export const validateEmail = (rule: any, value: string, callback: Function) => {
  if (!isValidEmail(value)) {
    callback(new Error('请输入正确的邮箱格式，如a@b.com'))
  } else {
    callback()
  }
}

const isValidNumber = (n: number) => {
  if (n) {
    const reg1 = /^\d+$/
    const v1 = reg1.test(n)
    return v1
  } else {
    return true
  }
}

const isValidName20 = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）]{1,20}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 21
  // console.log('str=',str,'v1=',v1, v2)
  return v1 && v2
}

const isValidName100 = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）\s]{0,100}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 101
  // console.log('str=',str,'v1=',v1, v2)
  return v1 && v2
}

const isValidName200 = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”'\-()\\[\]!！\s@#$%^&*{}<>《》。.,，；：:"（）;]{0,200}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 201
  return v1 && v2
}

export const isValidName50 = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）]{0,50}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 51
  // console.log('str=',str,'v1=',v1, v2)
  return v1 && v2
}

const isValidName50Required = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）]{1,50}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 51
  // console.log('str=',str,'v1=',v1, v2)
  return v1 && v2
}

const isValidTestname = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 = /^[0-9\u4e00-\u9fa5a-zA-Z0-9\-_]{1,50}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 51
  // console.log('str=',str,'v1=',v1, v2)
  return v1 && v2
}

const isValidPhone = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 = /^[0-9\-+]{0,15}$/g
  const v1 = reg1.test(str)
  return v1
}

const isValidLandlinePhone = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 = /^[0-9\-+]{0,15}$/
  const v1 = reg1.test(str)
  return v1
}

const isValidEmail = (str: string) => {
  if (!str) return true // 空字符串直接返回 true
  const reg1 = /^[a-zA-Z0-9_-]{1,64}@([a-zA-Z0-9]+\.[a-zA-Z0-9]+){1,255}$/g
  return reg1.test(str)
}
