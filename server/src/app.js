import express from 'express'
import cookieParser from 'cookie-parser'
import routes from './routes/index.js'
import { cargarUsuario } from './middlewares/auth.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { UPLOADS_DIR, UPLOADS_URL } from './config/uploads.js'

const app = express()

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
