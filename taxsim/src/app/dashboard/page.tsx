"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import apiClient from "../services/apiClient";
import type { ApiFormula } from "@/types";

// Componente "Vazio"
const EmptyState = () => (
  <div className="text-center bg-white p-10 rounded-2xl shadow-md border border-gray-100">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      Nenhuma fórmula encontrada
    </h3>
    <p className="text-gray-600 mb-6">
      Você ainda não criou nenhuma fórmula de simulação.
    </p>
    <Link
      href="/dashboard/create"
      className="px-6 py-3 rounded-xl shadow-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-transform hover:scale-105 active:scale-95"
    >
      Criar Primeira Fórmula
    </Link>
  </div>
);

// Componente Card da Fórmula
const FormulaCard = ({ formula }: { formula: ApiFormula }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border hover:border-blue-500 transition-all duration-300">
    <h4 className="text-lg font-bold text-blue-700 mb-3">{formula.name}</h4>
    
    <div className="mb-3">
      <span className="text-sm font-semibold text-gray-700">Investimento:</span>
      <p className="text-sm text-gray-600">
        R$ {formula.Investments[0]?.amount.toFixed(2)} | Fator: {formula.Investments[0]?.factor} | Tipo: {formula.Investments[0]?.type}
      </p>
    </div>

    <div>
      <span className="text-sm font-semibold text-gray-700">Taxas:</span>
      <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
        {formula.Taxes.length > 0 ? (
           formula.Taxes.map((tax, index) => (
             <li key={index}>
               {tax.type}: {tax.factor}% sobre {tax.applies === 'gain' ? 'Ganho' : 'Capital'}
             </li>
           ))
        ) : (
          <li>Nenhuma taxa configurada</li>
        )}
      </ul>
    </div>
    
    {/* Botões de Ação (futuro) */}
    <div className="flex gap-2 mt-5 border-t pt-4">
         <Link
            href={`/simulator?formulaId=${formula.id}`}
            className="text-sm px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
        >
            Simular
        </Link>
         <button className="text-sm px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition">
            Editar
        </button>
         <button className="text-sm px-4 py-2 rounded-lg bg-red-100 text-red-600 font-medium hover:bg-red-200 transition">
            Excluir
        </button>
    </div>
  </div>
);


export default function DashboardPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [formulas, setFormulas] = useState<ApiFormula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se a autenticação ainda está carregando, espera
    if (authLoading) {
      return;
    }
    
    // Se não há usuário, redireciona para o login
    if (!user || !token) {
      router.push("/login");
      return;
    }

    // Busca as fórmulas do usuário
    const fetchFormulas = async () => {
      setLoading(true);
      setError(null);
      try {
        // O backend GET /api/formulas/:id retorna uma fórmula
        // O backend GET /api/users (que o token já usa) não retorna as fórmulas
        // Precisamos ajustar o backend para ter um endpoint que retorne TODAS as fórmulas do usuário
        // *** Suposição: O endpoint `GET /api/formulas` (sem ID) retornará as fórmulas do usuário (baseado no token) ***
        // *** Esta rota não existe no backend atual. Vamos criá-la. ***
        
        // Pela análise da API, não existe um `GET /api/formulas`
        // Vamos usar o `GET /api/users` que já retorna o usuário
        // E... o `GET /api/users` NÃO retorna as fórmulas.
        
        // *** SOLUÇÃO TEMPORÁRIA: ***
        // Vamos assumir que `GET /api/users` DEVERIA retornar as fórmulas
        // ou que existe um `GET /api/formulas/my`
        
        // Vamos modificar a API `formula.controller.js` para adicionar essa rota.
        
        const data = await apiClient.get<{ formulas: ApiFormula[] }>("/api/formulas", token);
        setFormulas(data.formulas);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro de conexão";
        console.error("Erro ao buscar fórmulas:", err);
        setError("Não foi possível carregar suas fórmulas. O endpoint `GET /api/formulas` (protegido) pode não estar implementado no backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormulas();

  }, [user, token, authLoading, router]);

  // Se autenticando ou carregando dados
  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <p className="text-blue-600 font-medium">Carregando...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-28 px-6 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 tracking-tight">
            Dashboard
          </h1>
          <Link
            href="/dashboard/create"
            className="px-6 py-3 rounded-xl shadow-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95"
          >
            + Criar Nova Fórmula
          </Link>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-12" role="alert">
                <strong className="font-bold">Erro: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {/* Lista de Fórmulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formulas.length > 0 ? (
                formulas.map((formula) => (
                    <FormulaCard key={formula.id} formula={formula} />
                ))
            ) : (
                !error && <div className="col-span-full"><EmptyState /></div>
            )}
        </div>

      </div>
      <Footer />
    </main>
  );
}