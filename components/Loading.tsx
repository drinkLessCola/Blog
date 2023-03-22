import { useNamespace } from '@/hooks/useNamespace'
import SvgIcon from './SvgIcon'

interface ILoadingProps {
  isLoading?: boolean
}

export default function Loading ({ isLoading = true }: ILoadingProps) {
  const ns = useNamespace('load')
  return (
    <>
    {
      isLoading && (
        <div className={ns.b()}>
          <div className={ns.e('indicator')}>
            <SvgIcon size="40px"><LoadingIcon /></SvgIcon>
            <span>Loading...</span>
          </div>
        </div>
      )
    }
    </>
  )
}

export function LoadingIcon () {
  return (
    <svg className="loading-circle">
      <circle className="path" cx="20" cy="20" r="18" fill="none" />
    </svg>
  )
}
