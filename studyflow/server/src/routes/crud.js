import { Router } from 'express'
import { pool } from '../db.js'

const toSnake = (s) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
const toCamel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())

export function rowToJson(row) {
  const out = {}
  for (const [k, v] of Object.entries(row)) out[toCamel(k)] = v
  return out
}

// table: DB table name (hard-coded by us, never from user input)
// fields: whitelist of camelCase fields the client is allowed to set
export function crudRouter(table, fields, { hasUpdatedAt = false } = {}) {
  const router = Router()

  function pickFields(body) {
    return fields.filter((f) => body[f] !== undefined)
  }

  router.get('/', async (req, res) => {
    const { rows } = await pool.query(`SELECT * FROM ${table} WHERE user_id = $1 ORDER BY id DESC`, [req.userId])
    res.json(rows.map(rowToJson))
  })

  router.post('/', async (req, res) => {
    const keys = pickFields(req.body)
    if (keys.length === 0) return res.status(400).json({ error: 'No valid fields provided' })
    const cols = keys.map(toSnake)
    const placeholders = keys.map((_, i) => `$${i + 2}`)
    try {
      const { rows } = await pool.query(
        `INSERT INTO ${table} (user_id, ${cols.join(', ')}) VALUES ($1, ${placeholders.join(', ')}) RETURNING *`,
        [req.userId, ...keys.map((k) => req.body[k])],
      )
      res.status(201).json(rowToJson(rows[0]))
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Invalid data' })
    }
  })

  router.patch('/:id', async (req, res) => {
    const keys = pickFields(req.body)
    if (keys.length === 0) return res.status(400).json({ error: 'No valid fields provided' })
    const sets = keys.map((k, i) => `${toSnake(k)} = $${i + 3}`)
    if (hasUpdatedAt) sets.push('updated_at = now()')
    try {
      const { rows } = await pool.query(
        `UPDATE ${table} SET ${sets.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING *`,
        [req.params.id, req.userId, ...keys.map((k) => req.body[k])],
      )
      if (!rows[0]) return res.status(404).json({ error: 'Not found' })
      res.json(rowToJson(rows[0]))
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'Invalid data' })
    }
  })

  router.delete('/:id', async (req, res) => {
    const { rowCount } = await pool.query(`DELETE FROM ${table} WHERE id = $1 AND user_id = $2`, [
      req.params.id,
      req.userId,
    ])
    if (!rowCount) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  })

  return router
}