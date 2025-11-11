import formulaService from "./formula.services.js";

const formulaController = {
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const formula = await formulaService.findById(id);
            if (!formula) return res.status(404).send({ msg: "Fórmula não encontrada!" });
            return res.status(200).send({ formula: formula });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    processFormula: async (req,res) => {
        try{
            const { id } = req.params;
            const { amount } = req.body;
            const formula = await formulaService.findById(id);
            if(!formula) return res.status(404).send({msg:"Fórmula não encontrada!"})
            const processedAmount = await formulaService.processFormula(formula, amount);
            return res.status(200).send({ amount: amount, processedAmount: processedAmount });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    }
};

export default formulaController;