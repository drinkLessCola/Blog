import { useClassName } from '@/hooks/useClassName'
import Menu from './Menu'
import { useNamespace } from '@/hooks/useNamespace'
import { MenuContext } from '@/context/MenuContext'
import { HorizontalContext } from '@/context/HorizontalContext'
import Scrollbar from './Scrollbar'
import { useContext, useEffect, useRef, useState } from 'react'
import LayoutContext from '@/context/LayoutContext'
import { useRouter } from 'next/router'

export default function Sidebar () {
  console.log('Sidebar render')
  const [isMobile, updateIsMobile] = useState(false)
  const ns = useNamespace('sidebar')
  const { menu } = useContext(MenuContext)
  const navRef = useRef<HTMLElement>(null)
  const { layoutState: { sidebarOpen }, closeSidebar, openSidebar } = useContext(LayoutContext)

  const { asPath } = useRouter()
  useEffect(() => {
    const mediaQueryList = window.matchMedia('(max-width: 1024px)')
    function handleWidthChange (mql: MediaQueryListEvent | MediaQueryList) {
      // width < 1024px
      if (mql.matches) closeSidebar()
      else openSidebar()
      updateIsMobile(mql.matches)
    }
    handleWidthChange(mediaQueryList)
    mediaQueryList.addEventListener('change', handleWidthChange)
    return () => {
      mediaQueryList.removeEventListener('change', handleWidthChange)
    }
  }, [asPath])

  useEffect(() => {
    console.log('isMobile', isMobile)
    if (!isMobile) return
    const handleClick = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as HTMLElement) && sidebarOpen) {
        closeSidebar()
      }
    }
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [isMobile])

  return (
    <nav className={useClassName(ns.b(), ns.is('open', sidebarOpen))} ref={navRef}>
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

