import userController from '../controller/user.js'
import { Router } from 'express'
const router = Router()

router.post('/', userController.create)


export default router