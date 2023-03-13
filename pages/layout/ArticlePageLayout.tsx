import Layout from "@/components/Layout";
import { IMenuItem } from "@/types/article";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { MenuContext } from "@/context/MenuContext";
import { articleProxyAPI } from "../api/article";

export default function ArticlePageLayout({ children }: PropsWithChildren) {
  const [menu, updateMenu] = useState([] as IMenuItem[])
  console.log('?ArticlePageLayout')
  useEffect(() => {
    articleProxyAPI.getArticleMenu()
      .then(menu => {
        console.log('getMenu', menu)
        updateMenu(menu)
      })
      .catch(console.error)
  }, [])

  return (
    <MenuContext.Provider value={{ menu }}>
      <Layout>
        { children }
      </Layout>
    </MenuContext.Provider>
  )
}