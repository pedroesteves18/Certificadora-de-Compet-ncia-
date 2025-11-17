import formulaController from "./formula.controller.js";
import {Router} from 'express'
import {verifyToken} from '../auth/token.js'
import upload from "../utils/csvReader.js";

const router = Router()

router.get('/:id', verifyToken, formulaController.getById)
router.get('/', verifyToken, formulaController.getFormulas)
router.post('/', verifyToken, formulaController.createFormula)
router.post('/process', verifyToken, formulaController.processFormulas)
router.delete('/:id', verifyToken, formulaController.deleteFormula)
router.get('/csv/:id', verifyToken, formulaController.generateCSV)
export default router