export default function debounce (this: any, fn: Function, delay: number = 500) {
  let timer: number
  return (...args: any[]) => {
    timer && clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}