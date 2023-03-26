import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'
import { useEffect, useRef, useState } from 'react'

interface IImageProps {
  alt: string
  thumb: string
  src: string
}
export default function Image ({ alt, thumb, src }: IImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  console.log('isLoaded', isLoaded)
  const ns = useNamespace('image')
  const img = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (img.current?.complete) setIsLoaded(true)
  }, [])

  return (
    <>
      <img
        className={useClassName(ns.b(), 'thumb')}
        alt={alt}
        src={thumb}
        style={{ visibility: isLoaded ? 'hidden' : 'visible' }}
      ></img>
      <img
        ref={img}
        onLoad={() => {
          console.log('?')
          setIsLoaded(true)
        }}
        className={useClassName(ns.b(), 'full')}
        style={{ opacity: isLoaded ? 1 : 0 }}
        alt={alt}
        src={src}
      />
    </>
  )
}
