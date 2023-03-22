import { useNamespace } from '@/hooks/useNamespace'

export interface IDateProps {
  dateStr: string
}
export default function Date ({ dateStr }: IDateProps) {
  const ns = useNamespace('date')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [year, month, date] = dateStr.split('-')
  return (
    <div className={ns.b()}>
      <div>{month}</div>
      <div>{date}</div>
    </div>
  )
}
