// import NextcloudClient from "nextcloud-link";

// // 创建一个数据库来获取这个信息！！！！or 不公开这个信息
// const client = new NextcloudClient({
//   url: 'http://summerblink.site:8090',
//   password: 'JayChou0118',
//   username: 'zirina',
// })

// async function connectToServer() {
//   while(true) {
//     if(await client.checkConnectivity()) return;

//     await new Promise(resolve => setTimeout(resolve, 5000))
//   }
// }

// const ROOT_HREF= '/remote.php/dav/files/zirina/java-script-learning-notes'
// const ARTICLES_ROOT_DIR = '/java-script-learning-notes'

// const resolvePath = (...path: string[]) => {
//   return path.join('/')
// }

// interface Articles {
//   title: string,
//   href: string,
//   dir: string,
//   children: Articles[] | null,
//   isDirectory: boolean,
// }

// export async function getArticles (dir: string) {
//   try {
//     const articlesRaw = await client.getFolderFileDetails(dir)
//     const articlesInfo = []
//     for(const item of articlesRaw) {
//       const { name, isDirectory, href } = item
//       const fileDir = resolvePath(dir, name)
//       const children = isDirectory 
//         ? await getArticles(fileDir)
//         : null

//       const info: Articles = { 
//         title: name, 
//         isDirectory, 
//         href,
//         dir: fileDir.replace('.md', '').replace(`${ARTICLES_ROOT_DIR}/`, ''),
//         children,
//       }
//       articlesInfo.push(info)
//     }
//     return articlesInfo
//   } catch(err) {
//     console.log(err)
//     return [] as Articles[]
//   }
// }

// const articleSlug = (data: Articles[]) => {
//   const res: string[][] = []
//   data.forEach(item => {
//     const slug = item.dir.split('/')
//     res.push(slug)
//     if(item.children) res.push(...articleSlug(item.children))
//   })
//   return res
// }

// export const getArticleSlug = async () => {
//   const articles = await getArticles(ARTICLES_ROOT_DIR)
//   return articleSlug(articles)
// } 