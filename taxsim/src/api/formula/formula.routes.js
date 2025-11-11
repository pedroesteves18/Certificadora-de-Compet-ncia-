import formulaController from "./formula.controller.js";
import {Router} from 'express'
import {verifyToken} from '../auth/token.js'
const router = Router()

router.get('/:id', verifyToken, formulaController.getById)
router.post('/:id/process', verifyToken, formulaController.processFormula)
export default router