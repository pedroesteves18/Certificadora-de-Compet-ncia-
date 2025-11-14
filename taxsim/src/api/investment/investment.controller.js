
import { create } from "domain";
import investmentService from "./investment.services.js";

const investmentController = {
    deleteInvestment: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await investmentService.deleteInvestment(id);
            if (result) return res.status(200).json({ message: "Investimento deletado com sucesso" })
            return res.status(404).json({ message: "Investimento não encontrado" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar investimento", error: error.message });
        }
    }, 
    putInvestment: async (req, res) => {
        const { id } = req.params;
        const { name, amount, date, type } = req.body;
        try {
            const updatedInvestment = await investmentService.update(id, { name, amount, date, type });
            if (updatedInvestment) return res.status(200).json(updatedInvestment);
            return res.status(404).json({ message: "Investimento não encontrado" })
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar investimento", error: error.message });
        }
    },
    getInvestmentById: async (req, res) => {
        const { id } = req.params;
        try {
            const investment = await investmentService.findById(id);
            if (!investment) return res.status(404).json({ message: "Investimento não encontrado" });
            return res.status(200).json(investment);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar investimento", error: error.message });
        }
    },
    createInvestment: async (req, res) => {
        const data = req.body;
        try {
            const newInvestment = await investmentService.create(data);
            return res.status(201).json(newInvestment);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao criar investimento", error: error.message });
        }   
    },
};

export default investmentController;