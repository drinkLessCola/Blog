import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'
import SvgIcon from './SvgIcon'
import ArrowBack from '@/public/icons/arrowBack.svg'
import ArrowForward from '@/public/icons/arrowForward.svg'
export interface IPaginationProps {
  total: number
  current: number
}
export default function Pagination ({ total, current }: IPaginationProps) {
  const ns = useNamespace('pagination')

  return (
    <ul className={ns.b()}>
      <li className={ns.e('item')}><SvgIcon><ArrowBack /></SvgIcon></li>
      {
        new Array(total).fill(0)
          .map((_, idx) => (
            <li className={useClassName(ns.e('item'), ns.is('active', current === idx + 1))} key={idx + 1}>{idx + 1}</li>
          ))
      }
      <li className={ns.e('item')}><SvgIcon><ArrowForward /></SvgIcon></li>
    </ul>
  )
}
