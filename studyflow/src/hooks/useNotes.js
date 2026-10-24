import { useEffect, useState } from 'react'
import { api } from '../utils/api'

export default function useNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/notes')
      .then(setNotes)
      .catch((err) => console.error('Failed to load notes', err))
      .finally(() => setLoading(false))
  }, [])

  async function addNote({ title, content }) {
    const created = await api('/notes', {
      method: 'POST',
      body: {
        title: title.trim(),
        content: content?.trim() || '',
        pinned: false,
      },
    })
    setNotes((prev) => [created, ...prev])
    return created
  }

  async function updateNote(id, updates) {
    const updated = await api(`/notes/${id}`, { method: 'PATCH', body: updates })
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
  }

  async function deleteNote(id) {
    await api(`/notes/${id}`, { method: 'DELETE' })
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  async function togglePin(id) {
    const note = notes.find((n) => n.id === id)
    if (!note) return
    const updated = await api(`/notes/${id}`, { method: 'PATCH', body: { pinned: !note.pinned } })
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
  }

  return { notes, loading, addNote, updateNote, deleteNote, togglePin }
}