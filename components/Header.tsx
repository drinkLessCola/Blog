import Link from 'next/link'
import Navbar from './Navbar'
import DrinkLessCola from '@/public/icons/DrinkLessCola.svg'
import { useNamespace } from '@/hooks/useNamespace'

export default function Header () {
  const ns = useNamespace('header')
  return (
    <header className={ns.b()}>
      <Link href="/" className={ns.e('title')}>
        <DrinkLessCola></DrinkLessCola>
        {/* <img id="drinkLessCola" src="/drinkLessCola@2x.png"></img> */}
        {/* <img id="drinkLessCola" src="https://summerblink.site/nextcloud/s/nKRngSDoPNLy7wX/preview"></img> */}
      </Link>
      <Navbar />
    </header>
  )
}
