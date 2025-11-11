
import Formula from "./formula.model.js"
import Tax from "../tax/tax.model.js";
import taxProcessor from "../utils/taxProcessor.js";
import init from "module-alias";
import { type } from "os";

const formulaService = {
    create: async (formulaData) => {
        return await Formula.create({
            name: formulaData.name,
            userId: formulaData.userId
        })
    },
    findById: async (id) => {
        return await Formula.findByPk(id,{
            include: [
                {
                    model: Tax,
                    as: 'Taxes'
                }
            ]
        })
    },
    processFormula: async (formula, amount) => {
        let result = amount
        const processedFormula = []
        let i = 0
        for (const tax of formula.Taxes) {
            result = taxProcessor.process(tax, result);
            processedFormula[i] = {
                initial: tax.initial,
                end: tax.end,
                factor: tax.factor,
                type: tax.type,
                value: result
            }
            i++;
        }
        return processedFormula;
    },
}

export default formulaService