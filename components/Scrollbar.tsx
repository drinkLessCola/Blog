import { ArticleContext } from '@/context/ArticleContext'
import { ScrollHandlerContext } from '@/context/ScrollHandlerContext'
import { ScrollToContext, ScrollbarContext } from '@/context/ScrollbarContext'
import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'
import useThrottle from '@/hooks/useThrottle'
import { addUnit } from '@/utils/style'
import { isNumber } from '@/utils/type'
import React, { type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react'

export interface IScrollbarProps {
  thumbSize?: number
  fitParent?: boolean
  maxHeight?: number | string
  width?: number | string
  height?: number | string
  alwaysVisible?: boolean
  fullPage?: boolean
}
export default function Scrollbar ({
  children,
  thumbSize = 10,
  fitParent = false,
  maxHeight,
  width,
  height,
  alwaysVisible = false
}: PropsWithChildren<IScrollbarProps>) {
  const ns = useNamespace('scrollbar')

  const [scrollX, setScrollX] = useState(0) // 水平滚动条的偏移量
  const [scrollY, setScrollY] = useState(0) // 垂直滚动条的偏移量
  const [scrollLeft, setScrollLeft] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const isScrolling = useRef(false)
  const lock = useRef(false) // 是否响应滚动事件
  const lastScrollTop = useRef(0)
  const requireScrollingAnimate = useRef(false)

  const [horizontalThumbWidth, setHorizontalThumbWidth] = useState(0)
  const [verticalThumbHeight, setVerticalThumbHeight] = useState(0)

  let [thumbVisible, setThumbVisible] = useState(false) // 鼠标是否移入实例，用于控制滚动条的显隐
  let [wrapCoord, setWrapCoord] = useState({
    height: 0,
    width: 0,
    top: 0,
    left: 0
  })

  const wrapRef = useRef<HTMLDivElement>(null!)
  const viewRef = useRef<HTMLDivElement>(null!)

  const { currentLink: recordKey } = useContext(ArticleContext)

  const scrollbarStyle = useMemo(() => ({
    '--ice-thumb-size': `${thumbSize}px`,
    height: fitParent ? '100%' : undefined,
    width: fitParent ? '100%' : undefined
  }), [thumbSize, fitParent])

  const wrapStyle = useMemo(() => ({
    maxHeight: maxHeight ? addUnit(maxHeight) : undefined,
    width: width ? addUnit(width) : undefined,
    height: height ? addUnit(height) : undefined
  }), [maxHeight, width, height])

  const showScrollbar = useCallback(() => {setThumbVisible(true)}, [])
  const hideScrollbar = useCallback(() => {setThumbVisible(false)}, [])

  const handlers = useContext(ScrollHandlerContext)

  const wrapDom = wrapRef.current
  const viewDom = viewRef.current

  /**
   * 处理鼠标滚动事件
   * scroll 事件只有在 overflow: scroll | auto 的状态下才能产生
   * @param event
   */
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!wrapDom || isScrolling.current) return
    const curScrollTop = wrapDom.scrollTop
    setScrollLeft(wrapDom.scrollLeft)

    setScrollTop(curScrollTop)
    lastScrollTop.current = scrollTop
  }

  /**
   * 记录滚动位置
   * @param scrollTop 滚动位置
   */
  const handleRecord = (scrollTop: number): void => {
    if (!recordKey) return
    window.sessionStorage.setItem(`@scroll|${recordKey}`, `${scrollTop}`)
  }

  /**
   * 从 sessionStorage 中获取上次滚动的位置
   * 无需记录，返回 undefined
   * 没有记录，返回 0
   */
  const getRecord = useCallback(() => {
    if (!recordKey) return
    const record = Number(window.sessionStorage.getItem(`@scroll|${recordKey}`))
    return Number.isNaN(record) ? 0 : record
  }, [recordKey])


  const updateScroll = (isVertical: boolean, scroll: number) => {
    const { height: wrapHeight, width: wrapWidth } = wrapCoord
    if (isVertical) {
      console.log('$ - 2', viewDom.scrollHeight)

      setScrollTop(scroll / (wrapHeight - thumbSize) * viewDom.scrollHeight)
      lastScrollTop.current = scrollTop
    } else setScrollLeft(scroll / (wrapWidth - thumbSize) * viewDom.scrollWidth)
  }

  // const flipToNextDOM = (isScrollDown: boolean, scrollTop: number) => {
  //   console.log('isScrollDown', isScrollDown)
  //   if (!viewDom || !wrapDom) return

  //   const { height } = viewDom.getBoundingClientRect()
  //   const children: HTMLElement[] = Array.from(viewDom.querySelectorAll('[data-fullpage]'))

  //   const target = children.reduce((target: HTMLElement | null, child: HTMLElement) => {
  //     if (target) return target
  //     const { top, bottom } = child.getBoundingClientRect()
  //     if (isScrollDown && top > 0) {
  //       return child
  //     } else if (!isScrollDown && bottom > 0 && bottom < height) {
  //       return child
  //     }
  //     return target
  //   }, null)

  //   return target
  // }

  /**
   * 页面初始渲染
   */
  useEffect(() => {
    if (!wrapRef.current) return
    // 初始化
    console.log('初始 render')
    lock.current = false
    initScrollbar()
  }, [children])

  /**
   * 侦听 resize 事件
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 监听 resize 事件
      window.onresize = () => {
        initScrollbar()
      }
      return () => {
        window.onresize = null
      }
    }
  })

  /**
   * 根据滚动条的偏移更新 view 容器的滚动偏移
   */
  useLayoutEffect(() => {
    const { height: wrapHeight, width: wrapWidth } = wrapCoord
    if (typeof window !== 'undefined' && wrapHeight) {
      // console.log('============ useEffect-2 ================')
      // console.log('scrollTop', scrollTop)
      const barHeight = wrapHeight - thumbSize
      const barWidth = wrapWidth - thumbSize

      // 滚动至上次浏览的位置
      if (!lock.current) {
        const lastScroll = getRecord()
        if (isNumber(lastScroll)) {
          lastScrollTop.current = scrollTop


          setScrollTop(lastScroll) // 同步更新
          requireScrollingAnimate.current = true // 同步触发动画开始执行
        }
        lock.current = true
      } else {
        // 执行父容器设置的回调
        handlers.forEach((handler) => {
          handler(scrollTop ?? NaN)
        })
        // 记录滚动位置
        handleRecord(scrollTop)
      }

      wrapDom.scrollTop = scrollTop
      wrapDom.scrollLeft = scrollLeft

      // 根据 scrollTop 计算滚动条滑块距离顶端的高度
      const scrollY = scrollTop / viewRef.current.scrollHeight * barHeight
      const scrollX = scrollLeft / viewRef.current.scrollWidth * barWidth
      setScrollY(scrollY)
      setScrollX(scrollX)

      // const scrollTop = scrollY / barHeight * wrapDom.scrollHeight
      // console.log('============ useEffect-2 end ================')
    }
  }, [scrollLeft, scrollTop, wrapCoord])

  /**
   * 滚动动画 Flip + animate 实现
   */
  useLayoutEffect(() => {
    if (!requireScrollingAnimate.current) return

    const delta = scrollTop - lastScrollTop.current
    if (!delta) return
    isScrolling.current = true

    const animation = viewDom.animate([
      { transform: `translateY(${delta}px)` },
      { transform: 'translate(0)' }
    ], {
      duration: Math.min(Math.abs(delta), 1000),
      easing: 'ease-in-out'
    })

    animation.onfinish = () => {
      isScrolling.current = false
    }

    requireScrollingAnimate.current = false
  }, [requireScrollingAnimate.current])

  // useEffect(() => {
  //   if (typeof window !== 'undefined' && IntersectionObserver) {
  //     const options = {
  //       root: wrapDom,
  //       threshold: [0.01, 0.99]
  //     }
  //     const handleIntersection: IntersectionObserverCallback = (entries, observer) => {
  //       console.log('!!!!!!!!!!!!!!!!!!handleIntersection')
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           // 开始滚动到对应的 page
  //           const elem = entry.target as HTMLElement
  //           const ratio = entry.intersectionRatio
  //           console.log('elem', elem)
  //           console.log('ratio', ratio)
  //           console.log('target', scrollTarget)
  //           if (!scrollTarget && ratio < 0.1) {
  //             wrapDom.addEventListener('wheel', preventDefaultCallback)
  //             console.log('intersection, scroll to', elem)
  //             setIsScrollFullPage(true)
  //             setScrollTarget(elem)
  //             entry.target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  //           } else if (entry.target === scrollTarget && ratio > 0.9) {
  //             console.log('intersection, scroll finish', elem)
  //             wrapDom.removeEventListener('wheel', preventDefaultCallback)
  //             setIsScrollFullPage(false)
  //             setScrollTarget(null)
  //           }
  //         }
  //       })
  //     }
  //     const observer = new IntersectionObserver(handleIntersection, options)
  //     const fullPageDOM = viewDom?.querySelectorAll('[data-fullpage]')
  //     fullPageDOM?.forEach((item) => {observer.observe(item)})

  //     return () => {
  //       observer.disconnect()
  //       wrapDom?.removeEventListener('wheel', preventDefaultCallback)
  //     }
  //   }
  // }, [children, scrollTarget])


  // function scrollIntoView (elem: HTMLElement) {
  //   const wrapDom = wrapRef.current
  //   if (!wrapDom?.contains(elem)) return

  //   const { top, left } = elem.getBoundingClientRect()
  //   const { top: wrapperClientTop, left: wrapperClientLeft } = wrapperCoord
  //   scrollTo(left - wrapperClientLeft, top - wrapperClientTop)
  // }

  /**
   * 初始化 scrollbar
   * Ref 是稳定不变的，setState 也是
   */
  const initScrollbar = useMemo(() => useThrottle(() => {
    const wrapDom = wrapRef.current
    const viewDom = viewRef.current
    if (typeof window === 'undefined' || !wrapDom) return

    // 计算滚动条的长度 & 最大偏移量 & 是否溢出
    const { left, top } = wrapDom.getBoundingClientRect()
    // clientHeight / clientWidth 不包括滚动条的宽度
    const { clientHeight: height, clientWidth: width } = wrapDom
    const { scrollHeight, scrollWidth } = viewDom

    console.log('$ initScrollbar', height, width)
    setWrapCoord({ left, top, width, height })

    // 解决 view 容器高度小于 wrap 容器的情况
    setHorizontalThumbWidth(Math.min(width / scrollWidth, 1) * (width - thumbSize))
    setVerticalThumbHeight(Math.min(height / scrollHeight, 1) * (height - thumbSize))
  }, 200), [])

  const scrollTo = (scroll: number) => {
    console.log('scroll', scroll)
    setScrollTop(scroll)
    lastScrollTop.current = scrollTop
    requireScrollingAnimate.current = true
  }

  const handleMouseEnter = () => {showScrollbar()}
  const handleMouseLeave = () => {hideScrollbar()}

  return (
      <div
        className={ns.b()}
        style={scrollbarStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={wrapRef} className={ns.e('wrap')} style={wrapStyle} onScroll={handleScroll}>
          <div ref={viewRef} className={ns.e('view')}>
            <ScrollToContext.Provider value={{ scrollTo, isScrolling }}>
              {children}
            </ScrollToContext.Provider>
          </div>
        </div>
        <ScrollbarContext.Provider value={{ updateScroll, size: thumbSize }}>
          <Thumb
            offset={scrollX}
            visible={alwaysVisible || thumbVisible}
            barLength={wrapCoord.width}
            thumbLength={horizontalThumbWidth}
          />
          <Thumb
            offset={scrollY}
            visible={alwaysVisible || thumbVisible}
            barLength={wrapCoord.height}
            thumbLength={verticalThumbHeight}
            isVertical
          />
        </ScrollbarContext.Provider>
    </div>
  )
}


