import Tax from './tax.model.js'
import bcrypt from 'bcrypt'


const taxService = {
    create: async (tax) => {
        return await Tax.create({
            initial: tax.initial,
            end: tax.end,
            factor: tax.factor,
            type: tax.type,
            formulaId: tax.formulaId

        })
    },
    bulkCreate: async (taxes) => {
        const validateIntervals = taxService.validateIntervals(taxes);
        if (!validateIntervals) {
            throw new Error('Tax intervals are overlapping');
        }
        return await Tax.bulkCreate(taxes)
    },
    findById: async (id) => {
        return await Tax.findByPk(id)
    },
    update: async (id, taxData) => {
        const tax = await Tax.findByPk(id)
        if (!tax) return null
        return await tax.update(taxData)
    },
    validateIntervals: (taxes) => {

        const sorted = taxes.slice().sort((a, b) => a.initial - b.initial);

        for (let i = 0; i < sorted.length - 1; i++) {
            const current = sorted[i];
            const next = sorted[i + 1];

            if (current.end > next.initial) {
            return false; 
            }
        }

        return true;
    }

}

export default taxService