import { useEffect, useState } from 'react'
import { api } from '../utils/api'

export default function useGoals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/goals')
      .then(setGoals)
      .catch((err) => console.error('Failed to load goals', err))
      .finally(() => setLoading(false))
  }, [])

  async function addGoal({ title, description, target, deadline }) {
    const created = await api('/goals', {
      method: 'POST',
      body: {
        title: title.trim(),
        description: description?.trim() || '',
        target: Number(target) || 1,
        current: 0,
        deadline: deadline || '',
        completed: false,
      },
    })
    setGoals((prev) => [created, ...prev])
    return created
  }

  async function updateGoal(id, updates) {
    const updated = await api(`/goals/${id}`, { method: 'PATCH', body: updates })
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
  }

  async function deleteGoal(id) {
    await api(`/goals/${id}`, { method: 'DELETE' })
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  async function updateProgress(id, current) {
    const goal = goals.find((g) => g.id === id)
    if (!goal) return
    const next = Math.max(0, Number(current) || 0)
    const updated = await api(`/goals/${id}`, {
      method: 'PATCH',
      body: { current: next, completed: next >= goal.target },
    })
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
  }

  return { goals, loading, addGoal, updateGoal, deleteGoal, updateProgress }
}