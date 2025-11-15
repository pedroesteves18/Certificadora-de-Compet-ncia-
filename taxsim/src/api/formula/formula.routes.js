import formulaController from "./formula.controller.js";
import {Router} from 'express'
import {verifyToken} from '../auth/token.js'
const router = Router()

// Rota pública para a calculadora
router.post('/simulate_simple', formulaController.simulateSimple)

// --- Rotas Protegidas ---
// router.get('/', verifyToken, formulaController.getAllFormulasByUser) // <- Descomente esta linha
router.get('/:id', verifyToken, formulaController.getById)
router.post('/', verifyToken, formulaController.createFormula)
router.post('/process', verifyToken, formulaController.processFormulas)
router.delete('/:id', verifyToken, formulaController.deleteFormula)

// Rota GET /api/formulas (NOVA - para o dashboard)
// Deve vir DEPOIS de /simulate_simple e /process para evitar conflito de rota
router.get('/', verifyToken, formulaController.getAllFormulasByUser); 

export default router