import taxService from "./tax.services.js"
import formulaService from "../formula/formula.services.js"
const taxController = {
    create: async (req,res) => {
        try{
            const tax = req.body
            const createdTax = await taxService.create(tax)
            if(!createdTax) return res.status(400).send({msg:"Taxa não criada!"})
            return createdTax
        }catch(err){
            return res.status(500).send({error:err.message})
        }
    },
    bulkCreate: async (req, res) => {
    try {
        const { taxes, formulaName } = req.body;
        const formula = { name: formulaName };
        formula.userId = req.user.id;
        const validateIntervals = taxService.validateIntervals(taxes);
        if (!validateIntervals)
        return res.status(400).send({ msg: "Os intervalos das taxas estão sobrepostos!" });
        const createdFormula = await formulaService.create(formula);

        const createdTaxes = [];
        for (const tax of taxes) {
        tax.formulaId = createdFormula.id;
        const createdTax = await taxService.create(tax);
        if (createdTax) createdTaxes.push(createdTax);
        }

        if (createdTaxes.length === 0)
        return res.status(400).send({ msg: "Nenhuma taxa criada!" });

        const fullFormula = await formulaService.findById(createdFormula.id);

        return res
        .status(200)
        .send({ msg: "Fórmula e taxas criadas!", formula: fullFormula });
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
    },
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const taxData = req.body;
            const updatedTax = await taxService.update(id, taxData);
            if (!updatedTax)
                return res.status(404).send({ msg: "Taxa não encontrada!" });
            return res.status(200).send({ tax: updatedTax });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }       
    }

}

export default taxController