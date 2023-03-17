import { type IArticleInfo, type IArticleMenuItem } from '@/types/article'
import createAxiosInstance, { type APISchema } from '.'
import { BASE_URL } from '@/config'

interface ArticleSchema extends APISchema {
  getArticle: {
    request: {
      articleId: string
    }
    response: {
      articleId: string
      title: string
      content: string
    }
  }

  getArticleSlug: {
    request: never
    response: Array<{
      slug: string[]
      articleId: string
    }>
  }

  getArticleMenu: {
    request: never
    response: IArticleMenuItem[]
  }

  getArticleByPath: {
    request: {
      path: string
    }
    response: {
      articleId: string
      title: string
      lastModified: Date
    } & (
      { isMenu: true, detail: IArticleInfo[] }
      | { isMenu: false, detail: string }
    )
  }
}

export const articleAPI = createAxiosInstance<ArticleSchema>({
  baseURL: `${BASE_URL}/article`,
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
  errorHandler: async (error) => {
    await Promise.reject(new Error(`${error.message}:服务器异常，请联系管理员！`))
  }
})

export const articleProxyAPI = createAxiosInstance<Pick<ArticleSchema, 'getArticleMenu'>>({
  baseURL: '/api/article',
  headers: {

  },
  apis: {
    getArticleMenu: 'GET /menu'
    // getCache: () => {
    //   const res = JSON.parse(window.localStorage.getItem('cache') || 'null')
    //   return Promise.resolve(res)
    // }
  },
  errorHandler: async (error) => {
    await Promise.reject(new Error(`${error.message}:服务器异常，请联系管理员！`))
  }
})
