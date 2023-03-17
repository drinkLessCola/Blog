// import { useRouter } from 'next/router'
import Menu from './Menu'
import type { IMenuItem } from './Menu'
import { useNamespace } from '@/hooks/useNamespace'
import Home from '@/public/icons/home.svg'
import Info from '@/public/icons/info.svg'

const menu = [
  {
    prefix: <Home/>,
    label: 'Home',
    path: '/'
  },
  {
    prefix: <Info/>,
    label: 'About',
    path: '/about'
  }
] as unknown as IMenuItem[]

export default function Navbar () {
  // TODO
  // const router = useRouter()
  // const currentPage = router.pathname
  // console.log(router)
  const ns = useNamespace('navbar')
  return (
    <nav className={ns.b()}>
      <Menu menu={menu} isHorizontal></Menu>
    </nav>
  )
}
