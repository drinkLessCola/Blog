import { createContext } from 'react'
import type { RefObject } from 'react'

interface IScrollbarContext {
  updateScroll: (isVertical: boolean, offset: number) => void
  size: number
}

export const ScrollbarContext = createContext<IScrollbarContext>({
  // TODO
  updateScroll: (isVertical, offset) => {},
  size: 10
})

interface IScrollToContext {
  scrollTo: (scrollTop: number) => void
  isScrolling: RefObject<boolean>
}
export const ScrollToContext = createContext<IScrollToContext>({
  scrollTo: () => {},
  isScrolling: { current: false }
})
