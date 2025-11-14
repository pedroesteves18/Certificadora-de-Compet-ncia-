
import {Router} from 'express'
import { verifyToken } from '../auth/token.js'
import taxController from './tax.controller.js'
const router = Router()

router.put('/:id', verifyToken, taxController.updateTax)
router.delete('/:id', verifyToken, taxController.deleteTax)
router.get('/:id', verifyToken, taxController.getTaxById)
router.post('/', verifyToken, taxController.createTax)

export default router