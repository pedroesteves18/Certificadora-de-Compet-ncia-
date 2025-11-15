import formulaController from "./formula.controller.js";
import {Router} from 'express'
import {verifyToken} from '../auth/token.js'
const router = Router()

router.get('/:id', verifyToken, formulaController.getById)
router.post('/', verifyToken, formulaController.createFormula)
router.post('/process', verifyToken, formulaController.processFormulas)
router.delete('/:id', verifyToken, formulaController.deleteFormula)

// Rota pública para a calculadora
router.post('/simulate_simple', formulaController.simulateSimple)

export default router