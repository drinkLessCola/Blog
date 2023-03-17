export interface IArticleMenuItem {
  id: string
  label: string
  path: string
  children: IMenuItem[]
  isMenu: boolean
}

export interface IArticleInfo {
  articleId: string
  title: string
  path: string
}

export interface IArticleProps {
  title: string
  link: string
  children: string[] | null
}
