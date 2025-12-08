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

// --- NOVOS TIPOS (Baseados nos modelos da API) ---

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'default';
  formulas?: ApiFormula[];
}

export interface ApiInvestment {
  id?: number;
  amount: number;
  factor: number;
  type: "Ação"  | "Renda Fixa" | "Criptomoeda";
  formulaId?: number;
}

export interface ApiTax {
  id?: number;
  initial: number | null;
  end: number | null;
  factor: number;
  type: "Percent" | "Fixed" | "Multiplier" | "Progressive" | "Regressive" | "Capped";
  applies: "gain" | "capital";
  formulaId?: number;
}

export interface ApiFormula {
  id: number;
  name: string;
  userId: number;
  Investments: ApiInvestment[];
  Taxes: ApiTax[];
}