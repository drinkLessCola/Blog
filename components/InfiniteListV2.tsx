import { useNamespace } from '@/hooks/useNamespace'
import Scrollbar from './Scrollbar'
import { ScrollHandlerContext } from '@/context/ScrollHandlerContext'
import { useForwardContext } from '@/hooks/useForwardRef'
import useThrottle from '@/hooks/useThrottle'
import { useCallback, useEffect, useRef, useState } from 'react'

interface IInfiniteListProps<T> {
  initData: T[]
  total: number
  itemHeight: number
  bufferCount: number
  fetchData: (offset: number) => Promise<T[]>
  itemRender: React.FC<any>
}

interface IListItemPosition {
  index: number
  height: number
  top: number
  bottom: number
}

export default function InfiniteList <T extends { id: number | string }> ({ initData, total, itemHeight, itemRender, bufferCount, fetchData }: IInfiniteListProps<T>) {
  const ns = useNamespace('infiniteList')

  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const positions = useRef<IListItemPosition[]>([])
  const [listHeight, setListHeight] = useState(total * itemHeight)
  const [offset, setOffset] = useState(0)

  const showItemNumRef = useRef<number>(0)
  const aboveItemNumRef = useRef<number>(0)
  const belowItemNumRef = useRef<number>(0)

  const [data, setData] = useState<T[]>(initData)
  const [showDataList, setShowDataList] = useState<T[]>([])
  const isRequestRef = useRef(false)

  // 初始化列表项的高度为估计高度
  useEffect(() => {
    if (data.length === positions.current.length) return
    console.log('% 初始化列表项的高度为估计高度', data.length)
    const baseIdx = positions.current.length
    const baseHeight = baseIdx
      ? positions.current[baseIdx - 1].bottom
      : 0

    const newData = data.slice(baseIdx)
    positions.current.push(...newData.map((item, index) => ({
      index: baseIdx + index,
      height: itemHeight,
      top: index * itemHeight + baseHeight,
      bottom: (index + 1) * itemHeight + baseHeight
    })))

    console.log('% positions', positions.current)
  }, [data])

  const fetchMoreData = useCallback(() => {
    console.log('% 获取数据')
    isRequestRef.current = true
    const offset = data.length
    fetchData(offset)
      .then(data => {
        setData(dataList => [...dataList, ...data])
      })
      .catch(console.error)
      .finally(() => {
        isRequestRef.current = false
      })
  }, [data])

  // scrollTop 改变时，更新显示的数据
  const handleScroll = (scrollTop: number) => {
    const topIdx = binarySearch(scrollTop)
    const containerShowNum = showItemNumRef.current
    console.log('% handleScroll', positions.current, topIdx)

    aboveItemNumRef.current = Math.min(bufferCount, topIdx)
    belowItemNumRef.current = Math.min(bufferCount, total - (topIdx + containerShowNum))
    const startIdx = topIdx - aboveItemNumRef.current
    const endIdx = topIdx + containerShowNum + belowItemNumRef.current
    console.log('% 需要获取数据', endIdx, data.length)
    // endIdx > 已加载数据的最大索引，需要获取数据
    if (
      endIdx > data.length &&
      !isRequestRef.current
    ) {
      fetchMoreData()
    }

    // console.log('% handleScrollTopChange', containerShowNum, aboveItemNumRef.current, belowItemNumRef.current, startIdx, endIdx, dataRef.current.slice(startIdx, endIdx))
    setShowDataList(data.slice(startIdx, endIdx))
    const aboveHeight = startIdx ? positions.current[startIdx - 1].bottom : 0
    // const offset = scrollTop - scrollTop % (positions.current[endIdx].top - positions.current[startIdx].top)
    setOffset(aboveHeight)
  }

  const handleHeightChange = useCallback(useThrottle(() => {
    const height = containerRef.current?.clientHeight ?? 0
    // console.log('% height', height)
    // setContainerHeight(height)
    showItemNumRef.current = Math.ceil(height / itemHeight)
    console.log('% containerShowNum', Math.ceil(height / itemHeight))
  }, 500), [])

  // 寻找左侧边界！找到第一个 bottom <= scrollTop 的列表元素 idx，然后返回 idx + 1
  // const binarySearch2 = (value: number) => {
  //   const list = positions.current
  //   let start = 0
  //   let end = list.length
  //   // 左闭右开
  //   while (start < end) {
  //     const mid = (start + end) >> 1
  //     const midValue = list[mid].bottom
  //     // 缩小上界
  //     if (midValue === value) end = mid
  //     else if (midValue < value) start = mid + 1
  //     else if (midValue > value) end = mid
  //   }
  //   return start + 1
  // }

  // 寻找右侧边界！找到第一个 bottom > scrollTop 的列表元素 idx, 然后返回 idx
  const binarySearch = (value: number) => {
    const list = positions.current
    let start = 0
    let end = list.length
    while (start < end) {
      const mid = (start + end) >> 1
      const midValue = list[mid].bottom
      if (midValue === value) start = mid + 1
      else if (midValue < value) start = mid + 1
      else if (midValue > value) end = mid
    }

    return end
  }

  // 监听容器大小的变化
  useEffect(() => {
    // 组件第一次挂载，初始化容器的高度 & 可呈现的 item 数量
    handleHeightChange()
    handleScroll(0)
    window.addEventListener('resize', handleHeightChange)

    return () => {
      window.addEventListener('resize', handleHeightChange)
    }
  }, [handleHeightChange])

  // 更新列表项的位置信息
  useEffect(() => {
    const nodes = listRef.current?.childNodes
    if (!nodes?.length) return
    console.log('% 更新列表项的位置信息', positions.current, Array.from(nodes).map(node => (node as HTMLOptionElement).id))
    ;(nodes as NodeListOf<HTMLOptionElement>).forEach((node, idx) => {
      if (!node) return
      const { height } = node.getBoundingClientRect()
      // const idx = +node.id
      const oldHeight = positions.current[idx].height
      const delta = height - oldHeight
      // 位置信息正确：已更新过 / 高度与预期一致
      if (delta) {
        positions.current[idx].bottom = positions.current[idx].bottom + delta
        positions.current[idx].height = height
        for (let i = idx + 1; i < positions.current.length; i++) {
          positions.current[i].top = positions.current[i - 1].bottom
          positions.current[i].bottom = positions.current[i].bottom + delta
        }
      }
    })
    setListHeight(positions.current[positions.current.length - 1].bottom)
  })

  // useEffect(() => {
  //   setShowDataList()
  // }, [])

  // useEffect(() => {
  //   isRequestRef.current = true

  //   fetchData()
  //     .then(data => {
  //       dataListRef.current = [...dataListRef.current, ...data]
  //     })
  //     .catch(console.error)
  //     .finally(() => {
  //       isRequestRef.current = false
  //     })
  // }, [])

  return (
    <div ref={containerRef} id="container" style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <ScrollHandlerContext.Provider value={useForwardContext(ScrollHandlerContext, handleScroll)}>
        <Scrollbar fitParent>
          <div className={ns.e('phantom')} style={{ height: listHeight }}></div>
          <div
            ref={listRef}
            className={ns.e('list')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translate3d(0, ${offset}px, 0)`
            }}
          >
            {showDataList.map(item => (
              <div key={item.id} id={`${item.id}`}>
                {itemRender(item)}
              </div>
            ))}
          </div>
        </Scrollbar>
      </ScrollHandlerContext.Provider>
    </div>
  )
}


