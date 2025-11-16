const taxProcessor = {
process(tax, amount) {

    const type = tax.type;
    const factor = parseFloat(tax.factor);
    const initial = tax.initial ?? null;
    const end = tax.end ?? null;

    let numericAmount = parseFloat(amount);

    // 📌 TRATAMENTO UNIVERSAL PARA NEGATIVOS
    // Se o valor é negativo, a taxa aumenta a dívida (independente do tipo)
    if (numericAmount < 0) {
        const increase = Math.abs(numericAmount) * (factor / 100);
        return numericAmount - increase; 
    }

    // 📌 FAIXA DE APLICAÇÃO
    if (initial !== null && end !== null) {
        if (numericAmount < initial || numericAmount > end) {
            return numericAmount;
        }
    }

    // 📌 NORMAL PARA CASOS POSITIVOS
    switch (type) {
        case "Percent":
            return numericAmount * (1 - factor / 100);

        case "Fixed":
            return numericAmount - factor;

        case "Multiplier":
            return numericAmount * factor;

        case "Progressive":
            return this.processProgressive(numericAmount, factor, initial, end);

        case "Regressive":
            return this.processRegressive(numericAmount, factor, initial, end);

        case "Capped":
            return this.processCapped(numericAmount, factor);

        default:
            return numericAmount;
    }
},

  processProgressive(amount, factor, initial = 0, end = null) {
    if (!end) return amount * (1 - factor / 100);
    const progress = Math.min((amount - initial) / (end - initial), 1);
    const effectiveFactor = progress * factor;
    return amount * (1 - effectiveFactor / 100);
  },

  processRegressive(amount, factor, initial = 0, end = null) {
    if (!end) end = amount * 2;
    const progress = Math.min((amount - initial) / (end - initial), 1);
    const effectiveFactor = factor * (1 - progress);
    return amount * (1 - effectiveFactor / 100);
  },

  processCapped(amount, factor) {
    const cappedValue = amount * (1 - factor / 100);
    return Math.max(cappedValue, 0);
  }
};

export default taxProcessor;
