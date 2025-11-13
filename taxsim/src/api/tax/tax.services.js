import Tax from './tax.model.js'


const taxService = {
    create: async (tax) => {
        return await Tax.create({
            initial: tax.initial,
            end: tax.end,
            factor: tax.factor,
            type: tax.type,
            applies: tax.applies,
            formulaId: tax.formulaId

        })
    },
    bulkCreate: async (taxes) => {
        const validateIntervals = taxService.validateIntervals(taxes);
        if (!validateIntervals) {
            throw new Error('Tax intervals are not right');
        }
        return await Tax.bulkCreate(taxes)
    },
    findById: async (id) => {
        return await Tax.findByPk(id)
    },
    update: async (id, taxData) => {
        const tax = await Tax.findByPk(id)
        const isValid = taxService.validateIntervals([taxData]);
        if (!isValid) {
            throw new Error('Tax intervals are not right');
        }
        if (!tax) return null
        return await tax.update(taxData)
    },
    delete: async (id) => {
        const tax = await Tax.findByPk(id)
        if (!tax) return null
        await tax.destroy()
        return tax
    },
    validateIntervals: (taxes) => {

        for(const tax of taxes){
            if (tax.initial == null || tax.end == null) continue
            if (tax.initial > tax.end) return false;
        }

        return true;
    },

}

export default taxService