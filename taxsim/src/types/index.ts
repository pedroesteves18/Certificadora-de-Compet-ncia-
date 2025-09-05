// Tipos globais para o projeto TaxSim

export interface InvestmentData {
  valor: number;
  taxaAdm: number;
  taxaPerf: number;
  ir: number;
  anos: number;
}

export interface ChartData {
  ano: number;
  valor: string;
}

export interface CalculationResult {
  valorFinal: number;
  historico: ChartData[];
}

export interface FormField {
  label: string;
  value: number;
  setter: (value: number) => void;
}

// Tipos para componentes de desenvolvedores
export interface Developer {
  name: string;
  role: string;
  description?: string;
}

// Tipos para tooltips do Recharts
export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: string;
    name: string;
    color: string;
  }>;
  label?: string;
}
