
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
    }
}

export default taxController