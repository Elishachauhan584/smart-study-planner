export const STORAGE_KEYS = {
  TASKS: 'tasks',
  NOTES: 'notes',
  STREAK: 'streak',
  POMODORO_SETTINGS: 'pomodoro_settings',
  POMODORO_STATS: 'pomodoro_stats',
  POMODORO_TIME: 'pomodoro_time',
}

export function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key)

    if (raw === null) {
      return fallback
    }

    return JSON.parse(raw)
  } catch (error) {
    console.error(`Failed to load data for ${key}:`, error)
    return fallback
  }
}

export function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save data for ${key}:`, error)
  }
}

export function uid() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

export function todayISO() {
  const date = new Date()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function markActiveToday() {
  const today = todayISO()

  const data = loadData(STORAGE_KEYS.STREAK, {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    activeDates: [],
  })

  const activeDates = Array.isArray(data.activeDates)
    ? data.activeDates
    : []

  if (!activeDates.includes(today)) {
    activeDates.push(today)
  }

  let currentStreak = data.currentStreak || 0

  if (data.lastActiveDate === today) {
    currentStreak = data.currentStreak || 1
  } else {
    currentStreak += 1
  }

  const longestStreak = Math.max(
    data.longestStreak || 0,
    currentStreak
  )

  saveData(STORAGE_KEYS.STREAK, {
    ...data,
    currentStreak,
    longestStreak,
    lastActiveDate: today,
    activeDates,
  })
}

export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function pct(current, target) {
  if (!target) return 0

  return Math.max(
    0,
    Math.min(
      100,
      Math.round((current / target) * 100)
    )
  )
}

export function formatHours(minutes) {
  return `${(minutes / 60).toFixed(1)}h`
}

export const PRIORITY_STYLES = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-rose-100 text-rose-700',
}