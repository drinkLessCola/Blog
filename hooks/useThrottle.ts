/* eslint-disable consistent-this */
/* eslint-disable @typescript-eslint/no-this-alias */
export default function useThrottle (fn: Function, delay: number) {
  let saveThis: any = null
  let saveArgs: any[] | null = null
  let isThrottle = false
  return function wrapper (this: any, ...args: any[]) {
    if (isThrottle) {
      saveThis = this
      saveArgs = args
      return
    }

    isThrottle = true
    fn.apply(this, args)

    setTimeout(() => {
      isThrottle = false
      if (saveArgs) {
        wrapper.apply(saveThis, saveArgs)
        saveThis = saveArgs = null
      }
    }, delay)
  }
}
