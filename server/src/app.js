import express from 'express'
import routes from './routes/index.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(express.json())

// Todas las rutas de la API cuelgan de /api
app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
