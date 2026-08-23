import { Pencil, Pin, Trash2 } from 'lucide-react'
import { cx } from '../utils/helpers'

export default function NoteCard({ note, onPin, onEdit, onDelete }) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{note.title}</h3>
        <button
          onClick={() => onPin(note.id)}
          className={cx('shrink-0 rounded-lg p-1.5', note.pinned ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500')}
        >
          <Pin size={16} fill={note.pinned ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="mb-4 flex-1 whitespace-pre-line text-sm text-slate-500 line-clamp-4">{note.content}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
        <div className="flex gap-1">
          <button onClick={() => onEdit(note)} className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-slate-600">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(note.id)} className="rounded-lg p-1.5 hover:bg-rose-50 hover:text-rose-500">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}