export const BAR_MAP = {
  vertical: {
    axis: 'Y',
    size: 'width',
    length: 'height',
    client: 'clientTop',
    clientCoord: 'clientY',
    directionStart: 'top',
    key: 'vertical'
  },
  horizontal: {
    axis: 'X',
    size: 'height',
    length: 'width',
    client: 'clientLeft',
    clientCoord: 'clientX',
    directionStart: 'left',
    key: 'horizontal'
  }
} as const


export const genThumbStyle = (
  {
    offset,
    thumbLength,
    bar
  }: Pick<ThumbProps, 'thumbLength' | 'offset'> & {
    bar: typeof BAR_MAP[keyof typeof BAR_MAP]
  }
) => {
  const { axis, length: lengthAttr } = bar
  return {
    transform: `translate${axis}(${offset}px)`,
    [lengthAttr]: `${thumbLength}px`
  }
}

interface ThumbProps {
  offset: number
  visible: boolean
  barLength: number
  thumbLength: number
  isVertical?: boolean
}

function thumb ({
  offset,
  visible,
  barLength,
  thumbLength,
  isVertical = false
}: ThumbProps) {
  const ns = useNamespace('scrollbar')

  const barRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)

  const { updateScroll: update, size } = useContext(ScrollbarContext)
  const updateScroll = update.bind(null, isVertical)

  const bar = useMemo(() => BAR_MAP[isVertical ? 'vertical' : 'horizontal'], [isVertical])
  const maxScroll = useMemo(() => barLength - thumbLength - size, [barLength, thumbLength, size])
  const isOverflow = useMemo(() => !!maxScroll, [maxScroll])
  const barClientStart = barRef.current?.getBoundingClientRect()[bar.directionStart]

  /**
   * 处理滚动条所在轨道的点击事件
   * @param event
   */
  function handleClickBar (event: MouseEvent) {
    if (!barRef.current) return

    const barCoord = barRef.current.getBoundingClientRect()
    // event.clientX - barCoord.left
    const offset = event[bar.clientCoord] - barCoord[bar.directionStart] - thumbLength / 2
    const scroll = Math.min(Math.max(0, offset), maxScroll)
    updateScroll(scroll)
  }

  /**
   * 开始拖拽滚动条
   * https://zh.javascript.info/mouse-drag-and-drop
   * @param event
   */
  function handleMouseDown (event: React.MouseEvent<Element, MouseEvent>) {
    // 判断是点击事件，还是拖动事件
    let isClick = true
    // 设置滑块的拖动状态
    setIsDragging(true)

    // 拖动的目标元素
    const target = thumbRef.current
    if (!target) return
    const targetClient = target.getBoundingClientRect()[bar.directionStart]

    // 鼠标事件的坐标
    const start = event[bar.clientCoord]
    // 鼠标事件的坐标 相对于 scrollbar 的滑块左上角的偏移值
    // e.g. event.clientX - targetLeft
    const shift = start - targetClient

    moveTo(start)

    // const thottleMouseMoveHandler = throttle(handleMouseMove, 50)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    /**
     * 处理鼠标移动滑块
     * @param event
     */
    function handleMouseMove (event: MouseEvent) {
      const current = event[bar.clientCoord]
      // 点击事件
      if (isClick && (Math.abs(current - start) >= 3)) isClick = false

      window?.getSelection()?.removeAllRanges()
      moveTo(current)
    }

    /**
     * 鼠标按键松开，移动滑块结束
     * @param event
     */
    function handleMouseUp (event: MouseEvent) {
      // 处理点击事件
      if (isClick) handleClickBar(event)

      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    /**
     * 移动滑块
     * @param axisCoord 鼠标相对窗口在轴上的坐标
     */
    function moveTo (axisCoord: number) {
      // event.clientX - bar.left - shift
      const offset = axisCoord - (barClientStart ?? 0) - shift
      const scroll = Math.min(Math.max(0, offset), maxScroll)
      updateScroll(scroll)
    }
  }

  const thumbStyle = useMemo(() => genThumbStyle({
    offset,
    thumbLength,
    bar
  }), [offset, thumbLength, bar])

  useEffect(() => {
    const thumbDom = thumbRef.current
    if (!thumbDom) return

    const cancelEventHandler = () => false
    thumbDom.ondragstart = cancelEventHandler
    thumbDom.onselectstart = cancelEventHandler

    return () => {
      thumbDom.ondragstart = null
      thumbDom.onselectstart = null
    }
  }, [])

  return (
    <div
      ref={barRef}
      className={useClassName(ns.e('bar'), ns.is(bar.key))}
      style={{ visibility: isOverflow && (visible || isDragging) ? 'visible' : 'hidden' }}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={thumbRef}
        className={ns.e('thumb')}
        style={thumbStyle}
      />
    </div>
  )
}

export const Thumb = React.memo(thumb)
