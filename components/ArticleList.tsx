import { useNamespace } from '@/hooks/useNamespace'
import type { IArticleListInDate } from '@/types/article'
import DateBlock from './DateBlock'
import ArticleCard from './ArticleCard'
import Pagination from './Pagenation'
import { useEffect, useState } from 'react'
import { articleAPI } from '@/pages/api/article'
import Loading from './Loading'

export default function ArticleList () {
  const ns = useNamespace('articleList')
  const [articleList, setArticleList] = useState<IArticleListInDate[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handlePageChange = (page: number) => {
    setIsLoading(true)
    articleAPI.getArticleInTimeOrder({ pageSize: 10, pageIdx: page })
      .then(setArticleList)
      .catch(console.error)
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    handlePageChange(1)
  }, [])

  return (
    <div className={ns.b()}>
        {
          articleList.map(({ date, articles }) => (
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
          ))
        }
        <Loading isLoading={isLoading}></Loading>
      <Pagination total={10} defaultCurrent={1} onChange={handlePageChange}></Pagination>
    </div>
  )
}
