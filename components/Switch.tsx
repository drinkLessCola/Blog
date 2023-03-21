import LayoutContext from 'context/LayoutContext'
import { useContext } from 'react'
import SvgIcon from './SvgIcon'
import Menu from '@/public/icons/menu.svg'
import type { INamespace } from '@/hooks/useNamespace'

interface ISwitchProps {
  ns: INamespace
}
export default function Switch ({ ns }: ISwitchProps) {
  const { toggleSidebar } = useContext(LayoutContext)
  return (
    <div className={ns.b('switch')}>
      <button onClick={toggleSidebar} className={ns.be('switch', 'item')} name="收起/展开菜单">
        <SvgIcon><Menu /></SvgIcon>
      </button>
    </div>

  )
}
