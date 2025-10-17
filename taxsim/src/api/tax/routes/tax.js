import taxController from "../controller/tax.js";
import {Router} from 'express'

const router = Router()

router.post('/', taxController.bulkCreate)

export default router