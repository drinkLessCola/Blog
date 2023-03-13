import LayoutContext from "@/context/LayoutContext"
import { useContext } from "react"
import SvgIcon from "./SvgIcon"
import Menu from "@/public/icons/menu.svg"
import { useNamespace } from "@/hooks/useNamespace"

export default function Switch() {
  const { toggleSidebar } = useContext(LayoutContext)
  const ns = useNamespace('switch')
  return (
    <div className={ns.b()}>
      <button onClick={toggleSidebar} className={ns.e('item')} name="收起/展开菜单">
        <SvgIcon><Menu /></SvgIcon>
      </button>
    </div>
    
  )
}