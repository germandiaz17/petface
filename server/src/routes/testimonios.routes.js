import { Router } from 'express'
import * as ctrl from '../controllers/testimonios.controller.js'
import { requireAuth, requireAdmin } from '../middlewares/auth.js'

const router = Router()

router.get('/', ctrl.listarAprobados)
router.get('/todos', requireAdmin, ctrl.listarTodos)
router.post('/', requireAuth, ctrl.crear)
router.patch('/:id', requireAdmin, ctrl.aprobar)
router.delete('/:id', requireAdmin, ctrl.eliminar)

export default router
