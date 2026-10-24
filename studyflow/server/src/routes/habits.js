import { Router } from 'express'
import { pool } from '../db.js'
import { crudRouter, rowToJson } from './crud.js'

const router = Router()

// GET: habits with their completedDates array attached
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT h.*,
            COALESCE(array_agg(c.date ORDER BY c.date) FILTER (WHERE c.date IS NOT NULL), '{}') AS completed_dates
     FROM habits h
     LEFT JOIN habit_completions c ON c.habit_id = h.id
     WHERE h.user_id = $1
     GROUP BY h.id
     ORDER BY h.created_at DESC`,
    [req.userId],
  )
  res.json(rows.map(rowToJson))
})

// POST /:id/toggle  body: { date: '2026-08-22' } marks or unmarks that day
router.post('/:id/toggle', async (req, res) => {
  const { date } = req.body
  if (!date) return res.status(400).json({ error: 'date is required' })
  const owned = await pool.query('SELECT 1 FROM habits WHERE id = $1 AND user_id = $2', [req.params.id, req.userId])
  if (!owned.rowCount) return res.status(404).json({ error: 'Not found' })

  const removed = await pool.query('DELETE FROM habit_completions WHERE habit_id = $1 AND date = $2', [
    req.params.id,
    date,
  ])
  if (!removed.rowCount) {
    await pool.query('INSERT INTO habit_completions (habit_id, date) VALUES ($1, $2)', [req.params.id, date])
  }
  res.json({ completed: !removed.rowCount })
})

// create / update / delete reuse the generic router
router.use(crudRouter('habits', ['name', 'description', 'frequency', 'reminderTime', 'days']))

export default router