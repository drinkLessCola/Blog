import { useNamespace } from '@/hooks/useNamespace'

export interface IArticleProps {
  html: string
}

export default function Article ({ html }: IArticleProps) {
  const ns = useNamespace('article')
  console.log('Article', html)
  return (
    <article className={ns.b()} dangerouslySetInnerHTML={{ __html: html }}/>
  )
}
