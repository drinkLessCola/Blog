export const getLinkFromSlug = (slug: string[] | string) => {
  if (typeof slug === 'string') return slug
  return slug.join('/')
}
