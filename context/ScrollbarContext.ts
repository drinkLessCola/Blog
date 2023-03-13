import { createContext } from "react";

interface IScrollbarContext{
  updateScroll: (isVertical: boolean, offset: number) => void
  size: number
}

export const ScrollbarContext = createContext<IScrollbarContext>({
  // TODO
  updateScroll: (isVertical, offset) => {},
  size: 10
})