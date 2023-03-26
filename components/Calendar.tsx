import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'
import SvgIcon from './SvgIcon'
import ArrowBack from '@/public/icons/arrowBack.svg'
import ArrowForward from '@/public/icons/arrowForward.svg'

interface IMonthCalendarProps {
  year: number
  monthData: Array<number | string>
  startYear: number
  onChangeYear: (year: number) => void
}
const MONTH_LABEL_MAP = ['JAN', 'FEB', 'MAT', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function MonthCalendar ({ year, monthData, startYear, onChangeYear }: IMonthCalendarProps) {
  const ns = useNamespace('calendar')
  const handlePrev = () => {
    if (year <= startYear) return
    onChangeYear(year - 1)
  }
  const handleNext = () => {
    if (year === new Date().getFullYear()) return
    onChangeYear(year + 1)
  }
  return (
    <div className={useClassName(ns.b())}>
      <span className={ns.e('year')}> {year} 年</span>
      <span className={ns.e('switch')}>
        <span className={ns.is('disabled', year === startYear)} onClick={handlePrev}><SvgIcon><ArrowBack /></SvgIcon></span>
        <span className={ns.is('disabled', year === new Date().getFullYear())} onClick={handleNext}><SvgIcon><ArrowForward /></SvgIcon></span>
      </span>
      {
        monthData.map((articleNum, monthIdx) => (
          <div className={useClassName(ns.e('item'), ns.is('disabled', !articleNum))} key={`calendar-month-${monthIdx}`}>
            <span className={ns.e('label')}>{MONTH_LABEL_MAP[monthIdx]}</span>
            {articleNum ?? '-'}
          </div>
        ))
      }
    </div>
  )
}
