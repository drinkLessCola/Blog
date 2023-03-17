import useThrottle from '@/hooks/useThrottle'
import { useCallback, useEffect, useState } from 'react'
import type { PropsWithChildren, RefObject } from 'react'

interface LazyLoadProps {
  // 解包的 dom 不是最新的
  container: RefObject<HTMLElement> | null
}

export default function LazyLoad ({ children, container }: PropsWithChildren<LazyLoadProps>) {
  // const [containerCoord, updateContainerCoord] = useState({ top: 0, bottom: 0 })
  const [containerDOM, updateContainerDOM] = useState<HTMLElement>()
  const [imageLoadedFinish, updateImageLoadedFinish] = useState(false)

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

  const handlePageScroll = useThrottle((event?: Event) => {
    if (!containerDOM) return
    console.log('scroll~~~~~~~~~~~~~')
    console.log(containerDOM)
    const rootCoord = containerDOM.getBoundingClientRect()
    const targetImage = containerDOM.querySelectorAll('img[data-src]')

    if (!targetImage.length) {
      updateImageLoadedFinish(true)
      return
    }

    targetImage.forEach((img) => {
      const imgCoord = img.getBoundingClientRect()
      console.log(img)
      if (checkImageVisible(imgCoord, rootCoord))
        loadImage(img as HTMLImageElement)

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

  useEffect(() => {
    if (typeof window !== 'undefined'/* && !IntersectionObserver*/) {
      updateImageLoadedFinish(false)
      const containerDOM = container?.current ?? document.documentElement
      updateContainerDOM(containerDOM)
      handlePageScroll()
    }
  }, [children])

  useEffect(() => {
    // if(!IntersectionObserver) {
    console.log('scrollTop change!')
    if (imageLoadedFinish) return

    handlePageScroll()
    // }
  }, [containerDOM?.scrollTop])


  return <>{children}</>
}
