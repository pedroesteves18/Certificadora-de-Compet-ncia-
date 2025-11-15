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
        await formula.destroy(); // Isso deve deletar em cascata
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
    // Nova função para buscar todas as fórmulas de um usuário
    findAllByUserId: async (userId) => {
        return await Formula.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Tax,
                    as: 'Taxes'
                },
                {
                    model: Investment,
                    as: 'Investments'
                }
            ],
            order: [['name', 'ASC']] // Ordena por nome
        });
    },
processFormula: async (formula, firstMonth, lastMonth) => {
    firstMonth = parseInt(firstMonth);
    lastMonth = parseInt(lastMonth);
    let total = 0;
    const processed = {
        initialAmount: 0,
        values: []
    };

    // Garante que Investments seja um array
    const investments = Array.isArray(formula.Investments) ? formula.Investments : (formula.Investments ? [formula.Investments] : []);
    const taxes = Array.isArray(formula.Taxes) ? formula.Taxes : (formula.Taxes ? [formula.Taxes] : []);


    // Pega o primeiro investimento (lógica atual)
    const inv = investments[0];
    if (!inv) {
         throw new Error("Fórmula não possui dados de investimento.");
    }

    total = parseFloat(inv.amount);
    processed.initialAmount = total;
    
    // Adiciona o ponto inicial (mês 0)
    processed.values.push({
            month: 0,
            beforeTax: total,
            afterTax: total
    });


    for (let i = 1; i <= lastMonth; i++) {
        let beforeTax = total;

        if (investments.length > 0) {
            for (const investmentItem of investments) {
                beforeTax *= parseFloat(investmentItem.factor);
            }
        }
        let gain = beforeTax - total;
        let afterTax = total + gain;

        if (taxes.length > 0) {
            for (const tax of taxes) {
                let baseAmount;
                if (tax.applies === "capital") {
                    baseAmount = afterTax;
                } else {
                    // Aplica sobre o ganho (lucro)
                    baseAmount = afterTax - total;
                }

                const taxedValue = taxProcessor.process(tax, baseAmount);

                if (tax.applies === "capital") {
                    afterTax = taxedValue;
                } else {
                    // O valor taxado é o ganho líquido, então somamos ao 'total' anterior
                    afterTax = total + taxedValue;
                }
            }
        }

        total = afterTax;

        processed.values.push({
            month: i,
            beforeTax: parseFloat(beforeTax.toFixed(2)),
            afterTax: parseFloat(afterTax.toFixed(2))
        });
    }
    
    const data = {
        formulaId: formula.id,
        formulaName: formula.name,
        initialAmount: processed.initialAmount,
        // Filtra os meses (incluindo o mês 0 se firstMonth for 1)
        data: processed.values.filter(
            entry => entry.month >= firstMonth - 1 && entry.month <= lastMonth
        )
    };

    return data;
}


}

export default formulaService