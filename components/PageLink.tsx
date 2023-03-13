import Link from "next/link"

interface PageLinkProp {
  title: string,
  articleDir: string,
  id: string,
}

export default function PageLink({ title, articleDir, id }: PageLinkProp) {
  const link = `/${articleDir}/${id}`

  return (
    <article>
      <h2>
        <Link href={link}>{title}</Link>
      </h2>
    </article>
  )
}