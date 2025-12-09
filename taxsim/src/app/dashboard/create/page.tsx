"use client";
import { useState, FormEvent } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import apiClient from "@/app/services/apiClient";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";

// ----------------------
// Tipos locais
// ----------------------
export type LocalInvestment = {
  amount: number;
  interestRate: number | null;
  interestRateType: "percent" | "currency";
  type: "Acao" | "RendaFixa" | "Cripto" | "Cambio";
  startDate: string;
  endDate: string | null;
};

export type LocalTax = {
  name: string;
  mode: "percent" | "fixed";
  value: number;
  appliesTo: "initial" | "profit";
};

// Opções dos selects
const investmentTypes: LocalInvestment["type"][] = [
  "RendaFixa",
  "Acao",
  "Cripto",
  "Cambio",
];

const investmentTypeLabels: Record<LocalInvestment["type"], string> = {
  RendaFixa: "Renda Fixa",
  Acao: "Ação",
  Cripto: "Criptomoeda",
  Cambio: "Câmbio",
};

const taxModes: LocalTax["mode"][] = ["percent", "fixed"];
const taxModeLabels: Record<LocalTax["mode"], string> = {
  percent: "Percentual",
  fixed: "Fixa",
};

const taxAppliesTo = ["initial", "profit"] as const;
const taxAppliesToLabels: Record<LocalTax["appliesTo"], string> = {
  initial: "Valor Inicial",
  profit: "Lucro",
};

