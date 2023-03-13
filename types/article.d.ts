export interface IMenuItem {
  id: string,
  label: string,
  path: string,
  // parentId: string,
  // parentPath: string,
  children: IMenuItem[],
  isMenu: boolean,
  // lastModified: Date
}
export interface IArticleInfo {
  articleId: string
  title: string
  path: string
}

export interface IArticleProps {
  title: string,
  link: string,
  children: string[] | null
}