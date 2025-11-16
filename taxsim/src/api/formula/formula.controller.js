import formulaService from "./formula.services.js";
import { createFormulaSchema } from "../utils/validation.js"; // Importa o schema

const formulaController = {
    // Rota GET /api/formulas (NOVA - para o dashboard)
    getAllFormulasByUser: async (req, res) => {
        try {
            const userId = req.user.id;
            const formulas = await formulaService.findAllByUserId(userId); // (Serviço precisa ser criado)
            if (!formulas) return res.status(404).send({ msg: "Nenhuma fórmula encontrada!" });
            return res.status(200).send({ formulas: formulas });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },

    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const formula = await formulaService.findById(id);

            if (!formula) return res.status(404).send({ msg: "Fórmula não encontrada!" });

            // Verifica se o usuário autenticado é o dono da fórmula
            if (formula.userId !== req.user.id) {
                 return res.status(403).send({ msg: "Acesso negado!" });
            }

            return res.status(200).send({ formula: formula });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    createFormula: async (req, res) => {
        try {
            // Validação com Zod
            const validation = createFormulaSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).send({ msg: "Dados inválidos", errors: validation.error.errors });
            }

            const formulaData = validation.data;
            formulaData.userId = req.user.id; // Adiciona o ID do usuário autenticado

            const createdFormula = await formulaService.create(formulaData);
            if (!createdFormula) return res.status(400).send({ msg: "Fórmula não criada!" });
            return res.status(200).send({ msg: "Fórmula criada!", formula: createdFormula });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    processFormulas: async (req,res) => {
        try{
            let id = req.query.id
            const firstMonth = req.query.firstMonth
            const lastMonth = req.query.lastMonth
            const userId = req.user.id; // ID do usuário autenticado

            if(!id || !firstMonth || !lastMonth){
                return res.status(400).send({msg:"É necessário informar id, firstMonth e lastMonth"})
            } 
            
            let ids = [];
            if (typeof id === 'string') {
                if (!/^[0-9,]+$/.test(id)) {
                    return res.status(400).send({ msg: "IDs inválidos" });
                }
                ids = id.split(',').map(Number).filter(n => !isNaN(n));
            } else if (typeof id === 'number') {
                ids = [id];
            } else {
                 return res.status(400).send({ msg: "Formato de ID inválido" });
            }

            const processed = []
            for(const formulaId of ids){
                const formula =  await formulaService.findById(formulaId);
                
                // Validação de segurança
                if(!formula) return res.status(404).send({msg:`Fórmula com id ${formulaId} não encontrada!`})
                if(formula.userId !== userId) return res.status(403).send({msg:`Acesso negado à fórmula ${formulaId}`})

                processed.push(await formulaService.processFormula(formula, firstMonth, lastMonth))
            }
            return res.status(200).send({ processedAmounts: processed });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    deleteFormula: async (req, res) => {
        try {
            const id = req.params.id;
            const userId = req.user.id;

            // Verifica se a fórmula existe e pertence ao usuário
            const formula = await formulaService.findById(id);
            if (!formula) return res.status(404).send({ msg: "Fórmula não encontrada!" });
            if (formula.userId !== userId) return res.status(403).send({ msg: "Acesso negado!" });

            const deletedFormula = await formulaService.delete(id);
            return res.status(200).send({ msg: "Fórmula deletada!", formula: deletedFormula });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },

    
    simulateSimple: (req, res) => {
        try {
            // TODO: Adicionar validação Zod aqui também
            const { valor, taxaAdm, taxaPerf, ir, anos, rendimentoAnual } = req.body;
            
            
            const admFactor = taxaAdm / 100;
            const perfFactor = taxaPerf / 100;
            const irFactor = ir / 100;
            const rendimentoFactor = rendimentoAnual / 100; 

            let investimento = parseFloat(valor);
            let historico = [{ ano: 0, valor: investimento.toFixed(2) }]; // Começa no ano 0

            for (let ano = 1; ano <= anos; ano++) {
                let rendimentoBruto = investimento * rendimentoFactor;
            
                let taxaAdmValor = admFactor * investimento;
                let rendimentoAposAdm = rendimentoBruto - taxaAdmValor;
                
                let taxaPerfValor = 0;
                if (rendimentoAposAdm > 0) { 
                    taxaPerfValor = perfFactor * rendimentoAposAdm;
                }
                let rendimentoLiquidoTaxas = rendimentoAposAdm - taxaPerfValor;

                
                let imposto = 0;
                if (rendimentoLiquidoTaxas > 0) {
                    imposto = irFactor * rendimentoLiquidoTaxas;
                }
                
                
                let rendimentoLiquidoFinal = rendimentoLiquidoTaxas - imposto;
                investimento += rendimentoLiquidoFinal; 

                historico.push({ ano, valor: investimento.toFixed(2) });
            }

            const resultadoFinal = investimento.toFixed(2);
            
            return res.status(200).send({ resultado: resultadoFinal, dadosGrafico: historico });

        } catch (err) {
            
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido no servidor';
            return res.status(500).send({ error: errorMessage });
        }
    },
};

export default formulaController;