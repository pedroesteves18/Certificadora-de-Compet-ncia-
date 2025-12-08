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
  period: number;
  beforeTax: number;
  afterTax: number;
}

interface ProcessChartProps {
  data: DailyResult[];
  viewMode: 'days' | 'months';
  onToggleViewMode: () => void;
}

// Função segura para converter para número
const safeNumber = (value: number | string | null | undefined) => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
};

export default function ProcessChart({ data, viewMode, onToggleViewMode }: ProcessChartProps) {
  if (!data || data.length === 0) return null;

  const chartData = data.map(d => ({
    period: d.period ?? 0,
    beforeTax: safeNumber(d.beforeTax),
    afterTax: safeNumber(d.afterTax),
  }));

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          📈 Evolução do Investimento
        </h3>
        <button
          onClick={onToggleViewMode}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {viewMode === 'days' ? '📅 Ver por Meses' : '📆 Ver por Dias'}
        </button>
      </div>
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="period"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ 
                value: viewMode === 'days' ? "Dia" : "Mês", 
                position: "insideBottomRight", 
                offset: 0,
                style: { fill: '#000000', fontWeight: 600 }
              }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
              domain={['auto', 'auto']}
              padding={{ top: 20, bottom: 20 }}
            />
            <Tooltip
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              labelFormatter={(label) => viewMode === 'days' ? `Dia ${label}` : `Mês ${label}`}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 16px'
              }}
              labelStyle={{
                color: '#e5e7eb',
                fontWeight: '600',
                marginBottom: '4px'
              }}
              itemStyle={{
                color: '#ffffff',
                fontWeight: '500',
                padding: '2px 0'
              }}
            />
            <Legend
              formatter={(value) =>
                value === "beforeTax" ? "Antes da Taxa" :
                value === "afterTax" ? "Após Taxa" :
                value
              }
            />
            <Line
              type="monotone"
              dataKey="beforeTax"
              stroke="#3b82f6"
              dot={false}
              strokeWidth={3}
              name="Antes da Taxa"
            />
            <Line
              type="monotone"
              dataKey="afterTax"
              stroke="#10b981"
              dot={false}
              strokeWidth={3}
              name="Após Taxa"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
