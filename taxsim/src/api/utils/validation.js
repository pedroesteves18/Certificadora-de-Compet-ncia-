import { z } from 'zod';

// Schema para login
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Schema para criação de usuário
export const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(['admin', 'default']).optional(),
});

// Schema para atualização de usuário
export const updateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
}).strict(); // Garante que campos extras não sejam permitidos

// --- Schemas da Fórmula ---

const investmentSchema = z.object({
    amount: z.number().positive("Valor deve ser positivo"),
    factor: z.number("Fator deve ser um número"),
    type: z.enum(["Ação", "Fundo Imobiliário", "Renda Fixa", "Criptomoeda"]),
}).strict();

const taxSchema = z.object({
    initial: z.number().nullable().optional(),
    end: z.number().nullable().optional(),
    factor: z.number("Fator é obrigatório"),
    type: z.enum(["Percent", "Fixed", "Multiplier", "Progressive", "Regressive", "Capped"]),
    applies: z.enum(["gain", "capital"]),
}).strict();

// Schema para criação de fórmula
export const createFormulaSchema = z.object({
    formulaName: z.string().min(1, "Nome da fórmula é obrigatório"),
    investment: investmentSchema,
    taxes: z.array(taxSchema).optional()
}).strict();