// ---------------------------------------------------
// Página principal
// ---------------------------------------------------
export default function CreateFormulaPage() {
  const { token, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formulaName, setFormulaName] = useState("");
  const [includeIOF, setIncludeIOF] = useState(false);

  const [investment, setInvestment] = useState<LocalInvestment>({
    amount: 1000,
    interestRate: 5,
    interestRateType: "percent",
    type: "RendaFixa",
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
  });

  const [taxes, setTaxes] = useState<LocalTax[]>([]);

  // Redireciona se não estiver logado
  if (!authLoading && !user) {
    router.push("/login");
    return null;
  }

  // ----------------------
  // Manipulação de taxas
  // ----------------------
  const addTax = () => {
    setTaxes([
      ...taxes,
      {
        name: "Corretagem",
        mode: "percent",
        value: 15,
        appliesTo: "profit",
      },
    ]);
  };

  const removeTax = (index: number) => {
    setTaxes(taxes.filter((_, i) => i !== index));
  };

  const handleTaxChange = (
    index: number,
    field: keyof LocalTax,
    value: string | number
  ) => {
    const updated = [...taxes];
    const tax = updated[index];

    if (field === "name") {
      tax.name = value as string;
    } else if (field === "mode") {
      tax.mode = value as LocalTax["mode"];
    } else if (field === "value") {
      tax.value = Number(value);
    } else if (field === "appliesTo") {
      tax.appliesTo = value as LocalTax["appliesTo"];
    }

    setTaxes(updated);
  };

  const handleInvestmentChange = (
    field: keyof LocalInvestment,
    value: string | number | null
  ) => {
    setInvestment((prev) => ({
      ...prev,
      [field]: 
        field === "amount" || field === "interestRate" 
          ? (value === "" || value === null ? null : Number(value))
          : field === "interestRateType" || field === "type"
          ? value
          : value,
    }));
  };

  // ----------------------
  // Envio do formulário
  // ----------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      name: formulaName,
      iof: includeIOF,
      investment: {
        amount: investment.amount,
        interestRate: investment.interestRate,
        interestRateType: investment.interestRateType,
        type: investment.type,
        startDate: investment.startDate,
        endDate: investment.endDate || null,
      },
      taxes: taxes,
    };

    try {
      await apiClient.post("/api/formulas", payload, token);
      alert("Fórmula criada com sucesso!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(`Falha ao criar fórmula: ${err?.message || "Erro desconhecido"}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------
  // Renderização
  // ----------------------
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 pt-28 px-6 max-w-4xl mx-auto w-full mb-20">
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        >
          ← Voltar
        </button>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-10 tracking-tight">
          Criar Nova Fórmula
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ---------------- Seção 1 ---------------- */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">1. Identificação</h2>

            <label className="block text-black font-medium mb-2">
              Nome da Fórmula
            </label>
            <input
              type="text"
              value={formulaName}
              onChange={(e) => setFormulaName(e.target.value)}
              placeholder="Ex: Renda Fixa (CDI + 1%)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm text-black"
              required
            />

          </div>

          {/* ---------------- Seção 2: Investimento ---------------- */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">2. Investimento</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valor */}
              <div>
                <label className="block text-black font-medium mb-2">Valor Inicial (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={investment.amount}
                  onChange={(e) => handleInvestmentChange("amount", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-black font-medium mb-2">
                  Tipo de Investimento
                </label>
                <select
                  value={investment.type}
                  onChange={(e) => handleInvestmentChange("type", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 text-black"
                >
                  {investmentTypes.map((t) => (
                    <option key={t} value={t}>
                      {investmentTypeLabels[t]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Taxa de Juros */}
              <div>
                <label className="block text-black font-medium mb-2">
                  Rendimento
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={investment.interestRate ?? ""}
                  onChange={(e) => handleInvestmentChange("interestRate", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              {/* Data de Início */}
              <div>
                <label className="block text-black font-medium mb-2">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={investment.startDate}
                  onChange={(e) => handleInvestmentChange("startDate", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>
            </div>
          </div>

          {/* ---------------- Seção 3: Corretagem ---------------- */}
{/* ---------------- Seção 3: Corretagem ---------------- */}
<div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-semibold text-gray-800">
      3. Corretagem
    </h2>

    <button
      type="button"
      onClick={addTax}
      disabled={investment.type === "RendaFixa"}
      className={`px-5 py-2 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 ${
        investment.type === "RendaFixa" ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      + Adicionar Corretagem
    </button>
  </div>

  <div className="space-y-6">
    {taxes.map((tax, index) => (
      <div
        key={index}
        className="p-4 border rounded-lg bg-gray-50/50 relative"
      >
        <button
          type="button"
          onClick={() => removeTax(index)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-black mb-1">
              Nome da Corretagem
            </label>
            <input
              type="text"
              value="Corretagem"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black bg-gray-200 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-black mb-1">
              Modo
            </label>
            <select
              value={tax.mode}
              onChange={(e) => handleTaxChange(index, "mode", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
            >
              {taxModes.map((m) => (
                <option key={m} value={m}>
                  {taxModeLabels[m]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-black mb-1">
              Valor {tax.mode === "percent" ? "(%)" : "(R$)"}
            </label>
            <input
              type="number"
              step="0.01"
              value={tax.value}
              onChange={(e) => handleTaxChange(index, "value", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-black mb-1">
              Aplica-se sobre
            </label>
            <select
              value={tax.appliesTo}
              onChange={(e) => handleTaxChange(index, "appliesTo", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
            >
              {taxAppliesTo.map((a) => (
                <option key={a} value={a}>
                  {taxAppliesToLabels[a]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    ))}

    {investment.type === "RendaFixa" ? (
      <p className="text-gray-500 text-center py-4">
        Renda Fixa não permite adicionar corretagem.
      </p>
    ) : taxes.length === 0 ? (
      <p className="text-gray-500 text-center py-4">
        Nenhuma corretagem adicionada. Clique no botão acima para adicionar.
      </p>
    ) : null}
  </div>
</div>


          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              <strong className="font-bold">Erro: </strong>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || authLoading}
            className="w-full px-8 py-4 rounded-xl shadow-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:bg-gray-400"
          >
            {isLoading ? "Salvando..." : "Salvar Fórmula"}
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
}
