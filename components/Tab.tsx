import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'

export default function Tab () {
  const ns = useNamespace('tab')

  return (
    <ul className={ns.b()}>
      <li className={useClassName(ns.e('item'), ns.is('active', true))}>时间轴</li>
      <li className={ns.e('item')}>归档</li>
    </ul>
  )
}
