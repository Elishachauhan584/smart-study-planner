import { Pencil, Trash2 } from 'lucide-react'
import { cx, pct } from '../utils/helpers'

export default function GoalCard({ goal, onEdit, onDelete, onProgress }) {
  const p = pct(goal.current, goal.target)
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{goal.title}</h3>
          {goal.description && <p className="mt-0.5 text-xs text-slate-400">{goal.description}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          <button onClick={() => onEdit(goal)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(goal.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {goal.current} / {goal.target}
        </span>
        <span className="font-semibold text-indigo-600">{p}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={cx('h-full rounded-full transition-all', goal.completed ? 'bg-emerald-500' : 'bg-indigo-600')}
          style={{ width: `${p}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-slate-400">{goal.deadline ? `Due ${goal.deadline}` : 'No deadline'}</span>
        {goal.completed ? (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700">Completed</span>
        ) : (
          <div className="flex items-center gap-1">
            <button onClick={() => onProgress(goal.id, Math.max(0, goal.current - 1))} className="rounded-md border border-slate-200 px-2 py-0.5 text-slate-500 hover:bg-slate-50">
              −
            </button>
            <button onClick={() => onProgress(goal.id, goal.current + 1)} className="rounded-md border border-slate-200 px-2 py-0.5 text-slate-500 hover:bg-slate-50">
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}