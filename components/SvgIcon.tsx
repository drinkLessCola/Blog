import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'
import { type PropsWithChildren } from 'react'

// const importAll = (requireContext: __WebpackModuleApi.RequireContext) => {
//   return requireContext.keys().forEach(requireContext)
// }

// try{
//   importAll(require.context('@/public/icons', true, /\.svg$/));
// }catch (error) {
//   console.log(error)
// }

interface ISvgIconProp {
  size?: string
  rotate?: boolean
}

export default function SvgIcon ({ children, rotate = false, size = '1em' }: PropsWithChildren<ISvgIconProp>) {
  // const iconName = capitalize(icon)

  const ns = useNamespace('icon')
  return (
    <i className={useClassName(ns.b(), ns.is('rotate', rotate))} style={{ width: size, height: size }}>
      {children}
    </i>
  )
}
