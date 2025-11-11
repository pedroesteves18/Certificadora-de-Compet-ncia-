const TaxProcessor = {
  process(tax, amount) {
    const type = tax.type;
    const factor = parseFloat(tax.factor);
    const initial = tax.initial !== null ? parseFloat(tax.initial) : 0;
    const end = tax.end !== null ? parseFloat(tax.end) : null;
    const cap = tax.cap !== undefined && tax.cap !== null ? parseFloat(tax.cap) : null;
    const numericAmount = parseFloat(amount);

    switch (type) {
      case "Percent":
        return TaxProcessor.processPercent(numericAmount, factor);
      case "Fixed":
        return TaxProcessor.processFixed(numericAmount, factor);
      case "Multiplier":
        return TaxProcessor.processMultiplier(numericAmount, factor);
      case "Progressive":
        return TaxProcessor.processProgressive(numericAmount, factor, initial, end);
      case "Regressive":
        return TaxProcessor.processRegressive(numericAmount, factor, initial, end);
      case "Capped":
        return TaxProcessor.processCapped(numericAmount, factor, cap);
      default:
        throw new Error(`Tipo de taxa desconhecido: ${type}`);
    }
  },

  processPercent: (amount, factor) => {
    amount = parseFloat(amount);
    factor = parseFloat(factor);
    return amount + (amount * (factor / 100));
  },

  processFixed: (amount, factor) => {
    amount = parseFloat(amount);
    factor = parseFloat(factor);
    return amount + factor;
  },

  processMultiplier: (amount, factor) => {
    amount = parseFloat(amount);
    factor = parseFloat(factor);
    return amount * factor;
  },

  processProgressive: (amount, factor, initial = 0, end = null) => {
    amount = parseFloat(amount);
    factor = parseFloat(factor);
    initial = parseFloat(initial);
    if (end !== null) end = parseFloat(end);

    if (end && amount > end) return amount + (amount * (factor / 100));

    const progress = (amount - initial) / (end ? end - initial : amount);
    const progressiveFactor = Math.max(progress, 0) * factor;
    return amount + (amount * (progressiveFactor / 100));
  },

  processRegressive: (amount, factor, initial = 0, end = null) => {
    amount = parseFloat(amount);
    factor = parseFloat(factor);
    initial = parseFloat(initial);
    if (!end) end = amount * 2;
    else end = parseFloat(end);

    const progress = Math.min((amount - initial) / (end - initial), 1);
    const regressiveFactor = factor * (1 - progress);
    return amount + (amount * (regressiveFactor / 100));
  },

  processCapped: (amount, factor, cap = null) => {
    amount = parseFloat(amount);
    factor = parseFloat(factor);
    if (cap !== null) cap = parseFloat(cap);

    const taxed = amount + (amount * (factor / 100));
    if (cap && taxed > cap) return cap;
    return taxed;
  }
};

export default TaxProcessor;
