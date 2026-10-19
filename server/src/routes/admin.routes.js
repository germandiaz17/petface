import { Router } from 'express'
import * as ctrl from '../controllers/admin.controller.js'
import { requireAdmin } from '../middlewares/auth.js'

const router = Router()

router.use(requireAdmin) // todo /api/admin es solo para administradores
router.get('/resumen', ctrl.resumen)

export default router
