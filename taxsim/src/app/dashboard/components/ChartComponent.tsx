import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Interfaces para estrutura da API
interface Investment {
  id: number;
  amount: number;
  type: string;
  interestRate?: number;
  interestRateType?: string;
  startDate: string;
  endDate?: string;
}

interface Tax {
  id: number;
  name: string;
  mode: string;
  value: number;
  appliesTo: string;
}

interface Formula {
  id: number;
  name: string;
  userId: number;
  Investments: Investment[];
  Taxes: Tax[];
}

// Para gráfico
interface FormulaChartData {
  period: number;
  [formulaName: string]: number | undefined;
}

interface ChartComponentProps {
  chartData: FormulaChartData[];
  formulas: Formula[];
  viewMode: 'days' | 'months';
  onToggleViewMode: () => void;
}

export default function ChartComponent({ chartData, formulas, viewMode, onToggleViewMode }: ChartComponentProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📈 Comparação de Fórmulas
        </h2>
        <button
          onClick={onToggleViewMode}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {viewMode === 'days' ? '📅 Ver por Meses' : '📆 Ver por Dias'}
        </button>
      </div>
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
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
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
              formatter={(value: any, name: string) => [
                `R$ ${parseFloat(value).toFixed(2)}`,
                name
              ]}
              labelFormatter={(label) => viewMode === 'days' ? `Dia ${label}` : `Mês ${label}`}
            />
            {formulas.map((f, index) => {
              const colors = [
                '#3B82F6',
                '#10B981', 
                '#F59E0B',
                '#EF4444',
                '#8B5CF6'
              ];
              return (
                <Line
                  key={f.id}
                  type="monotone"
                  dataKey={f.name}
                  dot={false}
                  stroke={colors[index % colors.length]}
                  strokeWidth={3}
                  name={f.name}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}