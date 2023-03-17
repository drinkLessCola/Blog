import { useNamespace } from '@/hooks/useNamespace'

export default function Footer () {
  const ns = useNamespace('footer')
  return (
    <footer className={ns.b()}>
      footer
    </footer>
  )
}
