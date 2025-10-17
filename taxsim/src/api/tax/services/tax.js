import Tax from '../model/tax.js'
import bcrypt from 'bcrypt'


const taxService = {
    create: async (tax) => {
        return await Tax.create({
            initial: tax.initial,
            end: tax.end,
            factor: tax.factor,
            type: tax.type

        })
    },
    findById: async (tax) => {
        return await Tax.findByPk(tax.id)
    }
}

export default taxService