import { useContext } from 'react'
import type { Context } from 'react'

export const useForwardContext = <K, T extends K[]>(context: Context<T>, value: K): T => {
  const parentContext = useContext(context)
  return [...parentContext, value] as T
}
