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


export interface IArticleListItem {
  articleId: string
  title: string
  description: string
  path: string
  createDate: string
  tags: string[]
}

export interface IArticleListInDateItem {
  date: string
  articles: IArticleListItem[]
}

export interface IArticleListInDate {
  total: number
  list: IArticleListInDateItem[]
}
