import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'
import SvgIcon from './SvgIcon'
import ArrowBack from '@/public/icons/arrowBack.svg'
import ArrowForward from '@/public/icons/arrowForward.svg'
import { useMemo, useState } from 'react'
export interface IPaginationProps {
  total: number
  defaultCurrent: number
  onChange?: (page: number) => void
}

function genRangeArr (start: number, end: number) {
  return new Array(end - start + 1).fill(0)
    .map((_, idx) => start + idx)
}

// function genPager (total: number, current: number) {
//   const midStart = current - 2
//   const midEnd = current + 2
//   const showLeftQuickPager = midStart > 2
//   const showRightQuickPager = midEnd < total - 1

//   if (showLeftQuickPager && showRightQuickPager) {
//     return [1, '...', ...genRangeArr(midStart, midEnd), '...', total]
//   } else if (showLeftQuickPager) {
//     return [1, '...', ...genRangeArr(midStart, total)]
//   } else if (showRightQuickPager) {
//     return [...genRangeArr(1, midEnd), '...', total]
//   } else {
//     return [...genRangeArr(1, total)]
//   }
// }

export default function Pagination ({
  total,
  defaultCurrent,
  onChange
}: IPaginationProps) {
  const ns = useNamespace('pagination')
  const [current, setCurrent] = useState(defaultCurrent)
  const centerPage = useMemo(
    () => genRangeArr(Math.max(2, current - 2), Math.min(total - 1, current + 2)),
    [current]
  )

  const handlePrev = () => {
    const newCurrent = Math.max(1, current - 1)
    setCurrent(newCurrent)
    onChange?.(newCurrent)
  }
  const handleNext = () => {
    const newCurrent = Math.max(total, current + 1)
    setCurrent(newCurrent)
    onChange?.(newCurrent)
  }

  const handlePageClick = (page: number) => {
    setCurrent(page)
    onChange?.(page)
  }

  const handleLeftQuickPageClick = () => {
    handlePageClick(Math.max(1, current - 5))
  }

  const handleRightQuickPageClick = () => {
    handlePageClick(Math.min(total, current + 5))
  }

  return (
    <ul className={ns.b()}>
      <li className={ns.e('item')} onClick={handlePrev}><SvgIcon><ArrowBack /></SvgIcon></li>
      <li className={useClassName(ns.e('item'), ns.is('active', current === 1))} key={1} onClick={handlePageClick.bind(null, 1)}>1</li>
      {current > 4 && <li className={ns.e('item')} key={'leftQuickPager'} onClick={handleLeftQuickPageClick}>...</li>}
      {
        centerPage.map((page, idx) => (
          <li
            className={useClassName(ns.e('item'), ns.is('active', current === page))}
            key={idx}
            onClick={handlePageClick.bind(null, page)}
          >
            {page}
          </li>
        ))
      }
      {current < total - 3 && <li className={ns.e('item')} key={'rightQuickPager'} onClick={handleRightQuickPageClick}>...</li>}
      <li className={useClassName(ns.e('item'), ns.is('active', current === total))} key={total} onClick={handlePageClick.bind(null, total)}>{total}</li>
      <li className={ns.e('item')} onClick={handleNext}><SvgIcon><ArrowForward /></SvgIcon></li>
    </ul>
  )
}
