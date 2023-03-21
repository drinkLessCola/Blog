import { createContext } from 'react'

type IScrollHandlerContext = Array<(scrollTop: number) => void>
export const ScrollHandlerContext = createContext<IScrollHandlerContext>([])
