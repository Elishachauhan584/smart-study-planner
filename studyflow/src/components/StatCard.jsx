import { cx } from '../utils/helpers'

const TONES = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  orange: 'bg-orange-50 text-orange-600',
  amber: 'bg-amber-50 text-amber-600',
}

export default function StatCard({ label, value, sub, icon: Icon, tone = 'indigo' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span className={cx('rounded-lg p-2', TONES[tone])}>
          <Icon size={16} />
        </span>
      </div>
      <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
    </div>
  )
}