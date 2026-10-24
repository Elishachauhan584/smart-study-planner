import { useState } from 'react'
import { CheckCircle2, Flame, Target, Timer as TimerIcon, ChevronRight, Repeat, Calendar as CalendarIcon } from 'lucide-react'
import { cx, pct, formatHours } from '../utils/helpers'
import StatCard from '../components/StatCard'
import EmptyState from '../components/EmptyState'
import useHabits from '../hooks/useHabits'
import useTimetable from '../hooks/useTimetable'
import PomodoroMini from '../components/PomodoroMini'

const DAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

function dayLabel(offset, day) {
  if (offset === 0) return 'Today'
  if (offset === 1) return 'Tomorrow'
  return day
}

export default function Dashboard({ tasks, goals, pomodoroStats, pomodoro, streak, addTask, toggleComplete, setView }) {
  const [quickTitle, setQuickTitle] = useState('')
  const { habits, getHabitStreak } = useHabits()
  const { slots } = useTimetable()

  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  const overallGoalPct = goals.length
    ? Math.round(goals.reduce((sum, g) => sum + pct(g.current, g.target), 0) / goals.length)
    : 0

  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const todayLabel = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Next 3 classes across the whole week, starting from now
  const upcomingClasses = slots
    .flatMap((s) =>
      (s.days || []).map((day) => {
        const [sh, sm] = s.startTime.split(':').map(Number)
        const [eh, em] = s.endTime.split(':').map(Number)
        let offset = (DAY_ABBR.indexOf(day) - now.getDay() + 7) % 7
        // a class that already ended today next happens in 7 days
        if (offset === 0 && eh * 60 + em < nowMinutes) offset = 7
        return { ...s, day, offset, startMin: sh * 60 + sm }
      }),
    )
    .sort((a, b) => a.offset - b.offset || a.startMin - b.startMin)
    .slice(0, 3)

  const topHabits = [...habits]
    .map((h) => ({ ...h, streakCount: getHabitStreak(h) }))
    .sort((a, b) => b.streakCount - a.streakCount)
    .slice(0, 3)

  function quickAdd(e) {
    e.preventDefault()
    if (!quickTitle.trim()) return
    addTask({ title: quickTitle, description: '', subject: 'General', priority: 'Medium', dueDate: '' })
    setQuickTitle('')
  }

  return (
    <div>
      <p className="text-sm text-slate-400">{todayLabel}</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mb-6 text-sm text-slate-500">Here's your study snapshot for today.</p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Study hours"
          value={formatHours(pomodoroStats.totalFocusMinutes)}
          sub={`${pomodoroStats.todaySessions} sessions today`}
          icon={TimerIcon}
          tone="indigo"
        />
        <StatCard label="Tasks completed" value={`${completed}/${total}`} sub="Keep it up!" icon={CheckCircle2} tone="emerald" />
        <StatCard label="Current streak" value={`${streak} days`} sub="Consecutive study days" icon={Flame} tone="orange" />
        <StatCard label="Goals progress" value={`${overallGoalPct}%`} sub={`${goals.length} goals tracked`} icon={Target} tone="amber" />
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Today's tasks</h2>
          <button onClick={() => setView('todo')} className="flex items-center text-sm font-medium text-indigo-600 hover:underline">
            View all <ChevronRight size={14} />
          </button>
        </div>

        <form onSubmit={quickAdd} className="mb-4 flex gap-2">
          <input
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700">
            Add
          </button>
        </form>

        {tasks.length === 0 ? (
          <EmptyState text="No tasks yet — add one above." />
        ) : (
          tasks.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0">
              <button
                onClick={() => toggleComplete(t.id)}
                className={cx(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                  t.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300',
                )}
              >
                {t.completed && <CheckCircle2 size={14} />}
              </button>
              <span className={cx('flex-1 text-sm', t.completed ? 'text-slate-400 line-through' : 'text-slate-800')}>{t.title}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{t.subject}</span>
            </div>
          ))
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PomodoroMini pomodoro={pomodoro} onOpen={() => setView('pomodoro')} />
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Repeat size={18} className="text-indigo-600" />
              Habit streaks
            </h2>
            <button onClick={() => setView('habits')} className="flex items-center text-sm font-medium text-indigo-600 hover:underline">
              View habits <ChevronRight size={14} />
            </button>
          </div>

          {topHabits.length === 0 ? (
            <EmptyState text="No habits yet — add one to start a streak." />
          ) : (
            <div className="space-y-3">
              {topHabits.map((h) => (
                <div key={h.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                      <Flame size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-800">{h.name}</span>
                  </div>
                  <span className="text-sm text-slate-500">{h.streakCount} days</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CalendarIcon size={18} className="text-indigo-600" />
              Next up
            </h2>
            <button onClick={() => setView('timetable')} className="flex items-center text-sm font-medium text-indigo-600 hover:underline">
              Timetable <ChevronRight size={14} />
            </button>
          </div>

          {upcomingClasses.length === 0 ? (
            <EmptyState text="No upcoming classes." />
          ) : (
            <div className="space-y-4">
              {upcomingClasses.map((s) => (
                <div key={`${s.id}-${s.day}`} className="flex gap-3 border-l-2 border-indigo-500 pl-3">
                  <div>
                    <p className="text-xs font-medium text-indigo-600">
                      {dayLabel(s.offset, s.day)} · {formatTime(s.startTime)} — {formatTime(s.endTime)}
                    </p>
                    <p className="text-sm font-semibold text-slate-800">{s.subject}</p>
                    {s.location && <p className="text-xs text-slate-400">{s.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}