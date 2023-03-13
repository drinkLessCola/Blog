import { createContext } from "react";

const LayoutContext = createContext({
  layoutState: { sidebarOpen: true },
  toggleSidebar: () => {}
})

export default LayoutContext