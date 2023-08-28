export function getImageURL(image: any) {
  // image为相对路径
  // 第二个参数:当前路径的URL
  return new URL(`../assets/img/${image}`, import.meta.url).href
}
