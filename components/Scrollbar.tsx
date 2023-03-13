import { ScrollbarContext } from "@/context/ScrollbarContext"
import { useClassName } from "@/hooks/useClassName"
import { useNamespace } from "@/hooks/useNamespace"
import { addUnit } from "@/utils/style"
import { isNumber } from "@/utils/type"
import React from "react"
import { PropsWithChildren, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import LazyLoad from "./LazyLoad"


export interface IScrollbarProps {
  thumbSize?: number,
  fitParent?: boolean,
  maxHeight?: number | string,
  width?: number | string,
  height?: number | string,
  alwaysVisible?: boolean,
  recordKey?: string
}
export default function Scrollbar({ 
  children,
  thumbSize = 10, 
  fitParent = false,
  maxHeight,
  width,
  height,
  alwaysVisible = false,
  recordKey
}: PropsWithChildren<IScrollbarProps>) {
  const ns = useNamespace('scrollbar')

  const [scrollX, updateScrollX] = useState(0)   // 水平滚动条的偏移量
  const [scrollY, updateScrollY] = useState(0)   // 垂直滚动条的偏移量
  const [lock, updateLock] = useState(false)

  const [horizontalThumbWidth, updateHorizontalThumbWidth] = useState(0)
  const [verticalThumbHeight, updateVerticalThumbHeight] = useState(0)

  let [thumbVisible, updateThumbVisible] = useState(false)  // 鼠标是否移入实例，用于控制滚动条的显隐
  let [wrapperCoord, updateWrapperCoord] = useState({
    height: 0,
    width: 0,
    top: 0,
    left: 0,
  })

  const wrapRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)

  const scrollbarStyle = useMemo(() => ({
    '--ice-thumb-size': thumbSize + 'px',
    height: fitParent ? '100%' : undefined,
  }), [ thumbSize, fitParent ])

  const wrapStyle = useMemo(() => ({
    maxHeight: maxHeight ? addUnit(maxHeight) : undefined,
    width: width ? addUnit(width) : undefined,
    height: height ? addUnit(height) : undefined,
  }), [maxHeight, width, height])

  const showScrollbar = useCallback(() => updateThumbVisible(true), [])
  const hideScrollbar = useCallback(() => updateThumbVisible(false), [])

  /**
   * 处理鼠标滚动事件
   * scroll 事件只有在 overflow: scroll | auto 的状态下才能产生
   * @param event 
   */
  const handleScroll = () => {
    const wrapDom = wrapRef.current!
    updateScrollX(wrapDom.scrollLeft / wrapDom.scrollWidth * (wrapperCoord.width - thumbSize))
    updateScrollY(wrapDom.scrollTop / wrapDom.scrollHeight * (wrapperCoord.height - thumbSize))
  }

  const handleRecord = (scrollTop: number) => {
    if(!recordKey) return
    window.sessionStorage.setItem(recordKey, `${scrollTop}`)
  }

  const getRecord = useCallback(() => {
    if(!recordKey) return
    const record = Number(window.sessionStorage.getItem(recordKey))
    return Number.isNaN(record) ? 0 : record
  }, [recordKey])

  const updateScroll = useCallback((isVertical: boolean, offset: number) => {
    if(isVertical) updateScrollY(offset)
    else updateScrollX(offset)
  }, [])

  useEffect(() => {
    if(typeof window !== 'undefined') {
      // console.log('============ useEffect-1 ================')
      updateLock(false)
      // console.log('lock', lock)
      // 取消原生 drag 和 select 事件
      // TODO: 还没有取消 bar 的 select 事件

      // 监听 resize 事件
      window.onresize = initScrollbar
      // 初始化
      initScrollbar()

      // console.log('============ useEffect-1 end ================')

      return () => {
        window.onresize = null
      }
    }
  }, [recordKey, thumbSize])

  /**
   * 根据滚动条的偏移更新 view 容器的滚动偏移
   */
  useEffect(() => {
    if(typeof window !== 'undefined' && wrapperCoord.height) {
      // console.log('============ useEffect-2 ================')
      // console.log('lock', lock)
      
      const wrapDom = wrapRef.current!
      const barHeight = wrapperCoord.height - thumbSize
      const barWidth = wrapperCoord.width - thumbSize

      // console.log('?', recordKey, lock)
      if(recordKey && !lock) {
        // console.log('?!')
        const lastScroll = getRecord()
        // console.log('lastScroll', lastScroll)
        if(isNumber(lastScroll)) {
          updateScrollY(lastScroll * barHeight / wrapDom.scrollHeight)
          updateLock(true)
        }
      }

      const scrollTop = scrollY / barHeight * wrapDom.scrollHeight
      wrapDom.scrollTop = scrollTop
      console.log('scrollTop!!!!', wrapDom.scrollTop)
      wrapDom.scrollLeft = scrollX / barWidth * wrapDom.scrollWidth

      // 记录滚动条位置的回调
      // console.log('handleRecord', lock)
      if(lock) handleRecord(scrollTop)
      // console.log('============ useEffect-2 end ================')
    }
  }, [scrollX, scrollY, wrapperCoord])

  function scrollTo(x: number, y: number) {
    const wrapDom = wrapRef.current!
    // console.log(wrapDom.scrollTop)
    wrapDom.scrollTo({
      top: y,
      left: x,
      // behavior: 'smooth'
    })
    // console.log(wrapDom.scrollTop)
  }

  function scrollIntoView(elem: HTMLElement) {
    const wrapDom = wrapRef.current!
    if (!wrapDom.contains(elem)) return

    const { top, left } = elem.getBoundingClientRect()
    const { top: wrapperClientTop, left: wrapperClientLeft } = wrapperCoord
    scrollTo(left - wrapperClientLeft, top - wrapperClientTop)
  }

  /**
   * 初始化 scrollbar
   */
  function initScrollbar() {
    const wrapperDom = wrapRef.current
    const viewDom = viewRef.current

    if(!wrapperDom || !viewDom) return

    // 计算滚动条的长度 & 最大偏移量 & 是否溢出
    const { left, top } = wrapperDom.getBoundingClientRect()
    // clientHeight / clientWidth 不包括滚动条的宽度
    const { clientHeight: height, clientWidth: width } = wrapperDom
    const { scrollHeight, scrollWidth } = viewDom
    updateWrapperCoord({ left, top, width, height })
    // 解决 view 容器高度小于 wrap 容器的情况
    updateHorizontalThumbWidth(Math.min(width / scrollWidth, 1) * (width - thumbSize))
    updateVerticalThumbHeight(Math.min(height / scrollHeight, 1) * (height - thumbSize))
  }

  const handleMouseEnter = () => showScrollbar()
  const handleMouseLeave = () => hideScrollbar()

  
  return (
      <div 
        className={ns.b()}
        style={scrollbarStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={wrapRef} className={ns.e('wrap')} style={wrapStyle} onScroll={handleScroll}>
          <div ref={viewRef} className={ns.e('view')}>
            <LazyLoad container={wrapRef}>{ children }</LazyLoad>  
          </div>
        </div>
        <ScrollbarContext.Provider value={{ updateScroll, size: thumbSize }}>
          <Thumb
            offset={scrollX} 
            visible={alwaysVisible || thumbVisible}
            barLength={wrapperCoord.width}
            thumbLength={horizontalThumbWidth} 
          />
          <Thumb 
            offset={scrollY} 
            visible={alwaysVisible || thumbVisible} 
            barLength={wrapperCoord.height}
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
    key: 'vertical',
  },
  horizontal: {
    axis: 'X',
    size: 'height',
    length: 'width',
    client: 'clientLeft',
    clientCoord: 'clientX',
    directionStart: 'left',
    key: 'horizontal',
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
    [lengthAttr]: thumbLength + 'px',
  }
}

interface ThumbProps {
  offset: number
  visible: boolean
  barLength: number
  thumbLength: number
  isVertical?: boolean
}

function thumb({
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
  const barClientStart = barRef.current?.getBoundingClientRect()[bar['directionStart']]!
  /**
   * 处理滚动条所在轨道的点击事件
   * @param event 
   */
  function handleClickBar(event: MouseEvent) {
    const barCoord = barRef.current!.getBoundingClientRect()
    // event.clientX - barCoord.left
    const offset = event[bar['clientCoord']] - barCoord[bar['directionStart']] - thumbLength / 2
    const scroll = Math.min(Math.max(0, offset), maxScroll)
    updateScroll(scroll)
  }

  /**
   * 开始拖拽滚动条
   * https://zh.javascript.info/mouse-drag-and-drop
   * @param event 
   */
  function handleMouseDown(event: React.MouseEvent<Element, MouseEvent>) {
    // 判断是点击事件，还是拖动事件
    let isClick = true
    // 设置滑块的拖动状态
    setIsDragging(true)

    // 拖动的目标元素
    const target = thumbRef.current!
    const targetClient = target.getBoundingClientRect()[bar['directionStart']]

    // 鼠标事件的坐标
    const start = event[bar['clientCoord']]
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
    function handleMouseMove(event: MouseEvent) {
      const current = event[bar['clientCoord']]
      // 点击事件
      if (isClick && (Math.abs(current - start) >= 3)) {
        isClick = false
      }
      window?.getSelection()?.removeAllRanges();
      moveTo(current)
    }

    /**
     * 鼠标按键松开，移动滑块结束
     * @param event 
     */
    function handleMouseUp(event: MouseEvent) {
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
    function moveTo(axisCoord: number) {
      // event.clientX - bar.left - shift
      const offset = axisCoord - barClientStart - shift
      const scroll = Math.min(Math.max(0, offset), maxScroll)
      updateScroll(scroll)
    }
  }

  const thumbStyle = useMemo(() => {
    return genThumbStyle({
      offset,
      thumbLength, 
      bar
    })
  }, [offset, thumbLength, bar])

  useEffect(() => {
    const thumbDom = thumbRef.current!
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

const Thumb = React.memo(thumb)