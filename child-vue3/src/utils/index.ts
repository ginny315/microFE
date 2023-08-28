import { isArray } from 'lodash-es'

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

export interface treeNode {
  label: string
  children: Array<treeNode>
}

export interface deptOne {
  id: number
  name: string
  pdept?: string
  pid?: number
  alias_name?: string
}

export const arrToTree = (data: Array<deptOne>) => {
  console.log('data=', data)
  const tree = []
  if (!Array.isArray(data)) {
    return tree
  }
  // 将数组转换成对象（键值对），将ID作为属性名，原来的数组里的对象作为属性值
  const map = {}
  data.forEach((item) => {
    map[item.id] = item
  })
  // 通过对象的属性名（ID）来找到父级节点，将存到map里的对象取出来放到父级节点的childere数组中
  data.forEach((item) => {
    const parent = map[item.pid] // 修改对象的属性

    delete item.pid
    if (item.alias_name) {
      item['label'] = item.name + '（' + item.alias_name + '）'
    } else {
      item['label'] = item.name
    }
    item['value'] = item.id
    delete item.name

    if (parent) {
      ;(parent.children || (parent.children = [])).push(item)
    } else {
      tree.push(item)
    }
  })
  return tree[0]
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

// 数据为null转为''
export const formatData = (detail: any, value: string = '') => {
  if (Object.prototype.toString.call(detail) === '[object Object]') {
    for (const key in detail) {
      if (detail[key] == null) {
        detail[key] = ''
      }
    }
  }
}

// 详情页展示，空值显示为--
export const formatDetailShow = (detail: any) => {
  if (Object.prototype.toString.call(detail) === '[object Object]') {
    for (const key in detail) {
      if (key.indexOf('attachment') == -1 && isArray(detail[key]) && detail[key].length > 0) {
        formatDetailShow(detail[key])
      } else if (!isArray(detail[key])) {
        if (detail[key] == null || detail[key] == 'null' || detail[key] == '') {
          detail[key] = key.indexOf('attachment') == -1 ? '--' : detail[key]
        }
      } else {
      }
    }
    return detail
  } else if (isArray(detail) && detail.length > 0) {
    detail.forEach((item) => {
      if (item instanceof Object) {
        item = formatDetailShow(item)
      }
    })
    return detail
  } else {
    return detail
  }
}
