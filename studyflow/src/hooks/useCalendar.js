import { useEffect, useState } from 'react'
import { api } from '../utils/api'

export default function useCalendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/events')
      .then(setEvents)
      .catch((err) => console.error('Failed to load events', err))
      .finally(() => setLoading(false))
  }, [])

  async function addEvent({ date, title, time, type, notes }) {
    const created = await api('/events', {
      method: 'POST',
      body: { date, title: title.trim(), time: time || '', type: type || 'session', notes: notes?.trim() || '' },
    })
    setEvents((prev) => [...prev, created])
    return created
  }

  async function updateEvent(id, updates) {
    const updated = await api(`/events/${id}`, { method: 'PATCH', body: updates })
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }

  async function deleteEvent(id) {
    await api(`/events/${id}`, { method: 'DELETE' })
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  function eventsForDate(date) {
    return events.filter((e) => e.date === date)
  }

  return { events, loading, addEvent, updateEvent, deleteEvent, eventsForDate }
}