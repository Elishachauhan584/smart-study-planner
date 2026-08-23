import { useEffect, useState } from 'react'
import { STORAGE_KEYS, loadData, computeStreak } from '../utils/storage'

export default function useStreak() {
  const [activeDates, setActiveDates] = useState(() => loadData(STORAGE_KEYS.ACTIVE_DATES, []))

  useEffect(() => {
    function refresh() {
      setActiveDates(loadData(STORAGE_KEYS.ACTIVE_DATES, []))
    }
    window.addEventListener('focus', refresh)
    const id = setInterval(refresh, 2000)
    return () => {
      window.removeEventListener('focus', refresh)
      clearInterval(id)
    }
  }, [])

  return computeStreak(activeDates)
}