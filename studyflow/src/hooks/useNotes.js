import { useEffect, useState } from 'react'
import { STORAGE_KEYS, loadData, saveData, uid } from '../utils/storage'

export default function useNotes() {
  const [notes, setNotes] = useState(() => loadData(STORAGE_KEYS.NOTES, []))

  useEffect(() => {
    saveData(STORAGE_KEYS.NOTES, notes)
  }, [notes])

  function addNote({ title, content }) {
    const now = new Date().toISOString()
    const newNote = {
      id: uid(),
      title: title.trim(),
      content: content?.trim() || '',
      pinned: false,
      createdAt: now,
      updatedAt: now,
    }
    setNotes((prev) => [newNote, ...prev])
    return newNote
  }

  function updateNote(id, updates) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n)),
    )
  }

  function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  function togglePin(id) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)))
  }

  return { notes, addNote, updateNote, deleteNote, togglePin }
}