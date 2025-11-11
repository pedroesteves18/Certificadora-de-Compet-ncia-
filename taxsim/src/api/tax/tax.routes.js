import taxController from "./tax.controller.js";
import {verifyToken} from '../auth/token.js'
import {Router} from 'express'

const router = Router()

router.post('/', verifyToken, taxController.bulkCreate)
router.put('/:id', verifyToken, taxController.update)
export default router