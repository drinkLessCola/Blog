import { ScrollToContext } from '@/context/ScrollbarContext'
import { preventDefaultCallback } from '@/utils/function'
import { type PropsWithChildren, useRef, useEffect, useContext } from 'react'

export default function FullPage ({ children }: PropsWithChildren) {
  console.log('FullPage rerender')

  const containerRef = useRef<HTMLDivElement>(null)
  const pageIndex = useRef(0)
  const { scrollTo, isScrolling } = useContext(ScrollToContext)
  const touchStartY = useRef(0)

  function scrollToPage (idx: number) {
    const container = containerRef.current
    if (!container) return
    const section = Array.from(container.querySelectorAll('[data-fullpage]'))
      .map(el => (el as HTMLElement).offsetTop)
    const sectionNum = section.length

    pageIndex.current = Math.max(Math.min(sectionNum - 1, idx), 0)
    const scrollTop = section[pageIndex.current]

    scrollTo(scrollTop)
  }

  const changePage = (isScrollDown: boolean) => {
    if (isScrollDown) {
      const nextPage = pageIndex.current + 1
      scrollToPage(nextPage)
    } else {
      const prevPage = pageIndex.current - 1
      scrollToPage(prevPage)
    }
  }

  const handleScroll = (event: WheelEvent) => {
    event.preventDefault()
    if (isScrolling.current) return
    const isScrollDown = event.deltaY > 0
    changePage(isScrollDown)
  }

  const handleResize = () => {
    scrollToPage(pageIndex.current)
  }

  const handleTouchStart = (event: TouchEvent) => {
    touchStartY.current = event.touches[0].pageY
  }
  const handleTouchEnd = (event: TouchEvent) => {
    const endY = event.changedTouches[0].pageY
    const isScrollDown = endY - touchStartY.current < 0
    changePage(isScrollDown)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    window.addEventListener('resize', handleResize)
    container.addEventListener('wheel', handleScroll, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: false })
    container.addEventListener('touchmove', preventDefaultCallback, { passive: false })
    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('wheel', handleScroll)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchmove', preventDefaultCallback)
    }
  })

  return (
    <div style={{ height: '100%' }} ref={containerRef}>
      {children}
    </div>
  )
}
