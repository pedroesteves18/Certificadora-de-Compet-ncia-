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
            const investment = req.body.investment
            const taxes = req.body.taxes
            formulaData.userId = req.user.id;
            formulaData.investment = investment
            formulaData.taxes = taxes
            formulaData.name = req.body.formulaName;
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
            let firstMonth = req.query.firstMonth ? parseInt(req.query.firstMonth) : 1;
            let lastMonth = req.query.lastMonth ? parseInt(req.query.lastMonth) : 12;
            if(!firstMonth || !lastMonth){
                return res.status(400).send({msg:"É necessário informar firstMonth e lastMonth"})
            } 
            if(id.length === 1){
                const formula = await formulaService.findById(id);
                if(!formula) return res.status(404).send({msg:"Fórmula não encontrada!"})
                const processedAmount = await formulaService.processFormula(formula, firstMonth, lastMonth);
                return res.status(200).send({ processedAmount: processedAmount });
            }
            if (typeof id === 'string') {
                if (!/^[0-9,]+$/.test(id)) {
                    return res.status(400).send({ msg: "IDs inválidos" });
                }
                id = id.split(',').map(Number).filter(n => !isNaN(n));
            }
            const processed = []
            let i = 0
            for(const formulaId of id){
                const formula =  await formulaService.findById(formulaId);
                if(!formula) return res.status(404).send({msg:`Fórmula com id ${formulaId} não encontrada!`})

                processed.push(await formulaService.processFormula(formula, firstMonth, lastMonth))
            }
            return res.status(200).send({ processedAmounts: processed });
        } catch (err) {
            console.log(err.message)
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