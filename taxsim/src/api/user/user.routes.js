import userController from './user.controller.js'
import {verifyToken} from '../auth/token.js'
import { Router } from 'express'
const router = Router()

router.post('/', userController.create)
router.post('/login', userController.login)
router.get('/', verifyToken, userController.getUser)
router.put('/', verifyToken, userController.update)
router.delete('/', verifyToken, userController.delete)
export default router