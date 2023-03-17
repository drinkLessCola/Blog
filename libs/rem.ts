import debounce from './debounce'
// const handleMedia = (width: number): number => {
//   if(width < 640) return 36
//   else if(width < 768) return 24
//   else if(width < 1024) return 18
//   else if(width < 1280) return 14
//   return 14
// }
export const useRem = () => {
  const documentRoot = document.documentElement
  const designSize = 1536
  const fontSize = 14
  // let fontSize = handleMedia(documentRoot.clientWidth)
  // 设备纵横方向变化
  const resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const handleResize = () => {
    const clientWidth = documentRoot.clientWidth
    if (!clientWidth) return
    let rem = fontSize * clientWidth / designSize
    documentRoot.style.fontSize = `${rem}px`
    console.log(rem)
  }
  // TODO: 改为节流
  window.addEventListener(resizeEvent, debounce(handleResize, 500))
  window.addEventListener('pageshow', debounce(handleResize, 500))
}
