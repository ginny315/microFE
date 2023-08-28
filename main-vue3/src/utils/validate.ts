export const preText = (pretext: string) => {
  if (pretext) {
    return pretext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>')
  } else {
    return pretext
  }
}

export const afterText = (aftertext: string) => {
  if (aftertext) {
    return aftertext.replace(/<br\/>/g, '\n')
  } else {
    return aftertext
  }
}

export const isValidUsername = (str: string) => ['admin', 'editor'].indexOf(str.trim()) >= 0

// 判断是外链，直接跳转。否则使用router-link进行路由跳转
export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

export const matchRedirect = (path: string) => {
  const n = path.search('redirect')
  return path.slice(n + 9, path.length)
}

export const isMobileStrict = (s: string) => {
  return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(s)
}

// 判断是否是JSON格式
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

// 判断是移动端还是 pc 端 ，true 表示是移动端，false 表示是 pc 端
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

// 判断是否是中文
export const isChinese = (value: string) => {
  return /[^\w\.\/]/i.test(value)
}

const isValidText20 = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）+=_…?？~\\、]{1,20}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 21
  // console.log('str=',str,'v1=',v1, v2)
  return v1 && v2
}

// 1-20位中文、字母或数字
const isValidName20Required = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 21
  return v1 && v2
}

const isValidText30 = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）+=_…?？~\\、]{1,20}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 21
  // console.log('str=',str,'v1=',v1, v2)
  return v1 && v2
}

// 1-50位中文、字母或数字
const isValidName50Required = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 21
  return v1 && v2
}

const isValidText50 = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）+=_…?？~\\、]{0,50}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 51
  console.log('str=', str, 'v1=', v1, v2)
  return v1 && v2
}

const isValidText50Required = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）+=_…?？~\\、]{1,50}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 51
  console.log('Required str=', str, 'v1=', v1, v2)
  return v1 && v2
}

const isValidText100 = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）+=_…?？~\\、]{0,100}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 101
  // console.log('str=',str,'v1=',v1, v2)
  return v1 && v2
}

const isValidText128 = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）+=_…?？~\\、]{0,128}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 129
  // console.log('str=',str,'v1=',v1, v2)
  return v1 && v2
}

const isValidText128Required = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 =
    /^[0-9\u4e00-\u9fa5a-zA-Z0-9“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）+=_…?？~\\、]{1,128}$/
  const v1 = reg1.test(str)
  const v2 = str.length < 129
  // console.log('str=',str,'v1=',v1, v2)
  return v1 && v2
}

// 用于备注限制200字符
const isValidName200 = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const v2 = str.length < 201
  return v2
}

const isValidPhone = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 = /^[0-9\-+]{0,15}$/g
  const v1 = reg1.test(str)
  return v1
}

export const isValidPhoneStrict = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const v1 = isMobileStrict(str)
  return v1
}

const isValidLandlinePhone = (checkStr: string) => {
  const str = checkStr ? checkStr : ''
  const reg1 = /^[0-9\-+]{0,15}$/
  const v1 = reg1.test(str)
  return v1
}

export const isValidEmailStrict = (str: string) => {
  if (!str) return true // 空字符串直接返回 true
  const reg1 = /^([a-zA-Z0-9_-]){1,64}@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/g
  return reg1.test(str)
}

export const isValidEmail = (str: string) => {
  if (!str) return true // 空字符串直接返回 true
  const reg1 = /^[a-zA-Z0-9_-]{1,64}@([a-zA-Z0-9]+\.[a-zA-Z0-9]+){1,255}$/g
  return reg1.test(str)
}

// UMS 用户管理使用中
export const isValidEmail2 = (str: string) => {
  if (!str) return true // 空字符串直接返回 true
  const reg1 = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]+)+$/g
  return reg1.test(str)
}

