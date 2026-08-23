import { useState } from 'react'
import { cx } from '../utils/helpers'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const COLOR_SWATCH = {
  mint: 'bg-emerald-200',
  blue: 'bg-blue-200',
  peach: 'bg-orange-200',
  indigo: 'bg-indigo-200',
  rose: 'bg-rose-200',
}

export default function TimetableSlotForm({ initialData, onSave, onCancel }) {
  const [subject, setSubject] = useState(initialData?.subject || '')
  const [days, setDays] = useState(initialData?.days || [])
  const [startTime, setStartTime] = useState(initialData?.startTime || '')
  const [endTime, setEndTime] = useState(initialData?.endTime || '')
  const [location, setLocation] = useState(initialData?.location || '')
  const [instructor, setInstructor] = useState(initialData?.instructor || '')
  const [color, setColor] = useState(initialData?.color || 'mint')

  function toggleDay(d) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!subject.trim() || days.length === 0 || !startTime || !endTime) return
    onSave({ subject, days, startTime, endTime, location, instructor, color })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Subject name</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          autoFocus
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Calculus II"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Day</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={cx(
                'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors',
                days.includes(d) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Start time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">End time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Room / location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Room 204"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Instructor</label>
        <input
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Dr. Sharma"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Color</label>
        <div className="flex gap-2">
          {Object.keys(COLOR_SWATCH).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cx(
                'h-7 w-7 rounded-full border-2',
                COLOR_SWATCH[c],
                color === c ? 'border-slate-900' : 'border-transparent',
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  )
}