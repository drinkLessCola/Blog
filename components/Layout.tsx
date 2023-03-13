import { PropsWithChildren, useCallback, useReducer, useRef, useState } from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Main from "./Main";
import LayoutContext from "@/context/LayoutContext";
import { useClassName } from "@/hooks/useClassName";
import { useNamespace } from "@/hooks/useNamespace";
import Header from "./Header";

// 组件中不能访问 Node.js 代码
// 否则会报错- node:fs
// Module build failed: UnhandledSchemeError: Reading from "node:fs" is not handled by plugins (Unhandled scheme).
// Webpack supports "data:" and "file:" URIs by default.
// You may need an additional plugin to handle "node:" URIs.
// Import trace for requested module:

// interface LayoutProps {
//   title: string, 
// }
const reducer = (state: any, action: any) => {
  console.log('?', state, action)
  switch(action.type) {
    case 'toggleSidebar': return { ...state, sidebarOpen: !state.sidebarOpen }
  }
}

export default function Layout ({ children }: PropsWithChildren) {

  // const mainRef = useRef<HTMLElement>(null)
  // console.log('Layout mainRef', mainRef)

  // useEffect(() => {
  //   console.log('useEffect mainRef', mainRef)
  //   console.log(mainRef.current)
  // }, [mainRef.current])
  const ns = useNamespace('layout')
  const [layoutState, dispatch] = useReducer(reducer, {
    sidebarOpen: true,
  })
  const toggleSidebar = useCallback(() => dispatch({ type: 'toggleSidebar' }), [])
  
  return (
    <div className={useClassName(ns.b(), ns.is('wrap-sidebar', !layoutState.sidebarOpen))}>
      <Header />
      <LayoutContext.Provider value={{ layoutState, toggleSidebar }}>
        <Sidebar />
        <Main>{children}</Main>
      </LayoutContext.Provider>
      <Footer />
    </div>
  )
}