import { Router } from 'express'
import * as ctrl from '../controllers/uploads.controller.js'
import { requireAdmin } from '../middlewares/auth.js'
import { subirFoto } from '../middlewares/subirFoto.js'

const router = Router()

// requireAdmin va antes de subirFoto: así ni siquiera se guarda el archivo si no es admin
router.post('/', requireAdmin, subirFoto, ctrl.subir)

export default router
