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
    createFormula: async (req, res) => {
        try {
            const formulaData = {};
            const investments = req.body.investments
            const taxes = req.body.taxes
            formulaData.userId = req.user.id;
            formulaData.investments = investments
            formulaData.taxes = taxes
            formulaData.name = req.body.formulaName;
            const createdFormula = await formulaService.create(formulaData);
            if (!createdFormula) return res.status(400).send({ msg: "Fórmula não criada!" });
            return res.status(200).send({ msg: "Fórmula criada!", formula: createdFormula });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    processFormula: async (req,res) => {
        try{
            const { id } = req.params;
            const firstMonth = req.query.firstMonth  || 1;
            const lastMonth = req.query.lastMonth || 12;
            const formula = await formulaService.findById(id);
            if(!formula) return res.status(404).send({msg:"Fórmula não encontrada!"})
            const processedAmount = await formulaService.processFormula(formula, firstMonth, lastMonth);
            return res.status(200).send({ processedAmount: processedAmount });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    }
};

export default formulaController;