// /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）]).{8,20}$/g
//  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[“”"‘’/'\-()\[\]!！@#$￥%^&*{}<>《》·`。.,，；;：【】:（）+=_…?？~\\、]).{8,20}$/g
// 8~20位含有数字、字母、符号三项的组合
export const isValidPassword = (str: string) => {
  const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*["/'\-()\[\]!@#$%^&*{}<>·`.,;:+=_?~\\]).{8,20}$/g
  const v1 = reg.test(str)
  const reg2 = /^[^\u4e00-\u9fa5]{8,20}$/g
  const v2 = reg2.test(str)
  return v1 && v2
}

// /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/g
// ?@%!&=+~:#;,
export const isValidHttp = (str: string) => {
  if (!str) return true // 空字符串直接返回 true
  const reg = /^([\w-]+.)+[\w-]+([\w\u4e00-\u9fa5-./;?:@&=+$,"#%()<>\\|]*)?$/g
  const v1 = reg.test(str)
  const v2 = str.length < 122
  const reg3 = /http:\/\//g
  const v3 = !reg3.test(str)
  return v1 && v2 && v3
}

export const validateText20Required = (rule: any, value: string, callback: Function) => {
  if (!isValidText20(value)) {
    callback(new Error('请输入1-20个中英文字符，包含部分特殊符号'))
  } else {
    callback()
  }
}

export const validateName20Required = (rule: any, value: string, callback: Function) => {
  if (!isValidName20Required(value)) {
    callback(new Error('请输入1-20位中文、字母或数字'))
  } else {
    callback()
  }
}

export const validateText30Required = (rule: any, value: string, callback: Function) => {
  if (!isValidText30(value)) {
    callback(new Error('请输入1-30个中英文字符，包含部分特殊符号'))
  } else {
    callback()
  }
}

export const validateName50Required = (rule: any, value: string, callback: Function) => {
  if (!isValidName50Required(value)) {
    callback(new Error('请输入1-50位中文、字母或数字'))
  } else {
    callback()
  }
}

export const validateText50 = (rule: any, value: string, callback: Function) => {
  if (!isValidText50(value)) {
    callback(new Error('请输入0-50个中英文字符，包含部分特殊符号'))
  } else {
    callback()
  }
}

export const validateText50Required = (rule: any, value: string, callback: Function) => {
  if (!isValidText50Required(value)) {
    callback(new Error('请输入1-50个中英文字符，包含部分特殊符号'))
  } else {
    callback()
  }
}

export const validateText100 = (rule: any, value: string, callback: Function) => {
  if (!isValidText100(value)) {
    callback(new Error('请输入0-100个中英文字符，包含部分特殊符号'))
  } else {
    callback()
  }
}

export const validateText128 = (rule: any, value: string, callback: Function) => {
  if (!isValidText128(value)) {
    callback(new Error('请输入0-128个中英文字符，包含部分特殊符号'))
  } else {
    callback()
  }
}

export const validateText128Required = (rule: any, value: string, callback: Function) => {
  if (!isValidText128Required(value)) {
    callback(new Error('请输入1-128个中英文字符，包含部分特殊符号'))
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

export const validatePhone = (rule: any, value: string, callback: Function) => {
  if (!isValidPhone(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

export const validatePhoneStrict = (rule: any, value: string, callback: Function) => {
  if (!isValidPhoneStrict(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

export const validateLandlinePhone = (rule: any, value: string, callback: Function) => {
  if (!isValidLandlinePhone(value)) {
    callback(new Error('请输入正确的座机号'))
  } else {
    callback()
  }
}

export const validateEmail = (rule: any, value: string, callback: Function) => {
  if (!isValidEmail2(value)) {
    callback(new Error('请输入正确的邮箱格式'))
  } else if (/\s/.test(value)) {
    // 包含空格
    callback(new Error('请输入正确的邮箱格式'))
  } else if (value.length > 64) {
    callback(new Error('邮件地址过长，建议不超过 64 个字符'))
  } else {
    callback()
  }
}

export const validHttp = (rule: any, value: string, callback: Function) => {
  if (!isValidHttp(value)) {
    callback(new Error('请输入正确的Link'))
  } else {
    callback()
  }
}
