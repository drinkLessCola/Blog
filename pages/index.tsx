import { articleAPI } from './api/article'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import type { NextPageWithLayout } from './_app'
import type { ReactElement } from 'react'
import HomeLayout from '@/layout/HomeLayout'
import InfiniteList from '@/components/InfiniteList'
import type { IArticleListInDate, IArticleListInDateItem } from '@/types/article'
import { useNamespace } from '@/hooks/useNamespace'
import DateBlock from '@/components/DateBlock'
import ArticleCard from '@/components/ArticleCard'

export interface articlePageProps {
  articleMonthData: Array<string | number>
  articleListInTimeOrder: IArticleListInDate
}

export const getServerSideProps: GetServerSideProps<articlePageProps> = async () => {
  try {
    const articleMonthData = await articleAPI.getArticleMonthData({ year: new Date().getFullYear() })
    const articleListInTimeOrder = await articleAPI.getArticleInTimeOrder({ pageSize: 99999, pageIdx: 1 })
    return {
      props: {
        articleMonthData,
        articleListInTimeOrder
      }
    }
  } catch (err) {
    console.log(err)
    const defaultArticleListInTimeOrder: IArticleListInDate = {
      total: 0,
      list: []
    }
    return {
      props: {
        articleMonthData: new Array(12).fill('-'),
        articleListInTimeOrder: defaultArticleListInTimeOrder
      }
    }
  }
}

const HomePageNote: NextPageWithLayout<
InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ articleListInTimeOrder: { list, total }, articleMonthData }) => {
  const ns = useNamespace('articleList')

  const listItemRender = ({ date, articles }: IArticleListInDateItem) => (
    <section className={ns.b('block')} key={date}>
      <DateBlock dateStr={date}></DateBlock>
      <div className={ns.be('block', 'list')}>
        {
          articles.map(article => (
            <ArticleCard {...article} key={article.articleId}></ArticleCard>
          ))
        }
      </div>
    </section>
  )
  const itemHeight = 96.4
  const heights = list.map(item => item.articles.length * itemHeight)
  return (
    <>
      <h1>时间轴</h1>
      <InfiniteList
        itemRender={listItemRender}
        total={total}
        data={list}
        bufferCount={0}
        heights={heights}
        itemKey='date'
      />
      {/* <Scrollbar fitParent>
        <ArticleList></ArticleList>
      </Scrollbar> */}
    </>
  )
}

HomePageNote.getLayout = (page: ReactElement) => (
  <HomeLayout>
    {page}
  </HomeLayout>
)

export default HomePageNote
// const Home: NextPage<HomePageProps> = ({ articleMonthData }) => {
//   console.log('Home render')
//   const ns = useNamespace('homeLayout')

//   // const handleScrollTopChange = useCallback((scrollTop: number) => {
//   //   if (scrollTop) updateTop(false)
//   //   else updateTop(true)
//   // }, [])

//   return (
//   // <ScrollHandlerContext.Provider value={useForwardContext(ScrollHandlerContext, handleScrollTopChange)}>
//       <Layout className={ns.b()}>
//         <Scrollbar fitParent>
//           <FullPage>
//             <Page1></Page1>
//             <Page2 articleMonthData={articleMonthData}></Page2>
//             <footer className={ns.b('footer')} data-fullpage>
//               <div className={ns.be('footer', 'beian')}>
//                 <p>粤 ICP 备 2022111775 号</p>
//               </div>
//             </footer>
//           </FullPage>
//         </Scrollbar>
//       </Layout>
//   // </ScrollHandlerContext.Provider>
//   )
// }
