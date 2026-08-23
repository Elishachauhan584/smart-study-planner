import { Check, Trash2 } from 'lucide-react'
import { cx } from '../utils/helpers'

export default function HabitCard({ habit, done, streak, onToggle, onDelete }) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className={cx(
            'flex h-7 w-7 items-center justify-center rounded-full border transition-colors',
            done ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 text-transparent hover:border-indigo-400',
          )}
        >
          <Check size={14} />
        </button>
        <span className="text-sm font-medium text-slate-800">{habit.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">{streak} day streak</span>
        <button
          onClick={onDelete}
          className="text-slate-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}