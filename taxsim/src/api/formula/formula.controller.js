import formulaService from "./formula.services.js";
import { Readable } from 'stream'
import csv from 'csv-parser'

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
    getFormulas: async (req,res) => {
        try{
            const userId = req.user.id
            const formulas = await formulaService.getFormulasByUser(userId)
            return res.status(200).send({formulas: formulas})
        }catch(err){
            return res.status(500).send({error: err.message})
        }
    },
    createFormula: async (req, res) => {
        try {
            const formulaData = {};
            
            formulaData.userId = req.user.id;
            formulaData.name = req.body.name;
            formulaData.iof = req.body.iof
            
            formulaData.investment = req.body.investment ?? null;

            formulaData.taxes = req.body.taxes ?? [];

            const createdFormula = await formulaService.create(formulaData);

            if (!createdFormula) {
                return res.status(400).send({ msg: "Fórmula não criada!" });
            }

            return res.status(200).send({
                msg: "Fórmula criada!",
                formula: createdFormula
            });

        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    processFormulas: async (req, res) => {
    try {
        let id = req.query.id;
        const firstDay = Number(req.query.firstDay || 1);
        const lastDay = Number(req.query.lastDay || 30);
        if (!id) return res.status(400).send({ msg: "É necessário informar id" });
        if (firstDay <= 0 || lastDay < firstDay) return res.status(400).send({ msg: "firstDay e lastDay inválidos" });

        const ids = id.includes(",") ? id.split(",").map(Number) : [Number(id)];

        const result = [];

        for (const formulaId of ids) {
        const formula = await formulaService.findById(formulaId);
        if (req.query.isSpot === "true") formula.Investments[0].isSpot = true;
        if (!formula) return res.status(404).send({ msg: `Fórmula com id ${formulaId} não encontrada!` });
        result.push(await formulaService.processFormula(formula, firstDay, lastDay));
        }

        return res.status(200).send(ids.length === 1 ? { processedAmount: result[0] } : { processedAmounts: result });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: err.message });
    }
    },
    deleteFormula: async (req, res) => {
        try {
            const id = req.params.id;
            const deletedFormula = await formulaService.delete(id);
            if (!deletedFormula) return res.status(404).send({ msg: "Fórmula não encontrada!" });
            return res.status(200).send({ msg: "Fórmula deletada!", formula: deletedFormula });
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }
    },
    generateCSV: async (req, res) => {
        try {
            const id = req.params.id;
            const firstMonth = req.query.firstMonth;
            const lastMonth = req.query.lastMonth;
            const csvData = await formulaService.generateCSV(id, firstMonth, lastMonth);
            if (!csvData) return res.status(404).send({ msg: "Fórmula não encontrada ou erro ao gerar CSV!" });
            res.setHeader('Content-Disposition', 'attachment; filename=formula.csv');
            res.setHeader('Content-Type', 'text/csv');
            return res.status(200).send(csvData);
        } catch (err) {
            return res.status(500).send({ error: err.message });
        }   
    },
};

export default formulaController;