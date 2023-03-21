// import { getArticleSlug, getArticleProps, getMenu, parseMarkdownFile } from "@/libs/posts-md";
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { type ParsedUrlQuery } from 'node:querystring'
import { type IArticleInfo } from '@/types/article'
import React, { type ReactElement } from 'react'
import { articleAPI } from '../api/article'
import { parseMarkdownFile } from '@/libs/posts-md'
import { getLinkFromSlug } from '@/utils/slug'
import Article from '@/components/Article'
import { type NextPageWithLayout } from '../_app'
import ArticlePageLayout from '../../layout/ArticlePageLayout'
import { formatDate } from '@/utils/date'

function genMenuHTML (menu: IArticleInfo[]) {
  return `<ul>${(menu.map(({ title }) => `<li>${title}</li>`).join(''))}</ul>`
}

// export async function getStaticPaths () {
//   console.log('getStaticPaths')
//   const data = await articleAPI.getArticleSlug()
//   const paths = data.map(({ articleId, slug }) => ({ params: { slug } }))

//   return {
//     paths,
//     fallback: false
//   }
// }

interface IParams extends ParsedUrlQuery {
  slug: string[]
  id: string
}

/**
 * SSG 获取数据
 * @param param0
 * @returns
 */
export const getServerSideProps: GetServerSideProps<ArticlePageProps> = async ({ params }) => {
  // console.log('getStaticProps')
  try {
    const { slug } = (params as IParams)
    const path = getLinkFromSlug(slug)
    const data = await articleAPI.getArticleByPath({
      path
    })

    const { isMenu, title = '', detail, lastModified } = data

    return {
      props: {
        html: isMenu
          ? genMenuHTML(detail)
          : parseMarkdownFile(detail),
        title,
        lastModified
      }
    }
  } catch (err) {
    return {
      notFound: true
    }
  }
}

interface ArticlePageProps {
  title: string
  html: string
  lastModified: Date
}

const ArticlePage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ title, html: articleHtml, lastModified }) => {
  console.log('ArticlePage render')
  const html = `
    <h1>${title}</h1>
    <p>更新日期：<time>${formatDate(lastModified)}</time></p>
    ${articleHtml}
  `
  return (
    <>
      {/* 正文部分 */}
      <Head>
        <title>{title}</title>
      </Head>
      <Article html={html}></Article>
    </>
  )
}

ArticlePage.getLayout = (page: ReactElement) => (
  <ArticlePageLayout>
    {page}
  </ArticlePageLayout>
)

export default ArticlePage
