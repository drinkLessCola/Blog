import type { PropsWithChildren } from 'react'
import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'

// 组件中不能访问 Node.js 代码
// 否则会报错- node:fs
// Module build failed: UnhandledSchemeError: Reading from "node:fs" is not handled by plugins (Unhandled scheme).
// Webpack supports "data:" and "file:" URIs by default.
// You may need an additional plugin to handle "node:" URIs.
// Import trace for requested module:

interface LayoutProps {
  layoutClass?: string
}


export default function Layout ({ children, layoutClass }: PropsWithChildren<LayoutProps>) {
  // const mainRef = useRef<HTMLElement>(null)
  // console.log('Layout mainRef', mainRef)

  // useEffect(() => {
  //   console.log('useEffect mainRef', mainRef)
  //   console.log(mainRef.current)
  // }, [mainRef.current])
  const ns = useNamespace('layout')

  return (
    <div className={useClassName(ns.b(), layoutClass ?? '')}>
      {children}
    </div>
  )
}
