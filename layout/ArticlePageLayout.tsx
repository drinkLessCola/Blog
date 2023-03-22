import Layout from '@/components/Layout'
import { type IArticleMenuItem } from '@/types/article'
import React, { type PropsWithChildren, useCallback, useEffect, useReducer, useState } from 'react'
import { MenuContext } from '@/context/MenuContext'
import { articleAPI } from '../pages/api/article'
import { type IMenuItem } from '@/components/Menu'
import Folder from '@/public/icons/folder.svg'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Main from '@/components/Main'
import LayoutContext from '@/context/LayoutContext'
import { useNamespace } from '@/hooks/useNamespace'
import { useClassName } from '@/hooks/useClassName'
import MenuSwitch from '@/components/Switch'
import LazyLoad from '@/components/LazyLoad'
import { useRouter } from 'next/router'
import { ArticleContext } from '@/context/ArticleContext'

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'toggleSidebar':
      return { ...state, sidebarOpen: !state.sidebarOpen }
    case 'closeSidebar':
      return { ...state, sidebarOpen: false }
    case 'openSidebar':
      return { ...state, sidebarOpen: true }
  }
}

export default function ArticlePageLayout ({ children }: PropsWithChildren) {
  console.log('Layout render')
  const ns = useNamespace('articleLayout')
  const [menu, updateMenu] = useState([] as IMenuItem[])
  const [layoutState, dispatch] = useReducer(reducer, {
    sidebarOpen: true
  })

  const toggleSidebar = useCallback(() => {dispatch({ type: 'toggleSidebar' })}, [])
  const closeSidebar = useCallback(() => {dispatch({ type: 'closeSidebar' })}, [])
  const openSidebar = useCallback(() => {dispatch({ type: 'openSidebar' })}, [])
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
    articleAPI.getArticleMenu()
      .then((rawMenu) => {
        const menu = handleMenu(rawMenu)
        console.log('getMenu', menu)
        updateMenu(menu)
      })
      .catch(console.error)
  }, [])

  const { asPath } = useRouter()
  const currentLink = decodeURI(asPath).replace('/articles/', '')

  return (
    <MenuContext.Provider value={{ menu }}>
      <LayoutContext.Provider value={{ layoutState, toggleSidebar, closeSidebar, openSidebar }}>
        <ArticleContext.Provider value={{ currentLink }}>
          <Layout className={useClassName(ns.b(), ns.is('wrap-sidebar', !layoutState.sidebarOpen))}>
            <Header />
            <Sidebar />
            <Main className={ns.e('main')}>
              <LazyLoad>
                {children}
              </LazyLoad>
              <MenuSwitch ns={ns}></MenuSwitch>
              <div style={{ gridArea: 'footer', height: '50px', backgroundColor: 'red' }}></div>
            </Main>

          </Layout>
        </ArticleContext.Provider>
      </LayoutContext.Provider>
    </MenuContext.Provider>
  )
}
