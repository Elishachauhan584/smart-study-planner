import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { cx } from '../utils/helpers'
import { MODE_LABEL } from '../hooks/usePomodoro'

export default function Pomodoro({ pomodoro }) {
  const { settings, stats, mode, secondsLeft, running, switchMode, completeSession, reset, toggleRunning, updateDuration } = pomodoro

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')
  const totalHrs = (stats.totalFocusMinutes / 60).toFixed(1)

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Pomodoro</h1>
      <p className="mb-6 text-sm text-slate-500">Stay focused, one session at a time.</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card lg:col-span-2">
          <div className="mb-6 flex justify-center gap-1 rounded-xl bg-slate-100 p-1">
            {['focus', 'shortBreak', 'longBreak'].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={cx('rounded-lg px-4 py-2 text-xs font-semibold', mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500')}
              >
                {MODE_LABEL[m]}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center py-6">
            <div className="text-7xl font-bold tabular-nums text-slate-900">
              {mins}:{secs}
            </div>
            <div className="mt-2 text-sm text-slate-400">{MODE_LABEL[mode]} session</div>

            <div className="mt-8 flex items-center gap-3">
              <button onClick={reset} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
                <RotateCcw size={18} />
              </button>
              <button onClick={toggleRunning} className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700">
                {running ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
              </button>
              <button onClick={completeSession} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50">
                <SkipForward size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Session stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Today's sessions</span>
                <span className="font-semibold text-slate-900">{stats.todaySessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Completed sessions</span>
                <span className="font-semibold text-slate-900">{stats.completedSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total focus time</span>
                <span className="font-semibold text-slate-900">{totalHrs}h</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Durations (minutes)</h3>
            <div className="space-y-3">
              {[
                ['focus', 'Focus'],
                ['shortBreak', 'Short break'],
                ['longBreak', 'Long break'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{label}</span>
                  <input
                    type="number"
                    min={1}
                    value={settings[key]}
                    onChange={(e) => updateDuration(key, e.target.value)}
                    className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}