"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DailyResult {
  day: number;
  grossIfWithdrawn: number | string | null;
  netIfWithdrawn: number | string | null;
  taxesIfWithdrawnAmount: number | string | null;
}

interface ProcessChartProps {
  data: DailyResult[];
}

// Função segura para converter para número
const safeNumber = (value: number | string | null | undefined) => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
};

export default function ProcessChart({ data }: ProcessChartProps) {
  if (!data || data.length === 0) return null;

  let accumulatedNet = 0;
  let accumulatedTaxes = 0;

  const chartData = data.map(d => {
    const gross = safeNumber(d.grossIfWithdrawn);
    const net = safeNumber(d.netIfWithdrawn);
    const taxes = safeNumber(d.taxesIfWithdrawnAmount);

    accumulatedNet += net;
    accumulatedTaxes += taxes;

    return {
      period: d.day ?? 0,
      grossProfitTotal: gross,              // bruto já acumulado
      netProfitTotal: accumulatedNet,       // acumula líquidos
      totalTaxesPaidIfWithdraw: accumulatedTaxes, // acumula impostos
    };
  });

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        📈 Evolução do Investimento
      </h3>
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="period"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: "Dia", position: "insideBottomRight", offset: 0 }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
            />
            <Tooltip
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              labelFormatter={(label) => `Dia ${label}`}
            />
            <Legend
              formatter={(value) =>
                value === "grossProfitTotal" ? "Bruto Acumulado" :
                value === "netProfitTotal" ? "Líquido Acumulado" :
                value === "totalTaxesPaidIfWithdraw" ? "Impostos se Resgatados" :
                value
              }
            />
            <Line
              type="monotone"
              dataKey="grossProfitTotal"
              stroke="#3b82f6"
              dot={false}
              strokeWidth={3}
              name="Bruto Acumulado"
            />
            <Line
              type="monotone"
              dataKey="netProfitTotal"
              stroke="#10b981"
              dot={false}
              strokeWidth={3}
              name="Líquido Acumulado"
            />
            <Line
              type="monotone"
              dataKey="totalTaxesPaidIfWithdraw"
              stroke="#f97316"
              dot={false}
              strokeWidth={3}
              name="Impostos se Resgatados"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
