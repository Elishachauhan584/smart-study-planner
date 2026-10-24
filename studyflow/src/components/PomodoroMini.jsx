import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'
import { MODE_LABEL } from '../hooks/usePomodoro'

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function PomodoroMini({ pomodoro, onOpen }) {
  const { settings, mode, secondsLeft, running, toggleRunning, reset } = pomodoro

  const total = settings[mode] * 60
  const progress = total ? secondsLeft / total : 0
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Pomodoro</h2>
        <button onClick={onOpen} className="flex items-center text-sm font-medium text-indigo-600 hover:underline">
          Open timer <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32">
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
            <circle cx="64" cy="64" r={RADIUS} fill="none" strokeWidth="8" className="stroke-slate-100" />
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className="stroke-indigo-600 transition-all duration-300"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums text-slate-900">
            {mins}:{secs}
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-400">{MODE_LABEL[mode]} session</p>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={toggleRunning}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={reset}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}