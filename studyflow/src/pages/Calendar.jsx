import useCalendar from '../hooks/useCalendar'
import CalendarView from '../components/CalendarView'

export default function Calendar() {
    const { eventsForDate } = useCalendar()
    const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' 
    })
    return (
    <div>
      <p className="text-sm text-slate-400">{todayLabel}</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Calendar</h1>
      <p className="mt-1 text-slate-500">Keep your calendar organized and moving forward.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <CalendarView eventsForDate={eventsForDate} />
      </div>
    </div>
  )
}
