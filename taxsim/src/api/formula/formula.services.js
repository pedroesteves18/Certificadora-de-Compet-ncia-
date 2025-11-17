
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
            throw new Error('Tax intervals are not right');
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

        if (formulaData.investment) {
            formulaData.investment.formulaId = formula.id;
            await investmentService.create(formulaData.investment);
        }
        return await formulaService.findById(formula.id)

    },
    delete: async (id) => {
        const formula = await Formula.findByPk(id);
        if (!formula) return null;
        await formula.destroy();
        return formula;
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
    getFormulasByUser: async (userId) => {
        return await Formula.findAll({
            where: {
                userId: userId
            }
        })
    },
    processFormula: async (formula, firstMonth, lastMonth) => {
        firstMonth = parseInt(firstMonth);
        lastMonth = parseInt(lastMonth);
        let total = 0;
        const processed = {
            initialAmount: 0,
            values: []
        };

        const inv = formula.Investments[0];
        total = parseFloat(inv.amount);
        processed.initialAmount = total;
        let beforeTax 
        let gain 

        for (let i = 1; i <= lastMonth; i++) {
            if(total >=0){
                beforeTax = total * inv.factor;
                gain = beforeTax - total;
            } else {
                beforeTax = total
                gain = 0
            }

            let gainAfterTax = gain;
            let capitalAfterTax = total;

            for (const tax of formula.Taxes) {

                if (tax.applies === "gain") {
                    gainAfterTax = gainAfterTax > 0 ? taxProcessor.process(tax, gainAfterTax) : gainAfterTax
                }

                if (tax.applies === "capital") {
                    capitalAfterTax = taxProcessor.process(tax, capitalAfterTax);
                }
            }

            let afterTax = capitalAfterTax + gainAfterTax;
            total = afterTax;

            processed.values.push({
                month: i,
                beforeTax,
                afterTax
            });
        }

        const data = [
            {
                formulaId: formula.id,
                formulaName: formula.name,
                initialAmount: processed.initialAmount
            },
            ...processed.values.filter(
                entry => entry.month >= firstMonth && entry.month <= lastMonth
            )
        ];

        return data;
    },
    generateCSV: async (formulaId, firstMonth, lastMonth) => {
        const formulaToProcess = await formulaService.findById(formulaId);
        if (!formulaToProcess) throw new Error("Fórmula não encontrada!");

        const processedData = await formulaService.processFormula(
            formulaToProcess,
            firstMonth,
            lastMonth
        );

        // Cabeçalhos
        const headers = [
            'Mês',
            'Valor antes das taxas',
            'Tipo',
            'Aplicação',
            'Fator',
            'Início',
            'Fim',
            'Valor após as taxas'
        ];

        const rows = [];

        // processedData[0] é metadata da fórmula → pular
        console.log(processedData[0])
        rows.push([0,processedData[0].initialAmount,0,0,0,0,0,processedData[0].initialAmount])
        for (let i = 1; i < processedData.length; i++) {
            const data = processedData[i];
            for (const tax of formulaToProcess.Taxes) {
                rows.push([
                    data.month,
                    data.beforeTax.toFixed(2),
                    tax.type,
                    tax.applies,
                    tax.factor,
                    tax.initial,
                    tax.end,
                    data.afterTax.toFixed(2)
                ]);
            }
        }

        // Gera conteúdo CSV
        const csvContent =
            headers.join(";") +
            "\n" +
            rows.map(r => r.join(";")).join("\n");

        return csvContent;
    }

}

export default formulaService