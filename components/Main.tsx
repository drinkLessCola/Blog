import { type PropsWithChildren } from 'react'

interface IMainProps {
  className?: string
}

export default function Main ({ children, className }: PropsWithChildren<IMainProps>) {
  return (
    <main className={className ?? ''}>
      {children}
    </main>
  )
}
