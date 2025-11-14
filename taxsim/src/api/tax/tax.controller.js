
import taxService from "./tax.services.js";

const taxController = {
    updateTax: async (req, res) => {
        try {
            const id = req.params.id;
            const taxData = req.body;
            const updatedTax = await taxService.update(id, taxData);
            if (!updatedTax) return res.status(404).send({ msg: "Taxa não encontrada!" });
            return res.status(200).send({ msg: "Taxa atualizada!", tax: updatedTax });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    deleteTax: async (req, res) => {
        try {
            const id = req.params.id;
            const deletedTax = await taxService.delete(id);
            if (!deletedTax) return res.status(404).send({ msg: "Taxa não encontrada!" });
            return res.status(200).send({ msg: "Taxa deletada!", tax: deletedTax });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    getTaxById: async (req, res) => {
        try {
            const id = req.params.id;
            const tax = await taxService.findById(id);
            if (!tax) return res.status(404).send({ msg: "Taxa não encontrada!" });
            return res.status(200).send({ tax });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    createTax: async (req, res) => {
        try {
            const taxData = req.body;
            const isValid = taxService.validateIntervals([taxData]);
            if (!isValid) {
                return res.status(400).send({ msg: "Intervalos de taxa inválidos!" });
            }
            const newTax = await taxService.create(taxData);
            return res.status(201).send({ msg: "Taxa criada!", tax: newTax });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }   
    },
}

export default taxController