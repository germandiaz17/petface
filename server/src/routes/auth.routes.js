import { Router } from 'express'
import * as ctrl from '../controllers/auth.controller.js'
import { requireAuth } from '../middlewares/auth.js'

const router = Router()

router.post('/registro', ctrl.registro)
router.post('/login', ctrl.login)
router.post('/logout', ctrl.logout)
router.get('/me', requireAuth, ctrl.me)

export default router
