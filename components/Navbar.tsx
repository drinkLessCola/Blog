import Link from "next/link"
import { useRouter } from "next/router"
import Menu from "./Menu"
import { IMenuItem } from "@/types/article"
import { useNamespace } from "@/hooks/useNamespace"
import SvgIcon from "./SvgIcon"
import Home from '@/public/icons/home.svg'
import Info from '@/public/icons/info.svg'

const menu = [
  { 
    title: (
      <>
        <SvgIcon><Home/></SvgIcon>
        Home
      </>
    ), 
    path: "/" 
  },
  { 
    title: (
      <>
        <SvgIcon><Info/></SvgIcon>
        About
      </>
    ), 
    path: "/about"
  },
] as unknown as IMenuItem[]

export default function Navbar() {
  const router = useRouter()
  const currentPage = router.pathname
  // console.log(router)
  const ns = useNamespace('navbar')
  return (
    <nav className={ns.b()}>
      <Menu menu={menu} isHorizontal></Menu>
    </nav>
  )
}