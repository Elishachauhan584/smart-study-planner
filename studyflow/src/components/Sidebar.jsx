import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Target,
  ListChecks,
  Timer as TimerIcon,
  StickyNote,
  Repeat,
  Table2,
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  LogOut,
  Zap,
} from 'lucide-react'
import { cx } from '../utils/helpers'

export const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'goals', label: 'Goals', icon: Target },
  { key: 'todo', label: 'To-Do', icon: ListChecks },
  { key: 'pomodoro', label: 'Pomodoro', icon: TimerIcon },
  { key: 'notes', label: 'Notes', icon: StickyNote },
  { key: 'habits', label: 'Habits', icon: Repeat },
  { key: 'timetable', label: 'Timetable', icon: Table2 },
  { key: 'calendar', label: 'Calendar', icon: CalendarIcon },
]

function SidebarContent({ view, setView, weeklyPct, weeklyHours, weeklyTarget, closeMobile }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Zap size={18} fill="white" />
        </div>
        <span className="text-lg font-bold text-slate-900">StudyFlow</span>
      </div>

      <div className="px-6 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Workspace</div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = view === item.key
          return (
            <button
              key={item.key}
              onClick={() => {
                setView(item.key)
                closeMobile?.()
              }}
              className={cx(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50',
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mx-3 mb-3 rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-700">Weekly goal</span>
          <span className="font-semibold text-indigo-600">{weeklyPct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${weeklyPct}%` }} />
        </div>
        <div className="mt-2 text-xs text-slate-400">
          {weeklyHours.toFixed(1)} of {weeklyTarget} hours studied
        </div>
      </div>

      <div className="mx-3 mb-2 px-3 text-xs text-slate-400">Signed in as {user?.name}</div>

      <button className="mx-3 mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
        <SettingsIcon size={18} />
        Settings
      </button>

      <button
        onClick={logout}
        className="mx-3 mb-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        <LogOut size={18} />
        Log out
      </button>
    </div>
  )
}

export default function Sidebar({ view, setView, weeklyPct, weeklyHours, weeklyTarget, mobileOpen, setMobileOpen }) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:flex">
        <SidebarContent view={view} setView={setView} weeklyPct={weeklyPct} weeklyHours={weeklyHours} weeklyTarget={weeklyTarget} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 h-full w-64 bg-white shadow-xl">
            <SidebarContent
              view={view}
              setView={setView}
              weeklyPct={weeklyPct}
              weeklyHours={weeklyHours}
              weeklyTarget={weeklyTarget}
              closeMobile={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  )
}