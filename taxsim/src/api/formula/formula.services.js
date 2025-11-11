
import Formula from "./formula.model.js"
import Tax from "../tax/tax.model.js";
import Investment from "../investment/investment.model.js";
import taxProcessor from "../utils/taxProcessor.js";
import investmentService from "../investment/investment.services.js";
import taxService from "../tax/tax.services.js";
const formulaService = {
    create: async (formulaData) => {
        const isTaxesValid = taxService.validateIntervals(formulaData.taxes || []);
        if (!isTaxesValid) {
            throw new Error('Tax intervals are overlapping');
        }
        let formula = await Formula.create({
            name: formulaData.name,
            userId: formulaData.userId
        })
        if (formulaData.taxes && formulaData.taxes.length > 0) {
            for (let tax of formulaData.taxes) {
                tax.formulaId = formula.id
            }
            await taxService.bulkCreate(formulaData.taxes);
        }
        if (formulaData.investments && formulaData.investments.length > 0) {
            for (let investment of formulaData.investments) {
                investment.formulaId = formula.id
            }
            await investmentService.bulkCreate(formulaData.investments);
        }
        return await formulaService.findById(formula.id)

    },
    
    findById: async (id) => {
        return await Formula.findByPk(id,{
            include: [
                {
                    model: Tax,
                    as: 'Taxes'
                },
                {
                    model: Investment,
                    as: 'Investments'
                }
            ]
        })
    },
    processFormula: async (formula,firstMonth, lastMonth) => {
        let total = 0;
        let months = 12
        const processed = {
            initialAmount: 0,
            values: []
        };

        if (formula.Investments?.length > 0) {
            for (const inv of formula.Investments) {
                total += parseFloat(inv.amount);
            }
            processed.initialAmount = total;
        }

        for (let i = 1; i <= months; i++) {
            if (formula.Investments?.length > 0) {
                for (const inv of formula.Investments) {
                    const monthlyFactor = parseFloat(inv.factor) / 100;
                    total *= (1 + monthlyFactor);
                }
            }

            const totalBeforeTax = total;
            if (formula.Taxes?.length > 0) {
                for (const tax of formula.Taxes) {
                    total = taxProcessor.process(tax , total);
                }
            }
            const totalAfterTax = total;

            processed.values.push({
                month: i,
                beforeTax: totalBeforeTax,
                afterTax: totalAfterTax
            });
        }
        const data = [];
        for(const entry of processed.values){
            if((entry.month >= firstMonth) && (lastMonth && entry.month <= lastMonth)){
                data.push(entry)
            }
        }
        return data;
    }


}

export default formulaService