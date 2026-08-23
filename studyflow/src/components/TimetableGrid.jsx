import { Trash2 } from 'lucide-react'
import { cx } from '../utils/helpers'

const COLOR_STYLES = {
  mint: 'border-l-emerald-400 bg-emerald-50',
  blue: 'border-l-blue-400 bg-blue-50',
  peach: 'border-l-orange-400 bg-orange-50',
  indigo: 'border-l-indigo-400 bg-indigo-50',
  rose: 'border-l-rose-400 bg-rose-50',
}

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export default function TimetableGrid({ slots, onDelete }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className={cx('group relative flex flex-col rounded-xl border-l-4 px-4 py-3', COLOR_STYLES[slot.color] || COLOR_STYLES.indigo)}
        >
          <span className="text-sm font-semibold text-slate-800">{slot.subject}</span>
          <span className="mt-0.5 text-xs text-slate-500">
            {slot.days.join(' / ')} · {formatTime(slot.startTime)}
          </span>
          {(slot.location || slot.instructor) && (
            <span className="mt-1 text-xs text-slate-400">
              {[slot.location, slot.instructor].filter(Boolean).join(' · ')}
            </span>
          )}
          <button
            onClick={() => onDelete(slot.id)}
            className="absolute right-2 top-2 text-slate-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}