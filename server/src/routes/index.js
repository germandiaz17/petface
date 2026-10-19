import { Router } from 'express'
import healthRoutes from './health.routes.js'

// Router principal: aquí se registran las rutas de cada recurso
// (mascotas, auth, solicitudes...) a medida que se crean.
const router = Router()

router.use('/health', healthRoutes)

export default router
