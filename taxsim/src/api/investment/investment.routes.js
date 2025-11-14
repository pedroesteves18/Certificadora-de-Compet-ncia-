import investmentController from "./investment.controller.js"

import { Router } from "express";
import { verifyToken } from "../auth/token.js";

const router = Router();

router.put("/:id", verifyToken, investmentController.putInvestment);
router.delete("/:id", verifyToken, investmentController.deleteInvestment);
router.get("/:id", verifyToken, investmentController.getInvestmentById);
router.post("/", verifyToken, investmentController.createInvestment);

export default router;