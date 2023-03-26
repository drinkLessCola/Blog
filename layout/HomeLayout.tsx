import { MonthCalendar } from '@/components/Calendar'
import FullPage from '@/components/FullPage'
import Layout from '@/components/Layout'
import Menu from '@/components/Menu'
import type { IMenuItem } from '@/components/Menu'
import Scrollbar from '@/components/Scrollbar'
import SvgIcon from '@/components/SvgIcon'
import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'
import { articleAPI } from '@/pages/api/article'
import { useEffect, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import Draw from '@/public/icons/draw.svg'
import JSIcon from '@/public/icons/js.svg'
import GitHubIcon from '@/public/icons/github.svg'
import Setting from '@/public/icons/setting.svg'
import Image from 'next/image'

type IArticleMonthData = number[]
export default function Home ({ children }: PropsWithChildren) {
  console.log('Home render')
  const ns = useNamespace('homeLayout')
  // const handleScrollTopChange = useCallback((scrollTop: number) => {
  //   if (scrollTop) updateTop(false)
  //   else updateTop(true)
  // }, [])

  return (
  // <ScrollHandlerContext.Provider value={useForwardContext(ScrollHandlerContext, handleScrollTopChange)}>
      <Layout className={ns.b()}>
        <Image
          loading='eager'
          quality={100}
          className={ns.e('bg')}
          alt="background"
          src="/background-4.jpg"
          placeholder="blur"
          blurDataURL='/background-4@mini.jpg'
          fill
        ></Image>
        <Scrollbar fitParent>
          <FullPage>
            <Page1></Page1>
            <Page2>
              {children}
            </Page2>
            <footer className={ns.b('footer')} data-fullpage>
              <div className={ns.be('footer', 'beian')}>
                <p>粤 ICP 备 2022111775 号</p>
              </div>
            </footer>
          </FullPage>
        </Scrollbar>
      </Layout>
  // </ScrollHandlerContext.Provider>
  )
}


const Page1 = () => {
  const ns = useNamespace('homeLayoutHeader')
  return (
    <section className={useClassName(ns.b())} data-fullpage>
    <div className={ns.e('title')}>
      <h1>DrinkLessCola</h1>
      <p>a simple blog records front end learning note and life (maybe, I&lsquo;m lazy) </p>
    </div>
  </section>
  )
}

const Page2 = ({ children }: PropsWithChildren) => {
  const ns = useNamespace('homeLayout')
  const menu = [
    { label: '前端学习', path: '/note', prefix: <JSIcon /> },
    { label: '摸鱼涂鸦', path: '/draw', prefix: <Draw /> },
    { label: '博客管理', path: '/manage', prefix: <Setting /> }
  ] as unknown as IMenuItem[]

  const navViewRef = useRef<HTMLElement>(null)
  const handleWheel = (event: WheelEvent) => {
    event.stopPropagation()
  }

  const [calendarData, setCalendarData] = useState({
    year: new Date().getFullYear(),
    startYear: 2022,
    monthData: [] as IArticleMonthData
  })

  useEffect(() => {
    console.log('Home getMonthData')
    articleAPI.getArticleMonthData({ year: new Date().getFullYear() })
      .then(monthData => {
        setCalendarData(prevData => ({
          ...prevData,
          monthData
        }))
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    navViewRef.current?.addEventListener('wheel', handleWheel)
    return () => {
      navViewRef.current?.removeEventListener('wheel', handleWheel)
    }
  })

  const handleChangeYear = (year: number) => {
    articleAPI.getArticleMonthData({ year })
      .then(monthData => {
        setCalendarData(prevData => ({
          ...prevData,
          year,
          monthData
        }))
      })
      .catch(err => {
        console.error(err)
      })

  }

  return (
    <section className={useClassName(ns.b('main'))} data-fullpage >
      <nav className={ns.be('main', 'sidebar')}>
        {/* InfoCard */}
        <div className={useClassName(ns.b('info'), 'card')}>
          <div className={ns.be('info', 'avatar')}>
            <img src="/avatar.png"></img>
          </div>
          <div className={ns.be('info', 'username')}>DrinkLessCola</div>
          <section className={ns.be('info', 'nav')}>
            <Menu menu={menu}></Menu>
          </section>
          <a className={ns.be('info', 'button')} role="button" href="/">
            <SvgIcon><GitHubIcon /></SvgIcon>
            GitHub
          </a>
        </div>

        {/* Calendar */}
        <div className={useClassName(ns.b('calendar'), 'card')}>
          <MonthCalendar {...calendarData} onChangeYear={handleChangeYear}></MonthCalendar>
        </div>
      </nav>

      <main className={useClassName(ns.b('navView'), 'card')} ref={navViewRef}>
        {/* <ScrollHandlerContext.Provider value={useForwardContext(ScrollHandlerContext, handleScroll)}> */}
        {children}
        {/* </ScrollHandlerContext.Provider> */}

        {/*
            <ul className={ns.be('navView', 'nav')}>
              <li className="active">时间轴</li>
              <li>归档</li>
            </ul>
        */}
      </main>
    </section>
  )
}
