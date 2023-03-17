export const isNumber = (val: any): val is number => typeof (val) === 'number'

export const isString = (val: any): val is string => typeof (val) === 'string'

export const isStringNumber = (val: any): boolean => isString(val) && !Number.isNaN(Number(val))
