import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, Method } from 'axios'

// const axiosInstance = axios.create({
//   baseURL:
//   Headers: {
//     // get: {
//     //   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
//     // },
//     // post: {
//     //   'Content-Type': 'application/json;charset=utf-8'
//     // }
//   },

//   transformRequest: [
//     function(data) {
//       data = JSON.stringify(data)
//       return data
//     }
//   ],

//   transformResponse: [
//     function(data) {
//       if(typeof data === 'string' && data.startsWith('{')) {
//         data = JSON.parse(data)
//       }
//       return data
//     }
//   ]
// })


type RequestPath = string
interface RequestOptions {
  path: string
  method: Method
  headers?: AxiosRequestHeaders
}
type RequestFunction<P = Record<string, any>, R = any> = (
  params?: P,
  ...args: any[]
) => Promise<R>

type APIConfig = RequestPath | RequestOptions | RequestFunction

type HeaderHandler = (config?: AxiosRequestConfig) => Promise<AxiosRequestHeaders>
type RequestErrorHandler = (error: AxiosError) => Promise<void>

export interface CreateRequestConfig<T extends APISchema> {
  baseURL: string
  headers?: AxiosRequestHeaders
  apis: {
    [K in keyof T]: APIConfig
  }
  headerHandlers?: HeaderHandler[]
  errorHandler?: RequestErrorHandler
}

export type APISchema = Record<string, {
  request?: Record<string, any>
  response?: Record<string, any> | any
}>

export type CreateRequestClient<T extends APISchema> = {
  [K in keyof T]: RequestFunction<T[K]['request'], T[K]['response']>
}

const METHOD_PATTERN = /^(GET|POST|PUT|DELETE|HEAD|OPTIONS|CONNECT|TRACE|PATCH)\s+/
const METHODS_USE_DATA = ['POST', 'PUT', 'PATCH', 'DELETE']
const PATH_PARAMS_PATTERN = /:(\w+)/g


function attachAPI<T extends APISchema> (
  axios: AxiosInstance,
  apis: CreateRequestConfig<T>['apis']
): CreateRequestClient<T> {
  const hostApi: CreateRequestClient<T> = Object.create(null)
  for (const apiName in apis) {
    const apiConfig = apis[apiName]
    let apiPath = apiConfig as RequestPath
    let apiOptions = {}
    if (typeof apiConfig === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      hostApi[apiName] = apiConfig as RequestFunction<T[Extract<keyof T, string>]['request'], T[Extract<keyof T, string>]['response']>
      continue
    } else if (typeof apiConfig === 'object') {
      const { path, ...rest } = apiConfig
      apiPath = path
      apiOptions = rest
    }

    hostApi[apiName] = async (params, options) => {
      const _params = { ...(params ?? {}) }
      const [prefix, method] = apiPath.match(METHOD_PATTERN) ?? ['GET', 'GET']
      let url = apiPath.replace(prefix, '')
      const matchParams = url.match(PATH_PARAMS_PATTERN)
      if (matchParams) {
        matchParams.forEach(match => {
          const key = match.replace(':', '')
          if (Reflect.has(_params, key)) {
            url = url.replace(match, Reflect.get(_params, key))
            Reflect.deleteProperty(_params, key)
          }
        })
      }

      const requestParams = METHODS_USE_DATA.includes(method)
        ? { data: _params }
        : { params: _params }

      console.log('url', url)
      return await axios.request({
        url: encodeURI(url),
        method: method.toLowerCase() as Method,
        ...requestParams, // data / params
        ...apiOptions, // method / header
        ...options // 传入的额外配置
      })
    }
  }
  return hostApi
}

export function createAxiosInstance<T extends APISchema> (requestConfig: CreateRequestConfig<T>): CreateRequestClient<T> {
  const { baseURL, headers, apis, headerHandlers: _headerHandlers, errorHandler } = requestConfig

  console.log('baseURL', baseURL)
  const axiosInstance = axios.create({
    baseURL,
    headers
  })

  axiosInstance.interceptors.request.use(async config => {
    const headerHandlers = (_headerHandlers ?? []).map(async handler => {
      const mixHeaders = await handler(config)
      return Object.assign(config.headers ?? {}, mixHeaders)
    })
    await Promise.all(headerHandlers)
    return config
  })

  axiosInstance.interceptors.response.use(
    (res: AxiosResponse<{
      code: number
      msg: string
      data: any
    }>) => {
      const { msg, code, data } = res.data
      console.log(msg, code, data)
      // TODO message
      return data
    },
    (error: AxiosError) => {
      const requestError = errorHandler
        ? errorHandler(error)
        : error
      return requestError
    }
  )

  return attachAPI<T>(axiosInstance, apis)
}

export default createAxiosInstance
