
import Investment from './investment.model.js'


const investmentService = {
    create: async (investment) => {
        return await Investment.create({
            amount: investment.amount,
            factor: investment.factor,
            type: investment.type,
            formulaId: investment.formulaId

        })
    },
    bulkCreate: async (investments) => {
        return await Investment.bulkCreate(investments)
    },
    findById: async (id) => {
        return await Investment.findByPk(id)
    },
    update: async (id, investmentData) => {
        const investment = await Investment.findByPk(id)
        if (!investment) return null
        return await investment.update(investmentData)
    },

}

export default investmentService