import { useState } from 'react'
import Modal from './Modal'

export default function GoalForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { title: '', description: '', target: 10, deadline: '' })

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({ ...form, target: Number(form.target) || 1 })
    onClose()
  }

  return (
    <Modal title={initial ? 'Edit goal' : 'Add goal'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Title</label>
          <input
            autoFocus
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="e.g. Complete JavaScript Course"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Target</label>
            <input
              type="number"
              min={1}
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
        <button type="submit" className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
          {initial ? 'Save changes' : 'Add goal'}
        </button>
      </form>
    </Modal>
  )
}