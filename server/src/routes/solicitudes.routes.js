import { Router } from 'express'
import * as ctrl from '../controllers/solicitudes.controller.js'
import { requireAuth, requireAdmin } from '../middlewares/auth.js'

const router = Router()

router.post('/', requireAuth, ctrl.crear)
router.get('/mias', requireAuth, ctrl.mias)
router.delete('/:id', requireAuth, ctrl.cancelar)
router.get('/', requireAdmin, ctrl.listar)
router.patch('/:id', requireAdmin, ctrl.cambiarEstado)

export default router
