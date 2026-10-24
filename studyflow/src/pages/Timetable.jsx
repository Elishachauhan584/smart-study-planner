import { useState } from 'react'
import { Plus } from 'lucide-react'
import useTimetable from '../hooks/useTimetable'
import TimetableGrid from '../components/TimetableGrid'
import TimetableSlotForm from '../components/TimetableSlotForm'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'

export default function Timetable() {
  const { slots, loading, addSlot, deleteSlot } = useTimetable()
  const [formOpen, setFormOpen] = useState(false)
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  async function handleSave(data) {
    try {
      await addSlot(data)
      setFormOpen(false)
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSlot(id)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <p className="text-sm text-slate-400">{todayLabel}</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Timetable</h1>
      <p className="mt-1 text-slate-500">Keep your timetable organized and moving forward.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Weekly timetable</h2>
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <Plus size={16} /> Add class
          </button>
        </div>

        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">Loading timetable...</p>
        ) : slots.length === 0 ? (
          <EmptyState text="No classes yet — add your first class to build your weekly schedule." />
        ) : (
          <TimetableGrid slots={slots} onDelete={handleDelete} />
        )}
      </div>

      {formOpen && (
        <Modal onClose={() => setFormOpen(false)} title="Add class">
          <TimetableSlotForm onSave={handleSave} onCancel={() => setFormOpen(false)} />
        </Modal>
      )}
    </div>
  )
}