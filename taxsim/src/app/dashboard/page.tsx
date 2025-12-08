"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import apiClient from "../services/apiClient";
import LoadingSkeleton from './components/LoadingSkeleton';
import ChartComponent from './components/ChartComponent';
import FormulaCard from './components/FormulaCard';
import NewFormulaCard from './components/NewFormulaCard';
import PeriodControls from './components/PeriodControls';

// Tipos
interface ApiInvestment {
  id: number;
  amount: number;
  type: string;
  interestRate?: number;
  interestRateType?: string;
  startDate: string;
  endDate?: string;
}

interface ApiTax {
  id: number;
  name: string;
  mode: string;
  value: number;
  appliesTo: string;
}

interface ApiFormula {
  id: number;
  name: string;
  userId: number;
  Investments: ApiInvestment[];
  Taxes: ApiTax[];
}

// Para gráfico
interface FormulaChartData {
  period: number;
  [formulaName: string]: number | undefined;
}

export default function DashboardPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [formulas, setFormulas] = useState<ApiFormula[]>([]);
  const [chartData, setChartData] = useState<FormulaChartData[]>([]);
  const [firstMonth, setFirstMonth] = useState(1);
  const [lastMonth, setLastMonth] = useState(12);
  const [viewMode, setViewMode] = useState<'days' | 'months'>('months');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Load formulas e processa gráfico
  const loadData = async (fm: number, lm: number) => {
    if (!user || !token) return;

    try {
      setLoading(true);
      setError(null);

      const data = await apiClient.get<{ formulas: ApiFormula[] }>("/api/formulas", token);
      setFormulas(data.formulas);

      // Processar cada fórmula para gráfico
      const chartRows: FormulaChartData[] = [];

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

      await Promise.all(
        data.formulas.map(async (formula) => {
          const processed = await apiClient.post<any>(
            `/api/formulas/process?firstDay=${firstDay}&lastDay=${lastDay}&id=${formula.id}`,
            {},
            token
          );

          // Backend retorna objeto com dailyResults array
          const processedData = processed.processedAmount || processed.processedAmounts?.[0];
          
          if (!processedData || !processedData.dailyResults) {
            console.warn(`Dados de processamento inválidos para fórmula ${formula.name}`);
            return;
          }

          if (viewMode === 'days') {
            // Exibir dias dentro do intervalo selecionado
            processedData.dailyResults
              .filter((dayData: any) => dayData.day >= firstDay && dayData.day <= lastDay)
              .forEach((dayData: any) => {
                const index = dayData.day - firstDay;
                if (!chartRows[index]) chartRows[index] = { period: dayData.day };
                chartRows[index][formula.name] = dayData.netTotal;
              });
          } else {
            // Agrupar dados por mês (a cada 30 dias)
            processedData.dailyResults.forEach((dayData: any) => {
              const monthIndex = Math.floor((dayData.day - 1) / 30);
              if (!chartRows[monthIndex]) chartRows[monthIndex] = { period: monthIndex + 1 };
              chartRows[monthIndex][formula.name] = dayData.netTotal;
            });
          }
        })
      );

      setChartData(chartRows.filter(row => row !== undefined));
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar fórmulas ou processar simulações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && token) {
      loadData(firstMonth, lastMonth);
    }
  }, [authLoading, user, token]);

  useEffect(() => {
    if (!authLoading && user && token && formulas.length > 0) {
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

  if (authLoading || loading) return <LoadingSkeleton />;

  if (error)
    return (
      <main className="p-10 text-red-600 text-xl font-semibold">{error}</main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Navbar />

      <div className="flex-1 pt-28 px-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Gerencie suas fórmulas de investimento</p>
            </div>

            {/* Controle de meses */}
            <PeriodControls 
              firstMonth={firstMonth}
              lastMonth={lastMonth}
              onFirstMonthChange={setFirstMonth}
              onLastMonthChange={setLastMonth}
              onUpdate={() => loadData(firstMonth, lastMonth)}
              viewMode={viewMode}
            />
          </div>
        </div>

        {/* Gráfico geral */}
        <ChartComponent 
          chartData={chartData} 
          formulas={formulas} 
          viewMode={viewMode}
          onToggleViewMode={handleToggleViewMode}
        />

        {/* Cards de cada fórmula */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📁 Suas Fórmulas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formulas.map((formula) => (
              <FormulaCard 
                key={formula.id} 
                formula={formula} 
                token={token} 
                onDelete={(id) => setFormulas((prev) => prev.filter((f) => f.id !== id))} 
              />
            ))}
            <NewFormulaCard />
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}
