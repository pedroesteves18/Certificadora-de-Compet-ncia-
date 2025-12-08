import Formula from "./formula.model.js";
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

    formulaData.taxes = formulaData.taxes || [];

    if (formulaData.iof === true) {
      formulaData.taxes = [
        {
          name: "IOF",
          mode: "percent",
          value: 0,
          appliesTo: "profit",
          formulaId: formula.id
        },
        ...formulaData.taxes
      ];
    }

    for (let tax of formulaData.taxes) {
      tax.formulaId = formula.id;
    }

    if (formulaData.taxes.length > 0) {
      await taxService.bulkCreate(formulaData.taxes);
    }

    if (formulaData.investment) {
      const inv = formulaData.investment;
      const investmentClean = {
        amount: inv.amount,
        type: inv.type,
        interestRate: inv.interestRate ?? null,
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
    return await Formula.findByPk(id, {
      include: [
        { model: Tax, as: 'Taxes' },
        { model: Investment, as: 'Investments' }
      ]
    });
  },

  getFormulasByUser: async (userId) => {
    return await Formula.findAll({
      where: { userId },
      include: [
        { model: Tax, as: 'Taxes' },
        { model: Investment, as: 'Investments' }
      ]
    });
  },

  getAutomaticTaxes: (inv, day) => {
    const taxes = [];

    switch (inv.type) {
      case "RendaFixa":
        if (day <= 30) {
          const iofPercent = (30 - day) / 30 * 100;
          taxes.push({ name: "IOF", appliesTo: "profit", mode: "percent", value: iofPercent });
        }
        let aliquotaIR = 22.5;
        if (day > 720) {
        aliquotaIR = 15;
        } else if (day > 360) {
        aliquotaIR = 17.5;
        } else if (day > 180) {
        aliquotaIR = 20;
        }
        taxes.push({ name: "IR", appliesTo: "profit", mode: "percent", value: aliquotaIR });
        break;

      case "Acao":
        taxes.push({ name: "IR Acao", appliesTo: "profit", mode: "percent", value: 15 });
        break;

      case "Cripto":
        taxes.push({ name: "IR Cripto", appliesTo: "profit", mode: "percent", value: 15 });
        break;

      case "Cambio":
        if (inv.isSpot) {
          taxes.push({ name: "IOF", appliesTo: "investment", mode: "percent", value: 1.1 });
        }
        taxes.push({ name: "IR Cambio", appliesTo: "profit", mode: "percent", value: 15 });
        break;
    }

    return taxes;
  },

  round: (value) => Number(value.toFixed(2)),

processFormula: (formula, firstDay, lastDay) => {
  const inv = formula.Investments[0];
  let initialAmount = Number(inv.amount);
  let netTotal = initialAmount;
  let grossProfitTotal = 0;
  let totalTaxesPaid = 0;

  const dailyResults = [];
  const corretagem = formula.Taxes.find(t => t.name === "Corretagem");
  let startingFee = 0;
  let endingFee = 0;

  // Corretagem de entrada aplicada apenas no primeiro dia
  if (corretagem) {
    startingFee = taxProcessor.process(corretagem, initialAmount).tax;
    netTotal -= startingFee;
    totalTaxesPaid += startingFee;
  }

  const getDailyPrice = (currentPrice, type) => {
    switch (type) {
      case "Cripto":
      case "Acao":
      case "Cambio":
        return currentPrice * (1 + (Math.random() * (inv.interestRate * 2) - inv.interestRate) / 100);
      default:
        return currentPrice;
    }
  };

  const dailyRate = inv.interestRate ? Math.pow(1 + inv.interestRate / 100, 1 / 365) - 1 : 0;

  for (let day = 1; day <= lastDay; day++) {
    // Lucro do dia
    let dailyProfit = inv.type === "RendaFixa" ? netTotal * dailyRate : getDailyPrice(netTotal, inv.type) - netTotal;
    grossProfitTotal += dailyProfit;

    // ------------------- impostos do dia -------------------
    let profitAfterDailyTaxes = dailyProfit;
    let taxesToday = 0;
    const taxesAppliedToday = [];

    const autoTaxes = formulaService.getAutomaticTaxes(inv, day);
    for (const tax of autoTaxes) {
      if (tax.appliesTo === "profit" && profitAfterDailyTaxes > 0) {
        const res = taxProcessor.process(tax, profitAfterDailyTaxes, day);
        taxesAppliedToday.push({ name: tax.name, rate: tax.value, taxAmount: formulaService.round(res.tax) });
        profitAfterDailyTaxes = res.after;
        taxesToday += res.tax;
      }
    }

    // Adiciona corretagem de entrada no primeiro dia
    if (day === 1 && corretagem) {
      taxesAppliedToday.push({ name: corretagem.name, rate: corretagem.value, taxAmount: formulaService.round(startingFee) });
    }

    netTotal += profitAfterDailyTaxes;

    // ------------------- impostos se resgatasse no dia -------------------
    let grossIfWithdrawn = grossProfitTotal;
    let netIfWithdrawn = grossProfitTotal;
    const taxesIfWithdrawn = [];

    // Aplica todas as taxas da fórmula + automáticas
    for (const tax of [...formula.Taxes, ...autoTaxes]) {
      // Corretagem de entrada não é descontada no saque
      if (tax.name === "Corretagem") continue;

      const res = taxProcessor.process(tax, grossIfWithdrawn, day);
      taxesIfWithdrawn.push({ name: tax.name, rate: tax.value, taxAmount: formulaService.round(res.tax) });
      netIfWithdrawn -= res.tax;
    }

    // Corretagem de saída aplicada todos os dias
    if (corretagem) {
      endingFee = taxProcessor.process(corretagem, grossIfWithdrawn).tax;
      taxesIfWithdrawn.push({ name: "Corretagem Saída", rate: corretagem.value, taxAmount: formulaService.round(endingFee) });
      netIfWithdrawn -= endingFee;
    }

    const taxesIfWithdrawnAmount = grossIfWithdrawn - netIfWithdrawn;

    dailyResults.push({
      day,
      dailyProfit: formulaService.round(dailyProfit),
      taxesToday: formulaService.round(taxesToday),
      grossIfWithdrawn: formulaService.round(grossIfWithdrawn),
      netIfWithdrawn: formulaService.round(netIfWithdrawn),
      taxesIfWithdrawnAmount: formulaService.round(taxesIfWithdrawnAmount),
      taxes: taxesIfWithdrawn,
      grossProfitTotal: formulaService.round(grossProfitTotal),
      netTotal: formulaService.round(netTotal)
    });

    totalTaxesPaid += taxesToday;
  }

  return {
    formulaId: formula.id,
    formulaName: formula.name,
    initialAmount,
    startingFee: formulaService.round(startingFee),
    endingFee: formulaService.round(endingFee),
    grossTotal: formulaService.round(initialAmount + grossProfitTotal),
    totalTaxesPaid: formulaService.round(totalTaxesPaid),
    netTotal: formulaService.round(netTotal),
    totalValue: formulaService.round(netTotal),
    dailyResults
  };
}

    }

export default formulaService;
