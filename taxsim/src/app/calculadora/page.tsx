"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { ChartData, FormField } from "@/types";

export default function Calculadora() {
  const [valor, setValor] = useState<number>(10000);
  const [taxaAdm, setTaxaAdm] = useState<number>(1);
  const [taxaPerf, setTaxaPerf] = useState<number>(20);
  const [ir, setIr] = useState<number>(15);
  const [anos, setAnos] = useState<number>(5);
  const [resultado, setResultado] = useState<string | null>(null);
  const [dadosGrafico, setDadosGrafico] = useState<ChartData[]>([]);

  useEffect(() => {
    const calcular = (): void => {
      let investimento = valor;
      let historico: ChartData[] = [];

      for (let ano = 1; ano <= anos; ano++) {
        let rendimentoBruto = investimento * 0.1; // Simulação de rendimento de 10% a.a.
        let taxaAdmValor = (taxaAdm / 100) * investimento;
        let rendimentoLiquido = rendimentoBruto - taxaAdmValor;
        let taxaPerfValor =
          rendimentoLiquido > 0 ? (taxaPerf / 100) * rendimentoLiquido : 0;
        rendimentoLiquido -= taxaPerfValor;
        investimento += rendimentoLiquido;
        let imposto = (ir / 100) * rendimentoLiquido;
        investimento -= imposto;
        historico.push({ ano, valor: investimento.toFixed(2) });
      }

      setResultado(investimento.toFixed(2));
      setDadosGrafico(historico);
    };

    calcular();
  }, [valor, taxaAdm, taxaPerf, ir, anos]);


  const fields: FormField[] = [
    {
      label: "Valor Investido (R$)",
      value: valor,
      setter: setValor,
    },
    {
      label: "Taxa de Administração (%)",
      value: taxaAdm,
      setter: setTaxaAdm,
    },
    {
      label: "Taxa de Performance (%)",
      value: taxaPerf,
      setter: setTaxaPerf,
    },
    {
      label: "Imposto de Renda (%)",
      value: ir,
      setter: setIr,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 pt-24 px-6 max-w-5xl mx-auto w-full">
        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-12 text-center drop-shadow-sm tracking-tight">
          Calculadora de Investimentos
        </h1>

        {/* Formulário */}
        <div className="bg-white p-10 rounded-3xl shadow-lg mb-12 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            Parâmetros da Simulação
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fields.map((field, i) => (
              <div key={i}>
                <label className="block text-gray-700 font-medium mb-2">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.setter(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
                />
              </div>
            ))}
             <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tempo (anos)
                </label>
                <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={anos}
                      onChange={(e) => setAnos(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      value={anos}
                      onChange={(e) => setAnos(Number(e.target.value))}
                      className="w-24 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm text-center"
                    />
                </div>
              </div>
          </div>
        </div>

        {/* Resultado e Gráfico */}
        {dadosGrafico.length > 0 ? (
          <>
            <div className="bg-white p-8 rounded-3xl shadow-md mb-12 text-center border-t-4 border-green-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Resultado da Simulação
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Valor final após {anos} {anos === 1 ? 'ano' : 'anos'}:
              </p>
              <span className="block text-4xl font-extrabold text-green-600">
                R$ {resultado}
              </span>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-md border-t-4 border-blue-600 mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Evolução do Investimento
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="ano"
                    label={{
                      value: "Ano",
                      position: "insideBottom",
                      dy: 10,
                    }}
                    tick={{ fill: "#374151" }}
                  />
                  <YAxis tick={{ fill: "#374151" }} tickFormatter={(value) => `R$ ${value}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "0.75rem",
                      border: "1px solid #e5e7eb",
                    }}
                    formatter={(value: any) => [`R$ ${value}`, "Valor"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#2563EB" }}
                    activeDot={{ r: 7, stroke: "#1D4ED8", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">
              Ajuste os valores para iniciar uma nova simulação.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
