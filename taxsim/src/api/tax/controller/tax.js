import { create } from "domain"
import taxService from "../services/tax.js"

const taxController = {
    create: async (req,res) => {
        try{
            const tax = req.body
            const createdTax = await taxService.create(tax)
            if(!createdTax) return res.status(400).send({msg:"Taxa não criada!"})
            return res.status(200).send({msg:"Taxa criada!", user:createdTax})
        }catch(err){
            return res.status(500).send({error:err.message})
        }
    },
    bulkCreate: async (req,res) => {
        try{
            const taxes = req.body
            const createdTaxes = []
            for(const tax of taxes){
                const createdTax = await taxService.create(tax)
                if(createdTax) createdTaxes.push(createdTax)
            }
            if(createdTaxes.length === 0) return res.status(400).send({msg:"Nenhuma taxa criada!"})
            return res.status(200).send({msg:"Taxas criadas!", taxes:createdTaxes})
        }catch(err){
            return res.status(500).send({error:err.message})
        }
    }
}

export default taxController