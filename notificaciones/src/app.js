import express from 'express'
import cookieParser from 'cookie-parser'
import routes from './routes/index.js'
import { asegurarTabla } from './config/db.js'
import { INSTANCIA } from './config/seguridad.js'

// Microservicio de notificaciones: una app Express independiente de la API principal.
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  res.set('X-Instancia', INSTANCIA) // para ver qué instancia respondió
  next()
})
app.use(async (req, res, next) => {
  await asegurarTabla()
  next()
})

// Todo el servicio cuelga de /notif (el gateway enruta /notif/* hacia aquí)
app.use('/notif', routes)

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Error en el servicio de notificaciones' })
})

export default app
