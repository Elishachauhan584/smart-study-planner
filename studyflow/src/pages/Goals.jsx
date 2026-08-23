import { useState } from 'react'
import { Plus } from 'lucide-react'
import GoalCard from '../components/GoalCard'
import GoalForm from '../components/GoalForm'
import EmptyState from '../components/EmptyState'

export default function Goals({ goals, addGoal, updateGoal, deleteGoal, updateProgress }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Goals</h1>
          <p className="text-sm text-slate-500">{goals.length} goals tracked</p>
        </div>
        <button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus size={16} /> Add goal
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState text="No goals yet — add one to start tracking progress." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onDelete={deleteGoal}
              onProgress={updateProgress}
              onEdit={(goal) => {
                setEditing(goal)
                setFormOpen(true)
              }}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <GoalForm
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSave={(data) => (editing ? updateGoal(editing.id, data) : addGoal(data))}
        />
      )}
    </div>
  )
}