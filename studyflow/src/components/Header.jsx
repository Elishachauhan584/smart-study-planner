import { Menu } from 'lucide-react'

export default function Header({ onOpenMobile }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-8">
      <button onClick={onOpenMobile} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden">
        <Menu size={20} />
      </button>
      <span className="text-sm text-slate-400 md:hidden">Study Planner</span>
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <div className="text-sm font-semibold text-slate-800">Smart Study Planner</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
          SP
        </div>
      </div>
    </header>
  )
}