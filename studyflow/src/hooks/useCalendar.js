import { useEffect, useState } from 'react'
import { STORAGE_KEYS, loadData, saveData, uid } from '../utils/storage'

export default function useCalendar() {
  const [events, setEvents] = useState(() => loadData(STORAGE_KEYS.CALENDAR_EVENTS, []))

  useEffect(() => {
    saveData(STORAGE_KEYS.CALENDAR_EVENTS, events)
  }, [events])

  function addEvent({ date, title, time, type, notes }) {
    const newEvent = {
      id: uid(),
      date, // 'YYYY-MM-DD'
      title: title.trim(),
      time: time || '',
      type: type || 'session', // 'exam' | 'deadline' | 'session'
      notes: notes?.trim() || '',
    }
    setEvents((prev) => [...prev, newEvent])
    return newEvent
  }

  function updateEvent(id, updates) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  function deleteEvent(id) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  function eventsForDate(date) {
    return events.filter((e) => e.date === date)
  }

  return { events, addEvent, updateEvent, deleteEvent, eventsForDate }
}