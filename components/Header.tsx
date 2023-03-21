import Link from 'next/link'
import Navbar from './Navbar'
import DrinkLessCola from '@/public/icons/DrinkLessCola.svg'
import { useNamespace } from '@/hooks/useNamespace'
import Switch from './Switch'

export default function Header () {
  const ns = useNamespace('header')
  return (
    <header className={ns.b()}>
      <div className={ns.b('title')}>
        <Switch ns={ns}></Switch>
        <Link href="/">
          <DrinkLessCola></DrinkLessCola>
          {/* <img id="drinkLessCola" src="/drinkLessCola@2x.png"></img> */}
          {/* <img id="drinkLessCola" src="https://summerblink.site/nextcloud/s/nKRngSDoPNLy7wX/preview"></img> */}
        </Link>
      </div>
      <Navbar />
    </header>
  )
}
