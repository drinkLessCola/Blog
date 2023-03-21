export const noop = () => {}
export const preventDefaultCallback = (event: Event) => {
  console.log('preventDefault!!!!!!!!!!')
  event.preventDefault()
}
