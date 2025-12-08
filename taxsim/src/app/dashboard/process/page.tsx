"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from './components/LoadingSkeleton';
import ProcessChart from './components/ProcessChart';
import ProcessTable from './components/ProcessTable';
import ProcessPeriodControls from './components/ProcessPeriodControls';

export default function ProcessPage() {
  const router = useRouter();

  // estados
  const [formulaId, setFormulaId] = useState<string | null>(null);
  const [firstMonth, setFirstMonth] = useState(1);
  const [lastMonth, setLastMonth] = useState(12);
  const [viewMode, setViewMode] = useState<'days' | 'months'>('months');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  // pegar formulaId só no client
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setFormulaId(search.get("formulaId"));
  }, []);

  const loadData = async (fm: number, lm: number) => {
    if (!formulaId) {
      setError("Nenhuma fórmula selecionada.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

      // Verificar se há parâmetro isSpot na URL
      const search = new URLSearchParams(window.location.search);
      const isSpot = search.get("isSpot") === "true";

      // Converter para dias
      let firstDay, lastDay;
      if (viewMode === 'days') {
        // Modo dias: usar valores diretos
        firstDay = Math.max(1, fm);
        lastDay = Math.max(firstDay, lm);
      } else {
        // Modo meses: converter meses para dias (30 dias por mês)
        firstDay = fm * 30;
        lastDay = lm * 30;
      }

      const res = await fetch(
        `${API}/api/formulas/process?firstDay=${firstDay}&lastDay=${lastDay}&isSpot=${isSpot}&id=${formulaId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Erro na API");

      const json = await res.json();
      
      // Backend retorna objeto com dailyResults array
      const processedData = json.processedAmount || json.processedAmounts?.[0];
      
      if (!processedData || !processedData.dailyResults) {
        throw new Error("Estrutura de dados inválida retornada pela API");
      }

      let formatted: any[];

      if (viewMode === 'days') {
        // Exibir dias dentro do intervalo selecionado
        formatted = processedData.dailyResults
          .filter((dayData: any) => dayData.day >= firstDay && dayData.day <= lastDay)
          .map((dayData: any) => ({
            period: dayData.day,
            beforeTax: dayData.grossProfitTotal + processedData.initialAmount,
            afterTax: dayData.netTotal,
          }));
      } else {
        // Agrupar dados por mês (pegar o último dia de cada mês)
        const monthlyData: any = {};
        processedData.dailyResults.forEach((dayData: any) => {
          const monthIndex = Math.floor((dayData.day - 1) / 30) + 1;
          monthlyData[monthIndex] = {
            period: monthIndex,
            beforeTax: dayData.grossProfitTotal + processedData.initialAmount,
            afterTax: dayData.netTotal,
          };
        });
        
        formatted = Object.values(monthlyData);
      }

      setData({
        id: processedData.formulaId,
        name: processedData.formulaName,
        initialAmount: processedData.initialAmount,
        rows: formatted,
      });
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar simulação.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!formulaId) return;
    loadData(firstMonth, lastMonth);
  }, [formulaId]);

  useEffect(() => {
    if (formulaId && data) {
      loadData(firstMonth, lastMonth);
    }
  }, [viewMode]);

  const handleToggleViewMode = () => {
    const newMode = viewMode === 'days' ? 'months' : 'days';
    setViewMode(newMode);
    
    // Resetar valores ao mudar de modo
    if (newMode === 'days') {
      setFirstMonth(1);
      setLastMonth(30);
    } else {
      setFirstMonth(1);
      setLastMonth(12);
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (error)
    return <main className="p-10 text-red-600 text-xl font-semibold">{error}</main>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Botão de voltar */}
        <button
          onClick={() => router.back()}
          className="mb-8 px-6 py-3 rounded-2xl bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-100 font-medium flex items-center gap-2"
        >
          ← Voltar
        </button>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Simulação — {data.name}
          </h1>

        {/* Botão de download CSV */}
        <button
          onClick={async () => {
            if (!data?.id) return;

            try {
              const token = localStorage.getItem("token");
              
              if (!token) throw new Error("Usuário não autenticado.");

              const res = await fetch(
                `http://ec2-3-238-112-88.compute-1.amazonaws.com:5000/api/formulas/csv/${data.id}?firstMonth=${firstMonth}&lastMonth=${lastMonth}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (!res.ok) throw new Error("Erro ao gerar CSV.");

              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${data.name}.csv`;
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              console.error(err);
              alert("Erro ao baixar CSV.");
            }
          }}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          📄 Download CSV
        </button>
      </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
          <p className="text-gray-700 text-lg font-medium">
            💰 Valor inicial: <span className="font-bold text-gray-900">R$ {data.initialAmount}</span>
          </p>
        </div>      {/* Controle de meses */}
      <ProcessPeriodControls
        firstMonth={firstMonth}
        lastMonth={lastMonth}
        onFirstMonthChange={setFirstMonth}
        onLastMonthChange={setLastMonth}
        onUpdate={() => loadData(firstMonth, lastMonth)}
        viewMode={viewMode}
      />

      <ProcessChart 
        data={data.rows} 
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
      />

      <ProcessTable data={data.rows} viewMode={viewMode} />
      </div>
    </main>
  );
}


