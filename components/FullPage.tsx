import { ScrollToContext } from '@/context/ScrollbarContext'
import { type PropsWithChildren, useRef, useEffect, useContext } from 'react'

export default function FullPage ({ children }: PropsWithChildren) {
  console.log('FullPage rerender')

  const containerRef = useRef<HTMLDivElement>(null)
  const pageIndex = useRef(0)
  const { scrollTo, isScrolling } = useContext(ScrollToContext)

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

  const handleScroll = (event: WheelEvent) => {
    event.preventDefault()
    if (isScrolling.current) return
    const isScrollDown = event.deltaY > 0
    if (isScrollDown) {
      const nextPage = pageIndex.current + 1
      scrollToPage(nextPage)
    } else {
      const prevPage = pageIndex.current - 1
      scrollToPage(prevPage)
    }
  }

  const handleResize = () => {
    scrollToPage(pageIndex.current)
  }
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    window.addEventListener('resize', handleResize)
    container.addEventListener('wheel', handleScroll, { passive: false })
    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('wheel', handleScroll)
    }
  })

  return (
    <div style={{ height: '100%' }} ref={containerRef}>
      {children}
    </div>
  )
}
