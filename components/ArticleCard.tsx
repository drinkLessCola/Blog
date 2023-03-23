import { useNamespace } from '@/hooks/useNamespace'
import TagIcon from '@/public/icons/tag.svg'
import SvgIcon from './SvgIcon'
import type { IArticleListItem } from '@/types/article'
import Link from 'next/link'

export type IArticleCardProps = Pick<IArticleListItem, 'title' | 'path' | 'description' | 'tags'>
export default function ArticleCard ({ title, description, tags, path }: IArticleCardProps) {
  const ns = useNamespace('articleCard')
  return (
    <Link className={ns.b()} href={`/articles/${path}`}>
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
    </Link>
  )
}
