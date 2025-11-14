/**
 * @swagger
 * tags:
 *   name: Formula
 *   description: Gerenciamento de fórmulas de investimento
 */

/**
 * @swagger
 * /api/formulas/{id}:
 *   get:
 *     summary: Retorna uma fórmula pelo ID ou os valores processados se informado firstMonth e lastMonth
 *     tags: [Formula]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da fórmula
 *       - in: query
 *         name: firstMonth
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: Mês inicial
 *       - in: query
 *         name: lastMonth
 *         schema:
 *           type: integer
 *           example: 12
 *         required: false
 *         description: Mês final
 *     responses:
 *       200:
 *         description: Fórmula encontrada ou dados processados retornados
 *         content:
 *           application/json:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   formula:
 *                     $ref: '#/components/schemas/Formula'
 *               - type: array
 *                 description: Dados processados da fórmula
 *                 items:
 *                   type: object
 *                   properties:
 *                     formulaId:
 *                       type: integer
 *                     formulaName:
 *                       type: string
 *                     initialAmount:
 *                       type: number
 *                       example: 10000
 *                     month:
 *                       type: integer
 *                       example: 1
 *                     beforeTax:
 *                       type: number
 *                       example: 10500
 *                     afterTax:
 *                       type: number
 *                       example: 10300
 *       400:
 *         description: Parâmetros inválidos (firstMonth/lastMonth)
 *       404:
 *         description: Fórmula não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/formulas:
 *   post:
 *     summary: Cria uma nova fórmula com investimento e taxas
 *     tags: [Formula]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formulaName
 *               - investment
 *             properties:
 *               formulaName:
 *                 type: string
 *                 example: "Renda Fixa"
 *               investment:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                     example: 1000
 *                   factor:
 *                     type: number
 *                     example: 1.05
 *                   type:
 *                     type: string
 *                     example: "Renda Fixa"
 *               taxes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     initial:
 *                       type: number
 *                       example: 0
 *                     end:
 *                       type: number
 *                       example: 12000
 *                     factor:
 *                       type: number
 *                       example: 5
 *                     type:
 *                       type: string
 *                       enum: [Percent, Fixed, Multiplier, Progressive, Regressive, Capped]
 *                     applies:
 *                       type: string
 *                       enum: [gain, capital]
 *     responses:
 *       200:
 *         description: Fórmula criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Fórmula criada!"
 *                 formula:
 *                   $ref: '#/components/schemas/Formula'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /api/formulas/process:
 *   post:
 *     summary: Processa uma ou mais fórmulas
 *     tags: [Formula]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "1,2,3"
 *         description: IDs das fórmulas separados por vírgula
 *       - in: query
 *         name: firstMonth
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: lastMonth
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Retorna os valores processados das fórmulas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 processedAmounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       formulaId:
 *                         type: integer
 *                       month:
 *                         type: integer
 *                       beforeTax:
 *                         type: number
 *                       afterTax:
 *                         type: number
 *       400:
 *         description: Parâmetros ausentes
 *       404:
 *         description: Fórmula não encontrada
 *       500:
 *         description: Erro interno
 */

/**
 * @swagger
 * /api/formulas/{id}:
 *   delete:
 *     summary: Deleta uma fórmula existente
 *     tags: [Formula]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da fórmula a ser deletada
 *     responses:
 *       200:
 *         description: Fórmula deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Fórmula deletada!"
 *                 formula:
 *                   $ref: '#/components/schemas/Formula'
 *       404:
 *         description: Fórmula não encontrada
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Formula:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *           example: "Renda Fixa"
 *         userId:
 *           type: integer
 *         Investments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 example: 1000
 *               factor:
 *                 type: number
 *                 example: 1.05
 *               type:
 *                 type: string
 *                 example: "Renda Fixa"
 *         Taxes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               initial:
 *                 type: number
 *               end:
 *                 type: number
 *               factor:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [Percent, Fixed, Multiplier, Progressive, Regressive, Capped]
 *               applies:
 *                 type: string
 *                 enum: [gain, capital]
 */
