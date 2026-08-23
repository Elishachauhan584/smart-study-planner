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
    loadData(STORAGE_KEYS.POMODORO_SETTINGS, DEFAULT_SETTINGS)
  )

  const [stats, setStats] = useState(() => {
    const saved = loadData(
      STORAGE_KEYS.POMODORO_STATS,
      DEFAULT_STATS
    )

    if (saved.lastActiveDate !== todayISO()) {
      return {
        ...saved,
        todaySessions: 0,
        lastActiveDate: todayISO(),
      }
    }

    return saved
  })

  const [mode, setMode] = useState('focus')

  const [secondsLeft, setSecondsLeft] = useState(() => {
    const saved = loadData(
      STORAGE_KEYS.POMODORO_TIME,
      null
    )

    return saved ?? DEFAULT_SETTINGS.focus * 60
  })

  const [running, setRunning] = useState(false)

  const intervalRef = useRef(null)

  useEffect(() => {
    saveData(STORAGE_KEYS.POMODORO_SETTINGS, settings)
  }, [settings])

  useEffect(() => {
    saveData(STORAGE_KEYS.POMODORO_STATS, stats)
  }, [stats])

  useEffect(() => {
    saveData(STORAGE_KEYS.POMODORO_TIME, secondsLeft)
  }, [secondsLeft])

  useEffect(() => {
    if (!running) {
      return undefined
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          return 0
        }

        return seconds - 1
      })
    }, 1000)

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [running])

  // Detect when timer reaches zero
  useEffect(() => {
    if (secondsLeft !== 0 || !running) {
      return
    }

    completeSession()
  }, [secondsLeft, running])

  function switchMode(nextMode) {
    if (!settings[nextMode]) return

    setRunning(false)
    setMode(nextMode)
    setSecondsLeft(settings[nextMode] * 60)
  }

  function completeSession() {
    setRunning(false)

    if (mode === 'focus') {
      markActiveToday()

      setStats((prev) => {
        const currentDate = todayISO()
        const isNewDay = prev.lastActiveDate !== currentDate

        const nextCompleted = prev.completedSessions + 1

        const nextStats = {
          completedSessions: nextCompleted,
          todaySessions: isNewDay
            ? 1
            : prev.todaySessions + 1,
          totalFocusMinutes:
            prev.totalFocusMinutes + settings.focus,
          lastActiveDate: currentDate,
        }

        // Every 4 completed focus sessions → long break
        const nextMode =
          nextCompleted % 4 === 0
            ? 'longBreak'
            : 'shortBreak'

        setMode(nextMode)
        setSecondsLeft(settings[nextMode] * 60)

        return nextStats
      })
    } else {
      setMode('focus')
      setSecondsLeft(settings.focus * 60)
    }
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

    setSettingsState((prev) => {
      const next = {
        ...prev,
        [key]: value,
      }

      if (mode === key && !running) {
        setSecondsLeft(value * 60)
      }

      return next
    })
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