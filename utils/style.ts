import { isNumber, isString, isStringNumber } from "./type"


export const addUnit = (value?: string | number, unit = 'px') => {
  if(!value) return ''
  if(isNumber(value) || isStringNumber(value)) {
    return `${value}${unit}`
  } else if (isString(value)) {
    return value
  }
  // TODO: warning
}

