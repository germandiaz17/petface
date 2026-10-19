import { Router } from 'express'
import healthRoutes from './health.routes.js'
import mascotasRoutes from './mascotas.routes.js'
import solicitudesRoutes from './solicitudes.routes.js'
import donacionesRoutes from './donaciones.routes.js'
import testimoniosRoutes from './testimonios.routes.js'
import adminRoutes from './admin.routes.js'

// Router principal: cada recurso tiene su archivo de rutas.
const router = Router()

router.use('/health', healthRoutes)
router.use('/mascotas', mascotasRoutes)
router.use('/solicitudes', solicitudesRoutes)
router.use('/donaciones', donacionesRoutes)
router.use('/testimonios', testimoniosRoutes)
router.use('/admin', adminRoutes)

export default router
