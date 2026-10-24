import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { markActiveToday } from '../utils/storage'

export default function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/tasks')
      .then(setTasks)
      .catch((err) => console.error('Failed to load tasks', err))
      .finally(() => setLoading(false))
  }, [])

  async function addTask({ title, description, subject, priority, dueDate }) {
    const created = await api('/tasks', {
      method: 'POST',
      body: {
        title: title.trim(),
        description: description?.trim() || '',
        subject: subject?.trim() || 'General',
        priority: priority || 'Medium',
        dueDate: dueDate || '',
        completed: false,
      },
    })
    setTasks((prev) => [created, ...prev])
    return created
  }

  async function updateTask(id, updates) {
    const updated = await api(`/tasks/${id}`, { method: 'PATCH', body: updates })
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  async function deleteTask(id) {
    await api(`/tasks/${id}`, { method: 'DELETE' })
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  async function toggleComplete(id) {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const completed = !task.completed
    const updated = await api(`/tasks/${id}`, { method: 'PATCH', body: { completed } })
    if (completed) markActiveToday()
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  return { tasks, loading, addTask, updateTask, deleteTask, toggleComplete }
}