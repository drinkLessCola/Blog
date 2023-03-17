import { useClassName } from '@/hooks/useClassName'
import Menu from './Menu'
import { useNamespace } from '@/hooks/useNamespace'
import { MenuContext } from '@/context/MenuContext'
import { HorizontalContext } from '@/context/HorizontalContext'
import Scrollbar from './Scrollbar'
import { useContext } from 'react'
import LayoutContext from '@/context/LayoutContext'

export default function Sidebar () {
  const ns = useNamespace('sidebar')
  const { menu } = useContext(MenuContext)
  const { layoutState: { sidebarOpen } } = useContext(LayoutContext)

  console.log('sidebarOpen', sidebarOpen)
  return (
    <nav className={useClassName(ns.b(), ns.is('open', sidebarOpen))}>
      <div className={ns.e('label')} role="presentation">Menu</div>
      <div className={ns.e('menu-container')}>
        <Scrollbar fitParent>
          <HorizontalContext.Provider value={false}>
            <Menu menu={menu} />
          </HorizontalContext.Provider>
        </Scrollbar>
      </div>
    </nav>
  )
}
