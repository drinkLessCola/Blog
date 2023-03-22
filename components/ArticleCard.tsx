import { useNamespace } from '@/hooks/useNamespace'
import TagIcon from '@/public/icons/tag.svg'
import SvgIcon from './SvgIcon'
import type { IArticleListItem } from '@/types/article'

export type IArticleCardProps = Pick<IArticleListItem, 'title' | 'path' | 'description' | 'tags'>
export default function ArticleCard ({ title, description, tags }: IArticleCardProps) {
  const ns = useNamespace('articleCard')
  return (
    <section className={ns.b()}>
      <h1 className={ns.e('title')}>{title}</h1>
      <p className={ns.e('description')}>{description}</p>
      <div className={ns.b('tag')}>
        <SvgIcon><TagIcon /></SvgIcon>
        <ul className={ns.be('tag', 'list')}>
          {
            tags.map(tag => (
              <li className={ns.be('tag', 'item')} key={tag}>{tag}</li>
            ))
          }
        </ul>
      </div>
    </section>
  )
}
