// Centralized localStorage helpers. Keeping every read/write in one place
// makes it easy to add new modules (Calendar, Habits, Timetable...) later
// without touching the storage layer.

const PREFIX = 'studyflow:'

export const STORAGE_KEYS = {
  TASKS: 'tasks',
  GOALS: 'goals',
  NOTES: 'notes',
  POMODORO_SETTINGS: 'pomodoroSettings',
  POMODORO_STATS: 'pomodoroStats',
  POMODORO_TIME: 'pomodoroTime',
  ACTIVE_DATES: 'activeDates',
}

export function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.error(`StudyFlow: failed to read "${key}" from storage`, err)
    return fallback
  }
}

export function saveData(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error(`StudyFlow: failed to save "${key}" to storage`, err)
    return false
  }
}

export function uid() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

// Records "today" as an active study day (used for streak + weekly-goal math)
// and returns the updated list of active date strings (YYYY-MM-DD).
export function markActiveToday() {
  const dates = loadData(STORAGE_KEYS.ACTIVE_DATES, [])
  const today = todayISO()
  if (!dates.includes(today)) {
    const updated = [...dates, today]
    saveData(STORAGE_KEYS.ACTIVE_DATES, updated)
    return updated
  }
  return dates
}

// Consecutive-day streak ending today (or yesterday, so a streak isn't lost
// the moment the clock ticks past midnight before the user studies again).
export function computeStreak(activeDates) {
  if (!activeDates || activeDates.length === 0) return 0
  const set = new Set(activeDates)
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

export function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}