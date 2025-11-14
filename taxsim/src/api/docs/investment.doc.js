/**
 * @swagger
 * tags:
 *   name: Investment
 *   description: Operações relacionadas a investimentos
 */

/**
 * @swagger
 * /api/investments/{id}:
 *   get:
 *     summary: Retorna um investimento pelo ID
 *     tags: [Investment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do investimento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Investimento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Investment'
 *       404:
 *         description: Investimento não encontrado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /api/investments/{id}:
 *   put:
 *     summary: Atualiza um investimento existente
 *     tags: [Investment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do investimento
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tesouro Direto"
 *               amount:
 *                 type: number
 *                 example: 1500
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-12"
 *               type:
 *                 type: string
 *                 enum: [Ação, Fundo Imobiliário, Renda Fixa, Criptomoeda]
 *     responses:
 *       200:
 *         description: Investimento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Investimento atualizado com sucesso"
 *                 updatedInvestment:
 *                   $ref: '#/components/schemas/Investment'
 *       404:
 *         description: Investimento não encontrado
 *       500:
 *         description: Erro ao atualizar investimento
 */

/**
 * @swagger
 * /api/investments/{id}:
 *   delete:
 *     summary: Deleta um investimento pelo ID
 *     tags: [Investment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do investimento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Investimento deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Investimento deletado com sucesso"
 *       404:
 *         description: Investimento não encontrado
 *       500:
 *         description: Erro ao deletar investimento
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Investment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "CDB Banco Inter"
 *         amount:
 *           type: number
 *           example: 2000
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-11-12"
 *         type:
 *           type: string
 *           enum: [Ação, Fundo Imobiliário, Renda Fixa, Criptomoeda]
 */

/**
 * @swagger
 * /api/investments:
 *   post:
 *     summary: Cria um novo investimento
 *     tags: [Investment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tesouro Selic 2027"
 *               amount:
 *                 type: number
 *                 example: 1200
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-20"
 *               type:
 *                 type: string
 *                 enum: [Ação, Fundo Imobiliário, Renda Fixa, Criptomoeda]
 *     responses:
 *       201:
 *         description: Investimento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Investment'
 *       400:
 *         description: Dados inválidos enviados
 *       500:
 *         description: Erro ao criar investimento
 */