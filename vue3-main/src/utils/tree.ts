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

const item2lv = (item: any, type?: any) => {
  const arr = item
  if (Object.prototype.toString.call(item) === '[object Object]') {
    if (item.children) {
      item.children.forEach((i) => {
        item2lv(i)
      })
    }
    item['label'] = item.name || ''
    item['value'] = type == 1 ? item : item.id
  } else if (Array.isArray(item)) {
    item.forEach((item) => {
      if (item.children) {
        item.children.forEach((i) => {
          item2lv(i)
        })
      }
      item['label'] = item.name || ''
      item['value'] = type == 1 ? item : item.id
    })
  }
  return arr
}
// 处理后端给的树状数据，{ id: '', label: '', children:[] }
export const treeFormat = (data: Array, type?: any) => {
  console.log('data=', data)
  let tree = []
  if (!Array.isArray(data)) {
    return tree
  }
  tree = item2lv(data, type)
  // data.forEach((item) => {
  //   if (item.children) {
  //     item.children.forEach((i) => {
  //       item2lv(i)
  //     })
  //   }
  //   item2lv(item)
  //   tree.push(item)
  // })
  console.log('tree=', tree)
  return tree
}

const item2lvFilter = (item: any) => {
  const arr = item
  if (Object.prototype.toString.call(item) === '[object Object]') {
    if (item.level == 2) {
      delete item.children
    } else if (item.level == 1 && item.children) {
      item.children = item.children.filter((child) => child.level != 3)
      item.children.forEach((i) => {
        item2lvFilter(i)
      })
    }
    item['label'] = item.name || ''
    item['value'] = item.id
  } else if (Array.isArray(item)) {
    item.forEach((item) => {
      if (item.children) {
        item.children.forEach((i) => {
          item2lvFilter(i)
        })
      }
      item['label'] = item.name || ''
      item['value'] = item.id
    })
  }
  return arr
}
export const treeFilter = (data: Array) => {
  console.log('data=', data)
  let tree = []
  if (!Array.isArray(data)) {
    return tree
  }
  tree = item2lvFilter(data)
  console.log('treeFilter=', tree)
  return tree
}

// 【暂不用】遍历所有节点
const travelNodes = (tmpRoot) => {
  tmpRoot.checked = true
  if (tmpRoot.childNodes.length === 0) {
    // 叶子节点
    return
  } else {
    // 不是叶子节点,递归遍历
    const tmpChildNoes = tmpRoot.childNodes
    for (let i = 0; i < tmpChildNoes.length; i++) {
      travelNodes(tmpChildNoes[i])
    }
  }
}
