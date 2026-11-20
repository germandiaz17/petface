import { Router } from 'express'
import * as ctrl from '../controllers/mascotas.controller.js'
import { requireAdmin } from '../middlewares/auth.js'

const router = Router()

router.get('/', ctrl.listar)
router.get('/eventos', ctrl.eventos) // antes de '/:id' para que "eventos" no se lea como un id
router.get('/:id', ctrl.obtener)
router.post('/', requireAdmin, ctrl.crear)
router.put('/:id', requireAdmin, ctrl.actualizar)
router.delete('/:id', requireAdmin, ctrl.eliminar)

export default router
