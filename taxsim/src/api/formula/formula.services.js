
import Formula from "./formula.model.js"
import Tax from "../tax/tax.model.js";
import Investment from "../investment/investment.model.js";
import taxProcessor from "../utils/taxProcessor.js";
import investmentService from "../investment/investment.services.js";
import taxService from "../tax/tax.services.js";

const formulaService = {
create: async (formulaData) => {

    const formula = await Formula.create({
        name: formulaData.name,
        userId: formulaData.userId
    });

    // garante que o array de taxas exista
    formulaData.taxes = formulaData.taxes || [];

    // adiciona IOF se solicitado
    if (formulaData.iof === true) {
            formulaData.taxes = [{
                name: "IOF",
                mode: "percent",
                value: 0,  
                appliesTo: "profit",
                formulaId: formula.id
            }, ...formulaData.taxes
        ]
    }

    // define formulaId para todas as taxas
    for (let tax of formulaData.taxes) {
        tax.formulaId = formula.id;
    }

    // cria todas as taxas no banco, inclusive IOF
    if (formulaData.taxes.length > 0) {
        await taxService.bulkCreate(formulaData.taxes);
    }

    // cria investimento
    if (formulaData.investment) {
        const inv = formulaData.investment;

        const investmentClean = {
            amount: inv.amount,
            type: inv.type,
            interestRate: inv.interestRate ?? null,
            interestRateType: inv.interestRateType ?? null,
            startDate: inv.startDate,
            endDate: inv.endDate ?? null,
            formulaId: formula.id
        };

        await investmentService.create(investmentClean);
    }

    return await formulaService.findById(formula.id);
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
            },
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

getAutomaticTaxes: (inv, day) => {
    const taxes = [];

    // ---- REGRAS POR TIPO ----
    switch (inv.type) {

        // ---------------------- RENDA FIXA ----------------------
        case "RendaFixa":
            // IOF somente nos 30 primeiros dias (tabela regressiva)
            if (day <= 30) {
                const iofPercent = (30 - day) / 30 * 100; // 100% no dia 1, 0% no dia 30
                taxes.push({
                    name: "IOF",
                    appliesTo: "profit",
                    mode: "percent",
                    value: iofPercent
                });
            }

            // IR regressivo
            let aliquotaIR = 22.5;
            if (day > 360) aliquotaIR = 15;
            else if (day > 180) aliquotaIR = 17.5;
            else if (day > 60) aliquotaIR = 20;

            taxes.push({
                name: "IR",
                appliesTo: "profit",
                mode: "percent",
                value: aliquotaIR
            });

            break;

        // ---------------------- AÇÃO ----------------------
        case "Acao":
            taxes.push({
                name: "IR Ações",
                appliesTo: "profit",
                mode: "percent",
                value: 15
            });
            break;

        // ---------------------- CRIPTO ----------------------
        case "Cripto":
            taxes.push({
                name: "IR Cripto",
                appliesTo: "profit",
                mode: "percent",
                value: 15
            });
            break;
        case "Cambio":
            if (inv.isSpot) { // câmbio à vista
                // IOF sobre valor investido (percentual fixo, ex: 1,1%)
                taxes.push({
                    name: "IOF",
                    appliesTo: "investment",
                    mode: "percent",
                    value: 1.1
                });
            }
            // IR sobre lucro (valores diários ou ganhos de capital)
            taxes.push({
                name: "IR Cambio",
                appliesTo: "profit",
                mode: "percent",
                value: 15
            });
            break;
    }

    return taxes;
},


processCripto: (formula, firstDay, lastDay) => {
    const inv = formula.Investments[0];
    let initialAmount = inv.amount;
    let netTotal = initialAmount;
    let grossProfitTotal = 0;
    let totalTaxesPaid = 0;
    const dailyResults = [];

    // Verifica se existe corretagem
    let startingFee = 0;
    let endingFee = 0;
    const corretagem = formula.Taxes.find(t => t.name === "Corretagem");
    if (corretagem) {
        startingFee = taxProcessor.process(corretagem, initialAmount).tax;
        totalTaxesPaid += startingFee;
        netTotal -= startingFee;
    }

    const randomCryptoOscillation = (currentPrice) => {
        const variation = Math.random() * 10 - 5
        return { newPrice: currentPrice * (1 + variation / 100), variationPercent: variation }
    };

    for (let day = 1; day <= lastDay; day++) {
        const { newPrice, variationPercent } = randomCryptoOscillation(netTotal)
        const dailyProfit = netTotal * (variationPercent / 100)
        let profitAfterTax = dailyProfit

        const taxesApplied = [];
        const autoTaxes = formulaService.getAutomaticTaxes(inv, day)

        for (const tax of autoTaxes.filter(t => t.appliesTo === "profit")) {
            const taxRes = taxProcessor.process(tax, profitAfterTax);
            taxesApplied.push({
                name: tax.name,
                rate: tax.value,
                taxAmount: Number(taxRes.tax.toFixed(2))
            });
            profitAfterTax = taxRes.after;
        }

        const taxesToday = dailyProfit - profitAfterTax;

        grossProfitTotal += dailyProfit;
        totalTaxesPaid += taxesToday;
        netTotal += profitAfterTax;

        dailyResults.push({
            day,
            dailyProfit: Number(dailyProfit.toFixed(2)),
            taxesApplied,
            taxesToday: Number(taxesToday.toFixed(2)),
            grossProfitTotal: Number(grossProfitTotal.toFixed(2)),
            totalTaxesPaid: Number(totalTaxesPaid.toFixed(2)),
            netTotal: Number(netTotal.toFixed(2)),
            price: Number(newPrice.toFixed(2)),
            variationPercent: Number(variationPercent.toFixed(2))
        });
    }

    // Taxa de saída
    if (corretagem) {
        endingFee = taxProcessor.process(corretagem, netTotal).tax;
        totalTaxesPaid += endingFee;
        netTotal -= endingFee;
    }

    return {
        formulaId: formula.id,
        formulaName: formula.name,
        initialAmount,
        startingFee: corretagem ? Number(startingFee.toFixed(2)) : undefined,
        endingFee: corretagem ? Number(endingFee.toFixed(2)) : undefined,
        grossTotal: Number((initialAmount + grossProfitTotal).toFixed(2)),
        totalTaxesPaid: Number(totalTaxesPaid.toFixed(2)),
        netTotal: Number(netTotal.toFixed(2)),
        totalValue: Number(netTotal.toFixed(2)),
        dailyResults
    };
},





processRendaFixa: (formula, firstDay, lastDay) => {
    const inv = formula.Investments[0];
    let initialAmount = Number(inv.amount);
    let netTotal = initialAmount;
    let grossProfitTotal = 0;
    let totalTaxesPaid = 0;
    const dailyResults = [];

    let dailyRate = 0;
    if (inv.interestRateType === "percent") {
        dailyRate = Math.pow(1 + inv.interestRate / 100, 1 / 365) - 1;
    } else if (inv.interestRateType === "currency") {
        dailyRate = Number(inv.interestRate);
    }

    for (let day = 1; day <= lastDay; day++) {
        const dailyProfit = netTotal * dailyRate;
        let profitAfterTax = dailyProfit;

        const taxesApplied = [];
        const autoTaxes = formulaService.getAutomaticTaxes(inv, day);

        for (const tax of autoTaxes.filter(t => t.appliesTo === "profit")) {
            const taxRes = taxProcessor.process(tax, profitAfterTax);
            taxesApplied.push({
                name: tax.name,
                rate: tax.value,
                taxAmount: Number(taxRes.tax.toFixed(2))
            });
            profitAfterTax = taxRes.after;
        }

        const taxesToday = dailyProfit - profitAfterTax;
        totalTaxesPaid += taxesToday;
        grossProfitTotal += dailyProfit;
        netTotal += profitAfterTax;

        dailyResults.push({
            day,
            dailyProfit: Number(dailyProfit.toFixed(2)),
            taxesApplied,
            taxesToday: Number(taxesToday.toFixed(2)),
            grossProfitTotal: Number(grossProfitTotal.toFixed(2)),
            totalTaxesPaid: Number(totalTaxesPaid.toFixed(2)),
            netTotal: Number(netTotal.toFixed(2))
        });
    }

    return {
        formulaId: formula.id,
        formulaName: formula.name,
        initialAmount,
        grossTotal: Number((initialAmount + grossProfitTotal).toFixed(2)), // bruto acumulado
        totalTaxesPaid: Number(totalTaxesPaid.toFixed(2)),
        netTotal: Number(netTotal.toFixed(2)), // já líquido acumulado
        totalValue: Number(netTotal.toFixed(2)), // sem somar o initialAmount de novo
        dailyResults
    };

},
processAcao: (formula, firstDay, lastDay) => {
    const inv = formula.Investments[0];
    let initialAmount = Number(inv.amount);
    let price = initialAmount;

    let totalTaxesPaid = 0; 
    let grossProfitTotal = 0;

    const dailyResults = [];

    // Corretagem
    let startingFee = 0;
    let endingFee = 0;
    const corretagem = formula.Taxes.find(t => t.name === "Corretagem");
    if (corretagem) {
        startingFee = taxProcessor.process(corretagem, initialAmount).tax;
        endingFee = taxProcessor.process(corretagem, initialAmount).tax;
        price -= startingFee;
        totalTaxesPaid += startingFee;
    }

    const randomStockOscillation = (currentPrice) => {
        const variation = Math.random() * 6 - 3; // -3% a +3%
        return { 
            newPrice: currentPrice * (1 + variation / 100), 
            variationPercent: variation 
        };
    };

    for (let day = 1; day <= lastDay; day++) {
        const { newPrice, variationPercent } = randomStockOscillation(price);
        price = newPrice;

        const valuation = price - initialAmount; // lucro real em relação ao inicial
        let dailyProfit = valuation - grossProfitTotal;
        grossProfitTotal = valuation;

        // IR só se houver lucro acima do inicial
        let taxesApplied = [];
        let taxesToday = 0;
        if (valuation > 0) {
            const irAmount = dailyProfit * 0.15;
            taxesApplied.push({ name: "IR Acao", rate: 15, taxAmount: Number(irAmount.toFixed(2)) });
            taxesToday = irAmount;
            totalTaxesPaid += irAmount;
            dailyProfit -= irAmount;
        }

        const netTotal = initialAmount + grossProfitTotal - totalTaxesPaid + startingFee - endingFee;

        dailyResults.push({
            day,
            dailyProfit: Number(dailyProfit.toFixed(2)),
            taxesApplied,
            taxesToday: Number(taxesToday.toFixed(2)),
            grossProfitTotal: Number(grossProfitTotal.toFixed(2)),
            totalTaxesPaid: Number(totalTaxesPaid.toFixed(2)),
            netTotal: Number(price - totalTaxesPaid).toFixed(2),
            price: Number(price.toFixed(2)),
            variationPercent: Number(variationPercent.toFixed(2))
        });
    }

    return {
        formulaId: formula.id,
        formulaName: formula.name,
        initialAmount,
        startingFee: Number(startingFee.toFixed(2)),
        endingFee: Number(endingFee.toFixed(2)),
        grossTotal: Number((initialAmount + grossProfitTotal).toFixed(2)),
        totalTaxesPaid: Number(totalTaxesPaid.toFixed(2)),
        netTotal: Number(price - totalTaxesPaid).toFixed(2),
        totalValue: Number(price - totalTaxesPaid).toFixed(2),
        dailyResults
    };
},



processCambio: (formula, firstDay, lastDay) => {
    const inv = formula.Investments[0];
    
    let initialAmount = Number(inv.amount);
    let netTotal = initialAmount;
    let grossProfitTotal = 0;
    let totalTaxesPaid = 0;

    const dailyResults = [];

    // Obtem taxa de corretagem (se existir)
    let startingFee = 0;
    let endingFee = 0;
    const corretagem = formula.Taxes.find(t => t.name === "Corretagem");
    if (corretagem) {
        startingFee = taxProcessor.process(corretagem, initialAmount).tax;
        endingFee = taxProcessor.process(corretagem, initialAmount).tax;
        netTotal -= startingFee; // desconto no início
        totalTaxesPaid += startingFee;
    }

    const dailyOscillation = (currentAmount) => {
        const variationPercent = (Math.random() * 2 - 1); 
        return { 
            newAmount: currentAmount * (1 + variationPercent / 100), 
            variationPercent 
        };
    };

    for (let day = 1; day <= lastDay; day++) {
        const { newAmount, variationPercent } = dailyOscillation(netTotal);
        
        const dailyProfit = newAmount - netTotal;
        let profitAfterTax = dailyProfit;

        const taxesApplied = [];
        const autoTaxes = formulaService.getAutomaticTaxes(inv, day);

        for (const tax of autoTaxes) {
            if (tax.appliesTo === "investment") {
                const taxRes = taxProcessor.process(tax, dailyProfit, day);
                profitAfterTax -= taxRes.tax;
                taxesApplied.push({
                    name: tax.name,
                    rate: tax.value,
                    taxAmount: Number(taxRes.tax.toFixed(2))
                });
            }
            if (tax.appliesTo === "profit") {
                // só aplica IR se netTotal líquido até agora for maior que o investimento inicial
                const lucroLiquido = netTotal - initialAmount;
                if (lucroLiquido > 0) {
                    const taxRes = taxProcessor.process(tax, profitAfterTax, day);
                    profitAfterTax = taxRes.after;
                    taxesApplied.push({
                        name: tax.name,
                        rate: tax.value,
                        taxAmount: Number(taxRes.tax.toFixed(2))
                    });
                }
            }
        }

        const taxesToday = dailyProfit - profitAfterTax;

        totalTaxesPaid += taxesToday;
        grossProfitTotal += dailyProfit;
        netTotal += profitAfterTax;

        dailyResults.push({
            day,
            dailyProfit: Number(dailyProfit.toFixed(2)),
            taxesApplied,
            taxesToday: Number(taxesToday.toFixed(2)),
            grossProfitTotal: Number(grossProfitTotal.toFixed(2)),
            totalTaxesPaid: Number(totalTaxesPaid.toFixed(2)),
            netTotal: Number(netTotal.toFixed(2)),
            variationPercent: Number(variationPercent.toFixed(2))
        });
    }

    // desconto taxa de saída
    if (corretagem) {
        netTotal -= endingFee;
        totalTaxesPaid += endingFee;
    }

    return {
        formulaId: formula.id,
        formulaName: formula.name,
        initialAmount,
        startingFee: startingFee ? Number(startingFee.toFixed(2)) : undefined,
        endingFee: endingFee ? Number(endingFee.toFixed(2)) : undefined,
        grossTotal: Number((initialAmount + grossProfitTotal).toFixed(2)),
        totalTaxesPaid: Number(totalTaxesPaid.toFixed(2)),
        netTotal: Number(netTotal.toFixed(2)),
        totalValue: Number(netTotal.toFixed(2)),
        dailyResults
    };
},

    processFormula: async (formula, firstDay, lastDay) => {
        const inv = formula.Investments[0];
        console.log(inv.type);
        switch(inv.type){
            case "Cripto":
                return formulaService.processCripto(formula, firstDay, lastDay);

            case "Acao":
                return formulaService.processAcao(formula, firstDay, lastDay);
            case "Cambio":
                return formulaService.processCambio(formula, firstDay, lastDay);
            case "RendaFixa":
                return formulaService.processRendaFixa(formula, firstDay, lastDay);
            default:
                throw new Error("Tipo de investimento não suportado para processamento!");
        }
    },
    

    generateCSV: async (formulaId, firstMonth, lastMonth) => {
        const formulaToProcess = await formulaService.findById(formulaId);
        if (!formulaToProcess) throw new Error("Fórmula não encontrada!");

        const processedData = await formulaService.processFormula(
            formulaToProcess,
            firstMonth,
            lastMonth
        );

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