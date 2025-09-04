"use client";

import { useState } from "react";
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

export default function Calculadora() {
  const [valor, setValor] = useState(10000);
  const [taxaAdm, setTaxaAdm] = useState(1);
  const [taxaPerf, setTaxaPerf] = useState(20);
  const [ir, setIr] = useState(15);
  const [anos, setAnos] = useState(5);
  const [resultado, setResultado] = useState(null);
  const [dadosGrafico, setDadosGrafico] = useState([]);

  const calcular = () => {
    let investimento = valor;
    let historico = [];

    for (let ano = 1; ano <= anos; ano++) {
      let rendimentoBruto = investimento * 0.1;
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 pt-24 px-6 max-w-5xl mx-auto">
        {/* Título */}
        <h1 className="text-5xl font-extrabold text-blue-700 mb-12 text-center drop-shadow-sm">
          Calculadora de Investimentos
        </h1>

        {/* Formulário */}
        <div className="bg-white p-10 rounded-3xl shadow-lg mb-12 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            Parâmetros da Simulação
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
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
              {
                label: "Tempo (anos)",
                value: anos,
                setter: setAnos,
              },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-gray-700 font-medium mb-2">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.setter(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                />
              </div>
            ))}
          </div>

          <button
            onClick={calcular}
            className="mt-10 w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-2xl shadow-lg font-bold text-lg hover:scale-105 active:scale-95 transition-transform"
          >
            Calcular
          </button>
        </div>

        {/* Resultado */}
        {resultado && (
          <div className="bg-white p-8 rounded-3xl shadow-md mb-12 text-center border-t-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Resultado
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Valor final após {anos} anos:
            </p>
            <span className="block text-4xl font-extrabold text-green-600">
              R$ {resultado}
            </span>
          </div>
        )}

        {/* Gráfico */}
        {dadosGrafico.length > 0 && (
          <div className="bg-white p-8 rounded-3xl shadow-md border-t-4 border-blue-600">
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
                <YAxis tick={{ fill: "#374151" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "0.75rem",
                    border: "1px solid #e5e7eb",
                  }}
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
        )}
      </div>

      <Footer />
    </main>
  );
}
