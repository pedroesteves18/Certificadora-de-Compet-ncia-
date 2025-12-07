interface TaxFormProps {
  taxForm: any;
  setTaxForm: (form: any) => void;
}

export function TaxForm({ taxForm, setTaxForm }: TaxFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-600 mb-2">Nome da Taxa</label>
        <input
          type="text"
          placeholder="Ex: IR, Taxa de Corretagem, etc."
          value={taxForm.name}
          onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Modo</label>
        <select
          value={taxForm.mode}
          onChange={(e) => setTaxForm({ ...taxForm, mode: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200 bg-white"
        >
          <option value="percent">Percentual</option>
          <option value="fixed">Fixa</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Valor {taxForm.mode === "percent" ? "(%)" : "(R$)"}
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="Ex: 15"
          required
          value={taxForm.value}
          onChange={(e) => setTaxForm({ ...taxForm, value: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-600 mb-2">Aplica-se Sobre</label>
        <select
          value={taxForm.appliesTo}
          onChange={(e) => setTaxForm({ ...taxForm, appliesTo: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200 bg-white"
        >
          <option value="profit">Lucro</option>
          <option value="initial">Valor Inicial</option>
          <option value="total">Valor Total</option>
        </select>
      </div>
    </div>
  );
}

interface InvestmentFormProps {
  invForm: any;
  setInvForm: (form: any) => void;
}

export function InvestmentForm({ invForm, setInvForm }: InvestmentFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Valor Inicial (R$)</label>
        <input
          type="number"
          step="0.01"
          placeholder="Ex: 1000"
          value={invForm.amount}
          onChange={(e) => setInvForm({ ...invForm, amount: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Tipo de Investimento</label>
        <select
          value={invForm.type}
          onChange={(e) => setInvForm({ ...invForm, type: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200 bg-white"
        >
          <option value="RendaFixa">💰 Renda Fixa</option>
          <option value="Acao">📈 Ação</option>
          <option value="FII">🏢 Fundo Imobiliário</option>
          <option value="Cripto">₿ Criptomoeda</option>
          <option value="Cambio">💱 Câmbio</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Taxa de Juros {invForm.interestRateType === "percent" ? "(%)" : "(R$)"}
        </label>
        <input
          type="number"
          step="0.01"
          placeholder={invForm.interestRateType === "percent" ? "Ex: 5" : "Ex: 100"}
          value={invForm.interestRate ?? ""}
          onChange={(e) => setInvForm({ ...invForm, interestRate: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Tipo de Taxa</label>
        <select
          value={invForm.interestRateType}
          onChange={(e) => setInvForm({ ...invForm, interestRateType: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200 bg-white"
        >
          <option value="percent">Percentual (%)</option>
          <option value="currency">Valor Fixo (R$)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Data de Início</label>
        <input
          type="date"
          value={invForm.startDate ?? ""}
          onChange={(e) => setInvForm({ ...invForm, startDate: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Data de Fim (opcional)</label>
        <input
          type="date"
          value={invForm.endDate ?? ""}
          onChange={(e) => setInvForm({ ...invForm, endDate: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200"
        />
      </div>
    </div>
  );
}
