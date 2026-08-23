import { Calendar, CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { cx, PRIORITY_STYLES } from '../utils/helpers'

export default function TodoItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-1 py-3 last:border-0">
      <button
        onClick={() => onToggle(task.id)}
        className={cx(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
          task.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300',
        )}
      >
        {task.completed && <CheckCircle2 size={14} />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cx('truncate text-sm font-medium', task.completed ? 'text-slate-400 line-through' : 'text-slate-800')}>
          {task.title}
        </p>
        {task.description && <p className="truncate text-xs text-slate-400">{task.description}</p>}
      </div>

      {task.dueDate && (
        <span className="hidden shrink-0 items-center gap-1 text-xs text-slate-400 sm:flex">
          <Calendar size={12} />
          {task.dueDate}
        </span>
      )}

      <span className={cx('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', PRIORITY_STYLES[task.priority])}>
        {task.priority}
      </span>

      <span className="hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 sm:inline">
        {task.subject}
      </span>

      <button onClick={() => onEdit(task)} className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
        <Pencil size={14} />
      </button>
      <button onClick={() => onDelete(task.id)} className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500">
        <Trash2 size={14} />
      </button>
    </div>
  )
}