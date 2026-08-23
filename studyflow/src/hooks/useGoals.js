import { useEffect, useState } from 'react'
import {
  STORAGE_KEYS,
  loadData,
  saveData,
  uid,
} from '../utils/storage'

export default function useGoals() {
  const [goals, setGoals] = useState(() =>
    loadData(STORAGE_KEYS.GOALS, [])
  )

  useEffect(() => {
    saveData(STORAGE_KEYS.GOALS, goals)
  }, [goals])

  function addGoal({ title, description, target, deadline }) {
    const newGoal = {
      id: uid(),
      title: title.trim(),
      description: description?.trim() || '',
      target: Number(target) || 1,
      current: 0,
      deadline: deadline || '',
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setGoals((prev) => [newGoal, ...prev])
    return newGoal
  }

  function updateGoal(id, updates) {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      )
    )
  }

  function deleteGoal(id) {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  function updateProgress(id, current) {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== id) return goal

        const next = Math.max(0, Number(current) || 0)
        return {
          ...goal,
          current: next,
          completed: next >= goal.target,
        }
      })
    )
  }

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
  }
}