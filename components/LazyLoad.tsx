import { ScrollHandlerContext } from '@/context/ScrollHandlerContext'
import { useForwardContext } from '@/hooks/useForwardRef'
import useThrottle from '@/hooks/useThrottle'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import Scrollbar from './Scrollbar'

export default function LazyLoad ({ children }: PropsWithChildren) {
  console.log('LazyLoad render')
  // const [containerCoord, updateContainerCoord] = useState({ top: 0, bottom: 0 })
  const [imageLoadedFinish, updateImageLoadedFinish] = useState(false)
  const container = useRef<HTMLDivElement>(null)

  const loadImage = useCallback((imgDom: HTMLImageElement) => {
    if (!imgDom.dataset.src) return
    const src = imgDom.dataset.src
    imgDom.src = src
    imgDom.removeAttribute('data-src')
  }, [])

  const checkImageVisible = useCallback((imgCoord: DOMRect, rootCoord: DOMRect) => {
    console.log(imgCoord, rootCoord)
    return (
      imgCoord.top < rootCoord.bottom &&
      imgCoord.bottom > 0
    )
  }, [])

  const handlePageScroll = useThrottle((scrollTop: number) => {
    if (Number.isNaN(scrollTop)) return
    const containerDOM = container.current
    if (!containerDOM) return

    const rootCoord = containerDOM.getBoundingClientRect()
    const targetImage = containerDOM.querySelectorAll('img[data-src]')

    if (!targetImage.length) {
      updateImageLoadedFinish(true)
      return
    }

    targetImage.forEach((img) => {
      const imgCoord = img.getBoundingClientRect()
      console.log(img)
      if (checkImageVisible(imgCoord, rootCoord)) {
        loadImage(img as HTMLImageElement)
      }

    })
  }, 200)

  // useEffect(() => {
  //   if(typeof window !== 'undefined' && IntersectionObserver) {
  //     const options = {
  //       root: container,
  //       threshold: 0,
  //     }
  //     const handleIntersection:IntersectionObserverCallback = (entries, observer) => {
  //       entries.forEach(entry => {
  //         if(entry.isIntersecting) {
  //           console.log('intersection')
  //           loadImage(entry.target as HTMLImageElement)
  //           observer.unobserve(entry.target)
  //         }
  //       })
  //     }
  //     const observer = new IntersectionObserver(handleIntersection, options)
  //     const imgs = container?.querySelectorAll('img')
  //     imgs?.forEach(img => observer.observe(img))

  //     return () => {
  //       observer.disconnect()
  //     }
  //   }
  // }, [container])

  useLayoutEffect(() => {
    if (typeof window !== 'undefined'/* && !IntersectionObserver*/) {
      updateImageLoadedFinish(false)
      handlePageScroll()
    }
  }, [children])

  const handleScrollTopChange = useCallback((scrollTop: number) => {
    // if(!IntersectionObserver) {
    console.log('scrollTop change!')
    if (imageLoadedFinish) return

    handlePageScroll(scrollTop)
    // }
  }, [])


  return (
    <ScrollHandlerContext.Provider value={useForwardContext(ScrollHandlerContext, handleScrollTopChange)}>
      <div ref={container} style={{ height: '100%' }}>
        <Scrollbar fitParent>
          {children}
        </Scrollbar>
      </div>
    </ScrollHandlerContext.Provider>
  )
}
