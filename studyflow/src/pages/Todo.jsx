import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { cx } from '../utils/helpers'
import TodoItem from '../components/TodoItem'
import TodoForm from '../components/TodoForm'
import EmptyState from '../components/EmptyState'

export default function Todo({ tasks, addTask, updateTask, deleteTask, toggleComplete }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = tasks.filter((t) => {
    if (filter === 'Active' && t.completed) return false
    if (filter === 'Completed' && !t.completed) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">To-Do</h1>
          <p className="text-sm text-slate-500">
            {total} total · {completed} completed · {total - completed} remaining
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus size={16} /> Add task
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
          {['All', 'Active', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cx('rounded-lg px-3 py-1.5 text-xs font-semibold', filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500')}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        {filtered.length === 0 ? (
          <EmptyState text="No tasks match — add one to get started." />
        ) : (
          filtered.map((t) => (
            <TodoItem
              key={t.id}
              task={t}
              onToggle={toggleComplete}
              onDelete={deleteTask}
              onEdit={(task) => {
                setEditing(task)
                setFormOpen(true)
              }}
            />
          ))
        )}
      </div>

      {formOpen && (
        <TodoForm
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSave={(data) => (editing ? updateTask(editing.id, data) : addTask(data))}
        />
      )}
    </div>
  )
}