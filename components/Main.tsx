import { type PropsWithChildren, useContext } from 'react'
import Scrollbar from './Scrollbar'
import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'
import { ArticleContext } from '@/context/ArticleContext'
import MenuSwitch from './Switch'

export default function Main ({ children }: PropsWithChildren) {
  const ns = useNamespace('main')
  const { currentLink: link } = useContext(ArticleContext)
  const recordKey = `@scroll|${link}`

  return (
    <main className={useClassName(ns.b())}>
      <Scrollbar fitParent recordKey={recordKey}>
        {children}
      </Scrollbar>
      <MenuSwitch></MenuSwitch>
    </main>
  )
}
