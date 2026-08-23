import { useState } from 'react'
import { Plus } from 'lucide-react'
import useTimetable from '../hooks/useTimetable'
import TimetableGrid from '../components/TimetableGrid'
import TimetableSlotForm from '../components/TimetableSlotForm'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'

export default function Timetable() {
  const { slots, addSlot, deleteSlot } = useTimetable()
  const [formOpen, setFormOpen] = useState(false)
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  function handleSave(data) {
    addSlot(data)
    setFormOpen(false)
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

        {slots.length === 0 ? (
          <EmptyState title="No classes yet" description="Add your first class to build your weekly schedule." />
        ) : (
          <TimetableGrid slots={slots} onDelete={deleteSlot} />
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