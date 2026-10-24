import { useEffect, useState } from 'react'
import { api } from '../utils/api'

export default function useTimetable() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/timetable')
      .then(setSlots)
      .catch((err) => console.error('Failed to load timetable', err))
      .finally(() => setLoading(false))
  }, [])

  async function addSlot({ subject, days, startTime, endTime, location, instructor, color }) {
    const created = await api('/timetable', {
      method: 'POST',
      body: {
        subject: subject.trim(),
        days,
        startTime,
        endTime,
        location: location?.trim() || '',
        instructor: instructor?.trim() || '',
        color: color || 'mint',
      },
    })
    setSlots((prev) => [created, ...prev])
    return created
  }

  async function updateSlot(id, updates) {
    const updated = await api(`/timetable/${id}`, { method: 'PATCH', body: updates })
    setSlots((prev) => prev.map((s) => (s.id === id ? updated : s)))
  }

  async function deleteSlot(id) {
    await api(`/timetable/${id}`, { method: 'DELETE' })
    setSlots((prev) => prev.filter((s) => s.id !== id))
  }

  return { slots, loading, addSlot, updateSlot, deleteSlot }
}