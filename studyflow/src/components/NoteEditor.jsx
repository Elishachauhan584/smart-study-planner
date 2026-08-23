import { useState } from 'react'
import Modal from './Modal'

export default function NoteEditor({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { title: '', content: '' })

  function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <Modal title={initial ? 'Edit note' : 'New note'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <input
          autoFocus
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Note title"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={6}
          placeholder="Write your note..."
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <button type="submit" className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
          Save note
        </button>
      </form>
    </Modal>
  )
}