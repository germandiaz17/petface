import * as Health from '../models/health.model.js'

// GET /api/health → confirma que la API y la base de datos responden
export async function getHealth(req, res) {
  try {
    const db = await Health.check()
    res.json({ api: 'ok', db: 'ok', instancia: res.get('X-Instancia'), ...db })
  } catch (err) {
    res.status(503).json({ api: 'ok', db: 'error', error: err.message || err.code || 'No se pudo conectar a la base de datos' })
  }
}
