export const isNumber = (val: any): val is number => {
  return typeof(val) === 'number'
}

export const isString = (val: any): val is String => {
  return typeof(val) === 'string'
}

export const isStringNumber = (val: any): boolean => {
  return isString(val) && !Number.isNaN(Number(val))
}