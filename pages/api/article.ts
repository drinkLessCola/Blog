import { IArticleInfo, IMenuItem } from "@/types/article";
import createAxiosInstance, { APISchema, CreateRequestClient, CreateRequestConfig } from "."

interface ArticleSchema extends APISchema {
  getArticle: {
    request: {
      articleId: string
    };
    response: {
      articleId: string
      title: string
      content: string
    }
  }

  getArticleSlug: {
    request: void
    response: Array<{
      slug: string[]
      articleId: string
    }>
  }

  getArticleMenu: {
    request: void
    response: Array<IMenuItem>
  }

  getArticleByPath: {
    request: {
      path: string
    },
    response: {
      articleId: string,
      title: string,
      lastModified: Date
    } & (
      { isMenu: true, detail: IArticleInfo[] } 
      | { isMenu: false, detail: string }
    )
  }
}

export const articleAPI = createAxiosInstance<ArticleSchema>({
  baseURL: 'http://localhost:3000/article',
  headers: {

  },
  apis: {
    getArticleMenu: 'GET /menu',
    getArticle: {
      method: 'GET',
      path: '/:articleId'
    },
    getArticleSlug: 'GET /slug',
    getArticleByPath: 'GET /:path'
    // getCache: () => {
    //   const res = JSON.parse(window.localStorage.getItem('cache') || 'null')
    //   return Promise.resolve(res)
    // }
  },
  errorHandler: (error) => {
    return Promise.reject('服务器异常，请联系管理员！')
  },
})

export const articleProxyAPI = createAxiosInstance<Pick<ArticleSchema, 'getArticleMenu'>>({
  baseURL: '/api/article',
  headers: {

  },
  apis: {
    getArticleMenu: 'GET /menu',
    // getCache: () => {
    //   const res = JSON.parse(window.localStorage.getItem('cache') || 'null')
    //   return Promise.resolve(res)
    // }
  },
  errorHandler: (error) => {
    return Promise.reject('服务器异常，请联系管理员！')
  },
})