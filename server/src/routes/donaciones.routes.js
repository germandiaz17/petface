import { Router } from 'express'
import * as ctrl from '../controllers/donaciones.controller.js'
import { requireAdmin } from '../middlewares/auth.js'

const router = Router()

router.post('/', ctrl.crear)
router.get('/', requireAdmin, ctrl.listar)

export default router
