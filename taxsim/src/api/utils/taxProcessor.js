const taxProcessor = {

  process(tax, amount, day = null) {
    if (amount < 0) {
      return { before: amount, tax: 0, after: amount };
    }
    const before = Number(amount);

    if (tax.name === "IOF" && day !== null && day <= 30) {
      const rate = this.iofRate(day) / 100;
      const taxValue = before * rate;
      const after = before - taxValue;
      return { before, tax: taxValue, after };
    }

    if(tax.name === "Corretagem") {
      let taxValue = 0;
      if(tax.mode === "fixed") {
        taxValue = Number(tax.value);
      } else if(tax.mode === "percent") {
        taxValue = before * (Number(tax.value) / 100);
      }
      const after = before - taxValue;
      return { before, tax: taxValue, after };
    }

    const factor = Number(tax.value) / 100;

    switch (tax.mode) {
      case "percent": {
        const taxValue = before * factor;
        const after = before - taxValue;
        return { before, tax: taxValue, after };
      }

      case "fixed": {
        const taxValue = factor; 
        const after = before - taxValue;
        return { before, tax: taxValue, after };
      }

      case "multiplier": {
        const after = before * (factor);
        return { before, tax: before - after, after };
      }

      case "progressive":
        return this.applyProgressive(before, factor, tax.initial, tax.end);

      case "regressive":
        return this.applyRegressive(before, factor, tax.initial, tax.end);

      case "capped": {
        const after = before * (1 - factor);
        const taxValue = before - after;
        return { before, tax: taxValue, after };
      }

      default:
        return { before, tax: 0, after: before };
    }
  },

  applyProgressive(amount, factor, initial = 0, end = null) {
    if (!end) end = initial + 1;
    const before = amount;
    const progress = Math.min((amount - initial) / (end - initial), 1);
    const effective = progress * factor;
    const taxValue = amount * (effective / 100);
    return { before, tax: taxValue, after: before - taxValue };
  },

  applyRegressive(amount, factor, initial = 0, end = null) {
    if (!end) end = initial + 1;
    const before = amount;
    const progress = Math.min((amount - initial) / (end - initial), 1);
    const effective = factor * (1 - progress);
    const taxValue = amount * (effective / 100);
    return { before, tax: taxValue, after: before - taxValue };
  },

  iofRate(day) {
    const table = [
      96,93,90,86,83,80,76,73,70,
      66,63,60,56,53,50,46,43,40,
      36,33,30,26,23,20,16,13,10,
      6,3,0
    ];
    return table[day - 1] ?? 0;
  }

};

export default taxProcessor;
