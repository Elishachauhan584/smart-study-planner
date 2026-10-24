import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { markActiveToday, todayISO } from '../utils/storage'

export default function useHabits() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  // Load this user's habits from the server when the hook mounts
  useEffect(() => {
    api('/habits')
      .then((data) => setHabits(data.map((h) => ({ ...h, completedDates: h.completedDates ?? [] }))))
      .catch((err) => console.error('Failed to load habits', err))
      .finally(() => setLoading(false))
  }, [])

  async function addHabit({ name, description, frequency, reminderTime, days }) {
    const created = await api('/habits', {
      method: 'POST',
      body: {
        name: name.trim(),
        description: description?.trim() || '',
        frequency: frequency || 'daily',
        reminderTime: reminderTime || '',
        days: frequency === 'custom' ? days : [0, 1, 2, 3, 4, 5, 6], // 0=Sun ... 6=Sat
      },
    })
    const habit = { ...created, completedDates: [] }
    setHabits((prev) => [habit, ...prev])
    return habit
  }

  async function updateHabit(id, updates) {
    const updated = await api(`/habits/${id}`, { method: 'PATCH', body: updates })
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updated } : h)))
  }

  async function deleteHabit(id) {
    await api(`/habits/${id}`, { method: 'DELETE' })
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  async function toggleToday(id) {
    const today = todayISO()
    const { completed } = await api(`/habits/${id}/toggle`, { method: 'POST', body: { date: today } })
    if (completed) markActiveToday()
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const others = h.completedDates.filter((d) => d !== today)
        return { ...h, completedDates: completed ? [...others, today] : others }
      }),
    )
  }

  // Consecutive-day streak, same "today or yesterday" logic as computeStreak in storage.js
  function getHabitStreak(habit) {
    const set = new Set(habit.completedDates)
    const oneDay = 24 * 60 * 60 * 1000
    let cursor = new Date()
    cursor.setHours(0, 0, 0, 0)
    if (!set.has(cursor.toISOString().slice(0, 10))) {
      cursor = new Date(cursor.getTime() - oneDay)
    }
    let streak = 0
    while (set.has(cursor.toISOString().slice(0, 10))) {
      streak += 1
      cursor = new Date(cursor.getTime() - oneDay)
    }
    return streak
  }

  return { habits, loading, addHabit, updateHabit, deleteHabit, toggleToday, getHabitStreak }
}