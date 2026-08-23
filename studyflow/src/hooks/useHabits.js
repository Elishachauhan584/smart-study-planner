import { useEffect, useState } from 'react'
import { STORAGE_KEYS, loadData, saveData, uid, markActiveToday, todayISO } from '../utils/storage'

export default function useHabits() {
  const [habits, setHabits] = useState(() => loadData(STORAGE_KEYS.HABITS, []))

  useEffect(() => {
    saveData(STORAGE_KEYS.HABITS, habits)
  }, [habits])

  function addHabit({ name, description, frequency, reminderTime, days }) {
    const newHabit = {
      id: uid(),
      name: name.trim(),
      description: description?.trim() || '',
      frequency: frequency || 'daily', // 'daily' | 'custom'
      reminderTime: reminderTime || '',
      days: frequency === 'custom' ? days : [0, 1, 2, 3, 4, 5, 6], // 0=Sun ... 6=Sat
      completedDates: [],
      createdAt: new Date().toISOString(),
    }
    setHabits((prev) => [newHabit, ...prev])
    return newHabit
  }

  function updateHabit(id, updates) {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)))
  }

  function deleteHabit(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  function toggleToday(id) {
    const today = todayISO()
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const done = h.completedDates.includes(today)
        const completedDates = done
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today]
        if (!done) markActiveToday()
        return { ...h, completedDates }
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

  return { habits, addHabit, updateHabit, deleteHabit, toggleToday, getHabitStreak }
}