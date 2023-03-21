import type { PropsWithChildren } from 'react'

// 组件中不能访问 Node.js 代码
// 否则会报错- node:fs
// Module build failed: UnhandledSchemeError: Reading from "node:fs" is not handled by plugins (Unhandled scheme).
// Webpack supports "data:" and "file:" URIs by default.
// You may need an additional plugin to handle "node:" URIs.
// Import trace for requested module:

interface LayoutProps {
  className?: string
}


export default function Layout ({ children, className }: PropsWithChildren<LayoutProps>) {
  // const mainRef = useRef<HTMLElement>(null)
  // console.log('Layout mainRef', mainRef)

  // useEffect(() => {
  //   console.log('useEffect mainRef', mainRef)
  //   console.log(mainRef.current)
  // }, [mainRef.current])

  return (
    <div className={className ?? ''}>
      {children}
    </div>
  )
}
