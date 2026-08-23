import { useEffect, useState } from 'react'
import { STORAGE_KEYS, loadData, saveData, uid } from '../utils/storage'

export default function useTimetable() {
  const [slots, setSlots] = useState(() => loadData(STORAGE_KEYS.TIMETABLE, []))

  useEffect(() => {
    saveData(STORAGE_KEYS.TIMETABLE, slots)
  }, [slots])

  function addSlot({ subject, days, startTime, endTime, location, instructor, color }) {
    const newSlot = {
      id: uid(),
      subject: subject.trim(),
      days, // e.g. ['Mon', 'Wed']
      startTime,
      endTime,
      location: location?.trim() || '',
      instructor: instructor?.trim() || '',
      color: color || 'indigo',
    }
    setSlots((prev) => [...prev, newSlot])
    return newSlot
  }

  function updateSlot(id, updates) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  function deleteSlot(id) {
    setSlots((prev) => prev.filter((s) => s.id !== id))
  }

  return { slots, addSlot, updateSlot, deleteSlot }
}