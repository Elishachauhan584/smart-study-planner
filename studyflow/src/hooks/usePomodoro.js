import { useEffect, useRef, useState } from 'react'
import {
  STORAGE_KEYS,
  loadData,
  saveData,
  todayISO,
  markActiveToday,
} from '../utils/storage'

const DEFAULT_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
}

const DEFAULT_STATS = {
  completedSessions: 0,
  todaySessions: 0,
  totalFocusMinutes: 0,
  lastActiveDate: todayISO(),
}

export const MODE_LABEL = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

export default function usePomodoro() {
  const [settings, setSettingsState] = useState(() =>
    loadData(STORAGE_KEYS.POMODORO_SETTINGS, DEFAULT_SETTINGS),
  )

  const [stats, setStats] = useState(() => {
    const saved = loadData(STORAGE_KEYS.POMODORO_STATS, DEFAULT_STATS)
    if (saved.lastActiveDate !== todayISO()) {
      return { ...saved, todaySessions: 0, lastActiveDate: todayISO() }
    }
    return saved
  })

  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(() => settings.focus * 60)
  const [running, setRunning] = useState(false)

  // Timestamp (ms) when the running timer should hit zero
  const endAtRef = useRef(0)

  useEffect(() => {
    saveData(STORAGE_KEYS.POMODORO_SETTINGS, settings)
  }, [settings])

  useEffect(() => {
    saveData(STORAGE_KEYS.POMODORO_STATS, stats)
  }, [stats])

  // Countdown based on the clock, so it stays accurate in background tabs
  useEffect(() => {
    if (!running) return undefined

    endAtRef.current = Date.now() + secondsLeft * 1000

    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000))
      setSecondsLeft(remaining)
    }, 250)

    return () => clearInterval(id)
    // Only restart the interval when running toggles
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  // When the timer reaches zero, finish the session
  useEffect(() => {
    if (running && secondsLeft === 0) {
      completeSession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, running])

  function switchMode(nextMode) {
    if (!settings[nextMode]) return
    setRunning(false)
    setMode(nextMode)
    setSecondsLeft(settings[nextMode] * 60)
  }

  // Called when the timer ends (secondsLeft === 0) or when the user clicks skip
  function completeSession() {
    const finished = secondsLeft === 0
    setRunning(false)

    if (mode !== 'focus') {
      setMode('focus')
      setSecondsLeft(settings.focus * 60)
      return
    }

    // Full credit if the timer finished, otherwise only the minutes actually studied
    const elapsedMinutes = finished
      ? settings.focus
      : Math.min(settings.focus, Math.max(0, Math.floor((settings.focus * 60 - secondsLeft) / 60)))

    const today = todayISO()
    const isNewDay = stats.lastActiveDate !== today
    const nextCompleted = stats.completedSessions + (finished ? 1 : 0)

    if (elapsedMinutes > 0) markActiveToday()

    setStats({
      completedSessions: nextCompleted,
      todaySessions: (isNewDay ? 0 : stats.todaySessions) + (finished ? 1 : 0),
      totalFocusMinutes: stats.totalFocusMinutes + elapsedMinutes,
      lastActiveDate: today,
    })

    // Every 4 completed focus sessions -> long break
    const nextMode = finished && nextCompleted % 4 === 0 ? 'longBreak' : 'shortBreak'
    setMode(nextMode)
    setSecondsLeft(settings[nextMode] * 60)
  }

  function reset() {
    setRunning(false)
    setSecondsLeft(settings[mode] * 60)
  }

  function toggleRunning() {
    setRunning((current) => !current)
  }

  function updateDuration(key, minutes) {
    const value = Math.max(1, Number(minutes) || 1)
    setSettingsState((prev) => ({ ...prev, [key]: value }))
    if (mode === key && !running) {
      setSecondsLeft(value * 60)
    }
  }

  return {
    settings,
    stats,
    mode,
    modeLabel: MODE_LABEL[mode],
    secondsLeft,
    running,
    switchMode,
    reset,
    toggleRunning,
    updateDuration,
    completeSession,
  }
}