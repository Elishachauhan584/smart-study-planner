import { useEffect, useState } from 'react'
import {
  STORAGE_KEYS,
  loadData,
  saveData,
  uid,
  markActiveToday,
} from '../utils/storage'

export default function useTasks() {
  const [tasks, setTasks] = useState(() =>
    loadData(STORAGE_KEYS.TASKS, [])
  )

  useEffect(() => {
    saveData(STORAGE_KEYS.TASKS, tasks)
  }, [tasks])

  function addTask({
    title,
    description,
    subject,
    priority,
    dueDate,
  }) {
    const newTask = {
      id: uid(),
      title: title.trim(),
      description: description?.trim() || '',
      subject: subject?.trim() || 'General',
      priority: priority || 'Medium',
      dueDate: dueDate || '',
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [newTask, ...prev])

    return newTask
  }

  function updateTask(id, updates) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates }
          : task
      )
    )
  }

  function deleteTask(id) {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    )
  }

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task

        const completed = !task.completed

        if (completed) {
          markActiveToday()
        }

        return {
          ...task,
          completed,
        }
      })
    )
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  }
}