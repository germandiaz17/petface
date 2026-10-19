import crypto from 'node:crypto'
import express from 'express'
import cookieParser from 'cookie-parser'
import routes from './routes/index.js'
import { cargarUsuario } from './middlewares/auth.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { UPLOADS_DIR, UPLOADS_URL } from './config/uploads.js'

const app = express()

// Nombre de esta réplica (en Docker: api-1, api-2). Se devuelve en cada respuesta
// para poder ver qué réplica atendió la petición.
// Fuera de Docker se genera un nombre aleatorio por proceso (en Vercel: uno por instancia de la función).
export const INSTANCIA = process.env.INSTANCIA ?? `${process.env.VERCEL ? 'vercel' : 'local'}-${crypto.randomUUID().slice(0, 6)}`
app.use((req, res, next) => {
  res.set('X-Instancia', INSTANCIA)
  next()
})

app.use(express.json())
app.use(cookieParser())
app.use(cargarUsuario) // deja req.user si hay sesión

// Fotos subidas desde el admin (públicas)
app.use(UPLOADS_URL, express.static(UPLOADS_DIR, { maxAge: '7d' }))

// Todas las rutas de la API cuelgan de /api
app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
