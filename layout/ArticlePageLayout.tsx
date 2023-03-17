import Layout from '@/components/Layout'
import { type IArticleMenuItem } from '@/types/article'
import React, { type PropsWithChildren, useCallback, useEffect, useReducer, useState } from 'react'
import { MenuContext } from '@/context/MenuContext'
import { articleProxyAPI } from '../pages/api/article'
import { type IMenuItem } from '@/components/Menu'
import Folder from '@/public/icons/folder.svg'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Main from '@/components/Main'
import LayoutContext from '@/context/LayoutContext'
import { useNamespace } from '@/hooks/useNamespace'

const reducer = (state: any, action: any) => {
  console.log('?', state, action)

  switch (action.type) {
    case 'toggleSidebar':
      return { ...state, sidebarOpen: !state.sidebarOpen }
  }
}

export default function ArticlePageLayout ({ children }: PropsWithChildren) {
  const ns = useNamespace('layout')
  const [menu, updateMenu] = useState([] as IMenuItem[])
  const [layoutState, dispatch] = useReducer(reducer, {
    sidebarOpen: true
  })
  const toggleSidebar = useCallback(() => {dispatch({ type: 'toggleSidebar' })}, [])
  // 处理 menu 数据，为目录添加文件图标
  const handleMenu = useCallback((rawMenu: IArticleMenuItem[]): IMenuItem[] => rawMenu.map((rawMenuItem) => {
    const { isMenu, children } = rawMenuItem
    return {
      ...rawMenuItem,
      children: isMenu ? handleMenu(children) : children,
      prefix: isMenu ? <Folder /> : undefined
    }
  }), [])

  useEffect(() => {
    articleProxyAPI.getArticleMenu()
      .then((rawMenu) => {
        const menu = handleMenu(rawMenu)
        console.log('getMenu', menu)
        updateMenu(menu)
      })
      .catch(console.error)
  }, [])

  return (
    <MenuContext.Provider value={{ menu }}>
      <LayoutContext.Provider value={{ layoutState, toggleSidebar }}>
        <Layout layoutClass={ns.is('wrap-sidebar', !layoutState.sidebarOpen)}>
          <Header />
          <Sidebar />
          <Main>{children}</Main>
        </Layout>
      </LayoutContext.Provider>
    </MenuContext.Provider>
  )
}
