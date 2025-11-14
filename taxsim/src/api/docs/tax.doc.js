/**
 * @swagger
 * tags:
 *   name: Tax
 *   description: Operações relacionadas às taxas
 */

/**
 * @swagger
 * /api/taxes/{id}:
 *   put:
 *     summary: Atualiza uma taxa existente
 *     tags: [Tax]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da taxa
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *     responses:
 *       200:
 *         description: Taxa atualizada com sucesso
 *       404:
 *         description: Taxa não encontrada
 */

/**
 * @swagger
 * /api/taxes/{id}:
 *   delete:
 *     summary: Deleta uma taxa existente
 *     tags: [Tax]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da taxa
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Taxa deletada com sucesso
 *       404:
 *         description: Taxa não encontrada
 */

/**
 * @swagger
 * /api/taxes/{id}:
 *   get:
 *     summary: Retorna uma taxa pelo ID
 *     tags: [Tax]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da taxa
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Taxa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tax'
 *       404:
 *         description: Taxa não encontrada
 *       500:
 *         description: Erro ao buscar taxa
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tax:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         formulaId:
 *           type: integer
 *           example: 5
 *         initial:
 *           type: number
 *           example: 1000
 *         end:
 *           type: number
 *           example: 5000
 *         factor:
 *           type: number
 *           example: 5
 *         type:
 *           type: string
 *           enum: [Percent, Fixed]
 *           example: Percent
 *         value:
 *           type: number
 *           example: 0.15
 */

/**
 * @swagger
 * /api/taxes:
 *   post:
 *     summary: Cria uma nova taxa
 *     tags: [Tax]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formulaId:
 *                 type: integer
 *                 example: 5
 *               initial:
 *                 type: number
 *                 example: 1000
 *               end:
 *                 type: number
 *                 example: 5000
 *               factor:
 *                 type: number
 *                 example: 5
 *               type:
 *                 type: string
 *                 enum: [Percent, Fixed, Multiplier, Progressive, Regressive, Capped]
 *                 example: Percent
 *               applies:
 *                 type: string
 *                 enum: [gain, capital]
 *                 example: gain
 *     responses:
 *       201:
 *         description: Taxa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tax'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar taxa
 */
