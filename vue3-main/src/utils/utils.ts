//获取QueryString的数组
export function getQueryString() {
  const result = window.location.search.match(new RegExp('[?&][^?&]+=[^?&]+', 'g'))
  if (result == null) {
    return ''
  }
  for (let i = 0; i < result.length; i++) {
    result[i] = result[i].substring(1)
  }
  return result
}
//根据 QueryString 参数名称获取值
export function getQueryStringByName(name: string) {
  const result = window.location.search.match(new RegExp('[?&]' + name + '=([^&]+)', 'i'))
  if (result == null || result.length < 1) {
    return ''
  }
  return result[1]
}
//获取页面顶部被卷起来的高度
export function getScrollTop() {
  return Math.max(
    //chrome
    document.body.scrollTop,
    //firefox/IE
    document.documentElement.scrollTop
  )
}
//获取页面文档的总高度
export function getDocumentHeight() {
  //现代浏览器（IE9+和其他浏览器）和IE8的document.body.scrollHeight和document.documentElement.scrollHeight都可以
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
}
//页面浏览器视口的高度
export function getWindowHeight() {
  return document.compatMode === 'CSS1Compat'
    ? document.documentElement.clientHeight
    : document.body.clientHeight
}
