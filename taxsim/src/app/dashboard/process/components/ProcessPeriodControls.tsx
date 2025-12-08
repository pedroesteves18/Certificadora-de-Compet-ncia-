interface ProcessPeriodControlsProps {
  firstMonth: number;
  lastMonth: number;
  onFirstMonthChange: (value: number) => void;
  onLastMonthChange: (value: number) => void;
  onUpdate: () => void;
  viewMode: 'days' | 'months';
}

export default function ProcessPeriodControls({
  firstMonth,
  lastMonth,
  onFirstMonthChange,
  onLastMonthChange,
  onUpdate,
  viewMode
}: ProcessPeriodControlsProps) {
  const isMonthMode = viewMode === 'months';
  
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🗺️ Período da Simulação {isMonthMode ? '(Meses)' : '(Dias)'}
      </h3>
      <div className="flex flex-wrap gap-4 items-end">
        <div className="min-w-0 flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            {isMonthMode ? 'Primeiro mês' : 'Primeiro dia'}
          </label>
          <input
            type="number"
            min={1}
            value={firstMonth}
            onChange={(e) => onFirstMonthChange(parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200"
          />
        </div>
        <div className="min-w-0 flex-1">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            {isMonthMode ? 'Último mês' : 'Último dia'}
          </label>
          <input
            type="number"
            min={firstMonth}
            value={lastMonth}
            onChange={(e) => onLastMonthChange(parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 font-medium transition-all duration-200"
          />
        </div>
        <button
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          onClick={onUpdate}
        >
          🔄 Atualizar
        </button>
      </div>
    </div>
  );
}