// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export const cloneObj = (obj: object) => {
  let ret: any
  if (Array.isArray(obj)) {
    ret = []
    for (let i = 0; i < obj.length; i++) {
      ret[i] = cloneObj(obj[i])
    }
    return ret
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    ret = {}
    for (const i in obj) {
      ret[i] = cloneObj(obj[i])
    }
    return ret
  } else {
    return obj
  }
}
