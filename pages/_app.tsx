import '@/styles/index.scss'
import 'highlight.js/styles/lioshi.css'
import { type NextPage } from 'next'
// import 'highlight.js/styles/a11y-dark.css';
// import 'highlight.js/styles/a11y-light.css';
// import 'highlight.js/styles/atom-one-dark-reasonable.css';
// import 'highlight.js/styles/atom-one-light.css';
// import 'highlight.js/styles/dark.css';
// import 'highlight.js/styles/docco.css';
// import 'highlight.js/styles/github-dark-dimmed.css';
// import 'highlight.js/styles/github.css';


import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App ({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(<Component {...pageProps} />)
}
