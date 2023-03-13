// import { getArticleSlug, getArticleProps, getMenu, parseMarkdownFile } from "@/libs/posts-md";
import { GetStaticProps } from "next";

import Head from "next/head";
import { ParsedUrlQuery } from "node:querystring";
import { IArticleInfo } from "@/types/article";
import React, { ReactElement } from "react";
import { articleAPI } from "../api/article";
import { parseMarkdownFile } from "@/libs/posts-md";
import { getLinkFromSlug } from "@/utils/slug";
import Article from "@/components/Article";
import { ArticleContext } from "@/context/ArticleContext";
import { NextPageWithLayout } from "../_app";
import ArticlePageLayout from "../layout/ArticlePageLayout";

function genMenuHTML(menu: IArticleInfo[]) {
  return `<ul>${menu.map(({ title }) => `<li>${ title }</li>`)}</ul>`
}

export async function getStaticPaths() {
  console.log('getStaticPaths')
  const data = await articleAPI.getArticleSlug()
  const paths = data.map(({ articleId, slug }) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

interface IParams extends ParsedUrlQuery {
  slug: string[],
  id: string,
}
/**
 * SSG 获取数据
 * @param param0 
 * @returns 
 */
export const getStaticProps:GetStaticProps = async ({ params }) =>  {
  console.log('getStaticProps')
  const { slug } = (params as IParams)
  const path = getLinkFromSlug(slug)
  const data = await articleAPI.getArticleByPath({
    path
  })
  
  const { isMenu, title = '', detail, lastModified, articleId } = data

  console.log('getStaticProps return')
  console.log('path', path)
  return {
    props: {
      articleData: {
        html: isMenu 
          ? genMenuHTML(detail)
          : parseMarkdownFile(detail),
        title,
        lastModified
      },
      link: path
    }
  }
}

interface ArticlePageData {
  title: string,
  html: string,
  lastModified: Date
}

interface ArticlePageProps {
  articleData: ArticlePageData,
  link: string,
}

const ArticlePage: NextPageWithLayout<ArticlePageProps> = ({ articleData, link }) => {
  console.log('ArticlePage')
  const { title, html: articleHtml, lastModified } = articleData
  const html = `
    <h1>${title}</h1>
    <p><time>${lastModified}</time></p>
    ${articleHtml}
  `
  return (
    <ArticleContext.Provider value={{ currentLink: link }}>
      {/* 正文部分 */}
      <Head>
        <title>{title}</title>
      </Head>
      <Article html={html}></Article>
    </ArticleContext.Provider>
  )
}

ArticlePage.getLayout = (page: ReactElement) => {
  return(
    <ArticlePageLayout>
      {page}
    </ArticlePageLayout>
  )
}

export default ArticlePage