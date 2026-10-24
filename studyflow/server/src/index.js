import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import habitRoutes from './routes/habits.js'
import { crudRouter } from './routes/crud.js'
import { requireAuth } from './middleware/auth.js'

const app = express()
app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)

app.use('/api/tasks', requireAuth, crudRouter('tasks', ['title', 'description', 'subject', 'priority', 'dueDate', 'completed']))
app.use('/api/goals', requireAuth, crudRouter('goals', ['title', 'description', 'current', 'target', 'deadline', 'completed']))
app.use('/api/notes', requireAuth, crudRouter('notes', ['title', 'content', 'pinned'], { hasUpdatedAt: true }))
app.use('/api/habits', requireAuth, habitRoutes)
app.use('/api/timetable', requireAuth, crudRouter('timetable_slots', ['subject', 'days', 'startTime', 'endTime', 'location', 'instructor', 'color']))
app.use('/api/events', requireAuth, crudRouter('calendar_events', ['date', 'title', 'time', 'type', 'notes']))

app.listen(process.env.PORT, () => console.log(`API running on http://localhost:${process.env.PORT}`))