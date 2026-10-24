import { useState } from 'react'
import { Plus } from 'lucide-react'
import useHabits from '../hooks/useHabits'
import HabitCard from '../components/HabitCard'
import HabitForm from '../components/HabitForm'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'

export default function Habits() {
  const { habits, loading, addHabit, deleteHabit, toggleToday, getHabitStreak } = useHabits()
  const [formOpen, setFormOpen] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  async function handleSave(data) {
    try {
      await addHabit(data)
      setFormOpen(false)
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleToggle(id) {
    try {
      await toggleToday(id)
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteHabit(id)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <p className="text-sm text-slate-400">{todayLabel}</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Habits</h1>
      <p className="mt-1 text-slate-500">Keep your habits organized and moving forward.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Habit tracker</h2>
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus size={16} /> New habit
          </button>
        </div>

        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">Loading habits...</p>
        ) : habits.length === 0 ? (
          <EmptyState text="No habits yet — add your first one to start a streak." />
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                done={habit.completedDates.includes(today)}
                streak={getHabitStreak(habit)}
                onToggle={() => handleToggle(habit.id)}
                onDelete={() => handleDelete(habit.id)}
              />
            ))}
          </div>
        )}
      </div>

      {formOpen && (
        <Modal onClose={() => setFormOpen(false)} title="Add habit">
          <HabitForm onSave={handleSave} onCancel={() => setFormOpen(false)} />
        </Modal>
      )}
    </div>
  )
}