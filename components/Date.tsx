import { useNamespace } from '@/hooks/useNamespace'

export interface IDateProps {
  month: number
  date: number
}
export default function Date ({ month, date }: IDateProps) {
  const ns = useNamespace('date')
  return (
    <>
      <div className={ns.b()}>
        <div>{month}</div>
        <div>{date}</div>
      </div>
      <hr></hr>
    </>
  )
}
