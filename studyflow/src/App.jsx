import { useState } from 'react'
import { pct } from './utils/helpers'
import useTasks from './hooks/useTasks'
import useGoals from './hooks/useGoals'
import useNotes from './hooks/useNotes'
import usePomodoro from './hooks/usePomodoro'
import useStreak from './hooks/useStreak'

import Sidebar from './components/Sidebar'
import Header from './components/Header'

import Dashboard from './pages/Dashboard'
import Todo from './pages/Todo'
import Pomodoro from './pages/Pomodoro'
import Goals from './pages/Goals'
import Notes from './pages/Notes'
import Habits from './pages/Habits'
import Timetable from './pages/Timetable'
import Calendar from './pages/Calendar'

const WEEKLY_TARGET_HOURS = 25

export default function App() {
  const [view, setView] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)

  const tasksApi = useTasks()
  const goalsApi = useGoals()
  const notesApi = useNotes()
  const pomodoro = usePomodoro()
  const streak = useStreak()

  const weeklyHours = pomodoro.stats.totalFocusMinutes / 60
  const weeklyPct = pct(weeklyHours, WEEKLY_TARGET_HOURS)

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar
        view={view}
        setView={setView}
        weeklyPct={weeklyPct}
        weeklyHours={weeklyHours}
        weeklyTarget={WEEKLY_TARGET_HOURS}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMobile={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {view === 'overview' && (
            <Dashboard
              tasks={tasksApi.tasks}
              goals={goalsApi.goals}
              pomodoroStats={pomodoro.stats}
              streak={streak}
              addTask={tasksApi.addTask}
              toggleComplete={tasksApi.toggleComplete}
              setView={setView}
            />
          )}
          {view === 'todo' && (
            <Todo
              tasks={tasksApi.tasks}
              addTask={tasksApi.addTask}
              updateTask={tasksApi.updateTask}
              deleteTask={tasksApi.deleteTask}
              toggleComplete={tasksApi.toggleComplete}
            />
          )}
          {view === 'pomodoro' && <Pomodoro pomodoro={pomodoro} />}
          {view === 'goals' && (
            <Goals
              goals={goalsApi.goals}
              addGoal={goalsApi.addGoal}
              updateGoal={goalsApi.updateGoal}
              deleteGoal={goalsApi.deleteGoal}
              updateProgress={goalsApi.updateProgress}
            />
          )}
          {view === 'notes' && (
            <Notes
              notes={notesApi.notes}
              addNote={notesApi.addNote}
              updateNote={notesApi.updateNote}
              deleteNote={notesApi.deleteNote}
              togglePin={notesApi.togglePin}
            />
          )}
          {view === 'habits' && <Habits />}
          {view === 'timetable' && <Timetable />}
          {view === 'calendar' && <Calendar />}
        </main>
      </div>
    </div>
  )
}