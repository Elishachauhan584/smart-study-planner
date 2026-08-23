import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import NoteCard from '../components/NoteCard'
import NoteEditor from '../components/NoteEditor'
import EmptyState from '../components/EmptyState'

export default function Notes({ notes, addNote, updateNote, deleteNote, togglePin }) {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = notes.filter(
    (n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()),
  )
  const pinned = filtered.filter((n) => n.pinned)
  const rest = filtered.filter((n) => !n.pinned)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Notes</h1>
        <button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus size={16} /> New note
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="No notes found." />
      ) : (
        <>
          {pinned.length > 0 && (
            <>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Pinned</h2>
              <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pinned.map((n) => (
                  <NoteCard key={n.id} note={n} onPin={togglePin} onDelete={deleteNote} onEdit={(note) => { setEditing(note); setFormOpen(true) }} />
                ))}
              </div>
            </>
          )}
          {rest.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {rest.map((n) => (
                <NoteCard key={n.id} note={n} onPin={togglePin} onDelete={deleteNote} onEdit={(note) => { setEditing(note); setFormOpen(true) }} />
              ))}
            </div>
          )}
        </>
      )}

      {formOpen && (
        <NoteEditor
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSave={(data) => (editing ? updateNote(editing.id, data) : addNote(data))}
        />
      )}
    </div>
  )
}