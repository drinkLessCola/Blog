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
import Image from '@/components/Image'
// import Image from 'next/image'

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
        {/* <Image
          loading='eager'
          quality={100}
          className={ns.e('pic')}
          alt="background"
          src="/background-dark.jpg"
          placeholder="blur"
          blurDataURL='/background-4@mini.jpg'
          fill
        ></Image> */}
        <Scrollbar fitParent>
          <FullPage>
            <Page1></Page1>
            <Page2>
              {children}
            </Page2>
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
      <header>
        <ul>
          <li>时间轴</li>
          <li>文章归档</li>
          <li>GitHub</li>
        </ul>
      </header>
      <div className={ns.e('pic')}>
        <Image
          alt="background"
          src="/background-3.jpg"
          thumb="/background@mini.jpg"
        ></Image>
      </div>
      <div className={ns.b('title')}>
        <h1 className={ns.be('title', 'name')}>DrinkLessCola</h1>
        <div className={ns.be('title', 'description')}>
          <span>👋 Welcome To My Blog!</span>
          <span>😊 会记录一些前端学习相关的笔记 & 尝试一些技术</span>
        </div>
      </div>
      <footer className={ns.e('beian')}>
        <a href='https://beian.miit.gov.cn/' target='_blank' rel="noreferrer">粤 ICP 备 2022111775 号</a>
      </footer>
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

  const navViewRef = useRef<HTMLDivElement>(null)
  const handleWheel = (event: WheelEvent) => {
    event.stopPropagation()
  }
  const handleTouch = (event: TouchEvent) => {
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
    navViewRef.current?.addEventListener('touchstart', handleTouch)
    navViewRef.current?.addEventListener('touchmove', handleTouch)
    navViewRef.current?.addEventListener('touchend', handleTouch)
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
            <SvgIcon size="1em"><GitHubIcon /></SvgIcon>
            <span className={ns.be('info', 'buttonLabel')}>GitHub</span>
          </a>
        </div>

        {/* Calendar */}
        <div className={useClassName(ns.b('calendar'), 'card')}>
          <MonthCalendar {...calendarData} onChangeYear={handleChangeYear}></MonthCalendar>
        </div>
      </nav>

      <main className={ns.be('main', 'navView')}>
        <div className={useClassName(ns.b('navView'), 'card')} ref={navViewRef}>
          {children}
        </div>
      </main>
        {/* <ScrollHandlerContext.Provider value={useForwardContext(ScrollHandlerContext, handleScroll)}> */}
        {/* </ScrollHandlerContext.Provider> */}

        {/*
            <ul className={ns.be('navView', 'nav')}>
              <li className="active">时间轴</li>
              <li>归档</li>
            </ul>
        */}
    </section>
  )
}
