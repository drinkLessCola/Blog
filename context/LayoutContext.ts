import { noop } from '@/utils/function'
import { createContext } from 'react'

const LayoutContext = createContext({
  layoutState: { sidebarOpen: true },
  toggleSidebar: noop,
  openSidebar: noop,
  closeSidebar: noop
})

export default LayoutContext
