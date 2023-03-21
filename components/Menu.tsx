import Link from 'next/link'
import { type ReactElement, useContext, useState } from 'react'
import SvgIcon from './SvgIcon'
import ArrowDown from '@/public/icons/arrowDown.svg'
import { useNamespace } from '@/hooks/useNamespace'
import type { IArticleMenuItem } from '@/types/article'
import { useClassName } from '@/hooks/useClassName'
import { HorizontalContext } from '@/context/HorizontalContext'
import { ArticleContext } from '@/context/ArticleContext'

const padding = 20

export interface IMenuItem extends IArticleMenuItem {
  prefix?: ReactElement
}

interface MenuProps {
  menu: IMenuItem[]
  level?: number
  isHorizontal?: boolean
  isWrap?: boolean
}
export default function Menu ({ menu, level = 1, isWrap = false, isHorizontal: horizontal = false }: MenuProps) {
  const ns = useNamespace('menu')
  const isHorizontal = horizontal ?? useContext(HorizontalContext)

  if (!menu) return <></>
  return (
    <ul
      className={useClassName(
        ns.b(),
        ns.is('horizontal', isHorizontal),
        ns.is('wrap', isWrap)
      )}
    >
      {
        menu.map(({ label, path, children = [], isMenu = false, prefix }) => (
            <MenuItem
              label={label}
              link={path}
              key={`${path}-${isMenu ? 'menu' : ''}`}
              isMenu={isMenu}
              level={level}
              subMenu={children}
              prefix={prefix}
            ></MenuItem>
        ))
      }
    </ul>
  )
}

interface MenuItemProp {
  label: string
  link: string
  isMenu: boolean
  level: number
  prefix?: ReactElement
  subMenu: IMenuItem[]
}


export function MenuItem ({
  label,
  link,
  isMenu,
  level,
  subMenu,
  prefix
}: MenuItemProp) {
  const ns = useNamespace('menuItem')
  const { currentLink } = useContext(ArticleContext)
  const [childHidden, toggleChildHidden] = useState(true)
  const toggle = () => {
    toggleChildHidden(!childHidden)
  }

  return (
    <li>
      <div
        className={useClassName(ns.b(), ns.is('active', currentLink === link))}
        style={{ paddingLeft: level * padding }}
      >
        {
          link
            ? (<Link href={link}>
                <span className={ns.e('prefix')}>
                  <SvgIcon>{prefix}</SvgIcon>
                </span>
                <span className={ns.e('label')}>{label}</span>
              </Link>)
            : (<>
                <span className={ns.e('prefix')}>
                  <SvgIcon>{prefix}</SvgIcon>
                </span>
                <span className={ns.e('label')}>{label}</span>
              </>)
        }
        <span className={ns.e('suffix')} onClick={toggle}>
          {isMenu && <SvgIcon rotate={childHidden}><ArrowDown/></SvgIcon>}
        </span>
      </div>


      {isMenu && (
        <>
          <Menu
            menu={subMenu}
            level={level + 1}
            isWrap={childHidden}
          ></Menu>
          <hr className={ns.e('seperator')} />
        </>
      )}
    </li>
  )
}
