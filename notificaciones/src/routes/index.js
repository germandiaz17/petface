import { Router } from 'express'
import * as eventos from '../controllers/eventos.controller.js'
import * as notificaciones from '../controllers/notificaciones.controller.js'
import { requireAuth, requireClaveInterna } from '../middlewares/auth.js'

const router = Router()

router.get('/health', notificaciones.salud)
router.post('/eventos', requireClaveInterna, eventos.recibir) // API → microservicio
router.get('/notificaciones', requireAuth, notificaciones.listar) // navegador → microservicio
router.patch('/notificaciones/leidas', requireAuth, notificaciones.marcarLeidas)

export default router
