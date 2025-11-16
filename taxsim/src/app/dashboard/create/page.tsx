"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import apiClient from "@/app/services/apiClient";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation";
import type { ApiInvestment, ApiTax } from "@/types";

// Tipos de investimento
const investmentTypes: ApiInvestment["type"][] = [
  "Renda Fixa",
  "Ação",
  "Fundo Imobiliário",
  "Criptomoeda",
];

// Tipos de taxa
const taxTypes: ApiTax["type"][] = [
  "Percent",
  "Fixed",
  "Multiplier",
  "Progressive",
  "Regressive",
  "Capped",
];

// Onde a taxa se aplica
const taxApplies: ApiTax["applies"][] = ["gain", "capital"];


export default function CreateFormulaPage() {
  const { token, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formulaName, setFormulaName] = useState("");
  const [investment, setInvestment] = useState<Omit<ApiInvestment, "id">>({
    amount: 1000,
    factor: 1.05,
    type: "Renda Fixa",
  });
  const [taxes, setTaxes] = useState<Omit<ApiTax, "id">[]>([]);

  // Redireciona se não estiver logado
  if (!authLoading && !user) {
    router.push("/login");
    return null;
  }

  // Funções para manipular taxas
  const addTax = () => {
    setTaxes([
      ...taxes,
      {
        initial: null,
        end: null,
        factor: 15,
        type: "Percent",
        applies: "gain",
      },
    ]);
  };

  const removeTax = (index: number) => {
    setTaxes(taxes.filter((_, i) => i !== index));
  };

  const handleTaxChange = (
    index: number,
    field: keyof Omit<ApiTax, "id">,
    value: string | number | null
  ) => {
    const newTaxes = [...taxes];
    const tax = newTaxes[index];

    if (field === "initial" || field === "end" || field === "factor") {
        (tax[field] as number | null) = value === "" ? null : Number(value);
    } else {
        (tax[field] as string) = value as string;
    }
    setTaxes(newTaxes);
  };
  
  const handleInvestmentChange = (
    field: keyof Omit<ApiInvestment, "id">,
    value: string | number
  ) => {
     setInvestment(prev => ({
         ...prev,
         [field]: (field === 'amount' || field === 'factor') ? Number(value) : value
     }));
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      formulaName: formulaName,
      investment: investment,
      taxes: taxes,
    };
    
    try {
        await apiClient.post("/api/formulas", payload, token);
        alert("Fórmula criada com sucesso!");
        router.push("/dashboard");
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        setError(`Falha ao criar fórmula: ${errorMessage}`);
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-28 px-6 max-w-4xl mx-auto w-full mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-10 tracking-tight">
          Criar Nova Fórmula
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Seção 1: Nome da Fórmula */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              1. Identificação
            </h2>
            <label
              htmlFor="formulaName"
              className="block text-gray-700 font-medium mb-2"
            >
              Nome da Fórmula
            </label>
            <input
              type="text"
              id="formulaName"
              value={formulaName}
              onChange={(e) => setFormulaName(e.target.value)}
              placeholder="Ex: Renda Fixa (CDI + 1%)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
              required
            />
          </div>

          {/* Seção 2: Investimento Base */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              2. Investimento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={investment.amount}
                  onChange={(e) => handleInvestmentChange('amount', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Fator/Rendimento (ex: 1.05)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={investment.factor}
                  onChange={(e) => handleInvestmentChange('factor', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tipo de Investimento
                </label>
                <select
                    value={investment.type}
                    onChange={(e) => handleInvestmentChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    {investmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seção 3: Taxas */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                3. Taxas e Impostos
                </h2>
                <button
                    type="button"
                    onClick={addTax}
                    className="px-5 py-2 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                >
                    + Adicionar Taxa
                </button>
            </div>
            
            <div className="space-y-6">
                {taxes.map((tax, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50/50 relative">
                        <button 
                            type="button"
                            onClick={() => removeTax(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm"
                        >
                            ✕
                        </button>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                             <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de Taxa</label>
                                <select 
                                    value={tax.type}
                                    onChange={e => handleTaxChange(index, 'type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    {taxTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                             </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Fator (%)</label>
                                <input 
                                    type="number"
                                    step="0.1"
                                    value={tax.factor}
                                    onChange={e => handleTaxChange(index, 'factor', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Aplica-se sobre</label>
                                <select 
                                    value={tax.applies}
                                    onChange={e => handleTaxChange(index, 'applies', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    {taxApplies.map(type => <option key={type} value={type}>{type === 'gain' ? 'Ganho' : 'Capital'}</option>)}
                                </select>
                             </div>
                        </div>
                        {/* TODO: Adicionar campos 'initial' e 'end' se necessário */}
                    </div>
                ))}
                {taxes.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Nenhuma taxa adicionada. Clique no botão acima para adicionar.</p>
                )}
            </div>

          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl" role="alert">
                <strong className="font-bold">Erro: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
           )}

          {/* Seção 4: Salvar */}
           <button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full px-8 py-4 rounded-xl shadow-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 disabled:bg-gray-400"
            >
              {isLoading ? "Salvando..." : "Salvar Fórmula"}
            </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}