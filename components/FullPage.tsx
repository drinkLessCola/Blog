import { ScrollToContext } from '@/context/ScrollbarContext'
import { type PropsWithChildren, useRef, useEffect, useContext } from 'react'

export default function FullPage ({ children }: PropsWithChildren) {
  console.log('FullPage rerender')

  const containerRef = useRef<HTMLDivElement>(null)
  const pageIndex = useRef(0)
  const { scrollTo, isScrolling } = useContext(ScrollToContext)

  function scrollToNextPage () {
    const container = containerRef.current!
    const section = Array.from(container.querySelectorAll('[data-fullpage]'))
      .map((el) => (el as HTMLElement).offsetTop)
    const sectionNum = section.length

    pageIndex.current = Math.min(pageIndex.current + 1, sectionNum - 1)
    const scrollTop = section[pageIndex.current]
    console.log('nextPage', scrollTop)

    scrollTo(scrollTop)
  }

  function scrollToPrevPage () {
    const container = containerRef.current!
    const section = Array.from(container.querySelectorAll('[data-fullpage]'))
      .map((el) => (el as HTMLElement).offsetTop)

    pageIndex.current = Math.max(pageIndex.current - 1, 0)
    const scrollTop = section[pageIndex.current]

    console.log('prevPage', scrollTop)

    scrollTo(scrollTop)
  }

  const handleScroll = (event: WheelEvent) => {
    console.log('FullPage scroll!', event.currentTarget, event.target)
    event.preventDefault()
    if (isScrolling.current) return
    const isScrollDown = event.deltaY > 0

    console.log(isScrollDown)
    if (isScrollDown) scrollToNextPage()
    else scrollToPrevPage()

  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleScroll, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleScroll)
    }
  })

  return (
    <div style={{ height: '100%' }} ref={containerRef}>
      {children}
    </div>
  )
}
