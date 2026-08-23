import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from '../utils/helpers'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function CalendarView({ eventsForDate, onSelectDate }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function isToday(day) {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  function dateKey(day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="py-2">{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />
          const hasEvents = eventsForDate ? eventsForDate(dateKey(day)).length > 0 : false
          return (
            <button
              key={i}
              onClick={() => onSelectDate?.(dateKey(day))}
              className={cx(
                'flex h-12 flex-col items-center justify-center rounded-xl text-sm transition-colors',
                isToday(day) ? 'bg-indigo-600 font-semibold text-white' : 'text-slate-700 hover:bg-slate-100',
              )}
            >
              <span>{day}</span>
              {hasEvents && <span className={cx('mt-0.5 h-1 w-1 rounded-full', isToday(day) ? 'bg-white' : 'bg-indigo-500')} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}