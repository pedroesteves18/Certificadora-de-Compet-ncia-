import userService from './user.services.js'
import { generateToken } from '../auth/token.js'

const userController = {
    create: async (req,res) => {
        try{
            const user = req.body
            const usedEmail = await userService.findByEmail(user)
            if(usedEmail) return res.status(409).send({msg:"Email já em uso!"})
            const createdUser = await userService.create(user)
            console.log(createdUser)
            if(!createdUser) return res.status(400).send({msg:"Usuário não criado!"})
            return res.status(200).send({msg:"Usuário criado!", user:createdUser})
        }catch(err){
            return res.status(500).send({error:err.message})
        }
    },
    login: async (req,res) => {
        try{
            const {email, password} = req.body
            const loggedUser = await userService.login(email, password)
            if(!loggedUser) return res.status(401).send({msg:"Credenciais inválidas!"})
            const token = generateToken(loggedUser)
            res.setHeader('Authorization', `Bearer ${token}`)
            return res.status(200).send({msg:"Login realizado com sucesso!", user:loggedUser, token: token})
        }catch(err){
            return res.status(500).send({error:err.message})
        }
    },
    update: async (req,res) => {
        try{
            const userId = req.user.id
            const userData = req.body
            const updatedUser = await userService.update(userId, userData)
            if(!updatedUser) return res.status(400).send({msg:"Usuário não atualizado!"})
            return res.status(200).send({msg:"Usuário atualizado!", user:updatedUser})
        }catch(err){
            return res.status(500).send({error: err.message})
        }
    },
    delete: async (req,res) => {
        try{
            const userId = req.user.id
            const deletedUser = await userService.delete(userId)
            if(!deletedUser) return res.status(400).send({msg:"Usuário não deletado!"})
            return res.status(200).send({msg:"Usuário deletado!", user:deletedUser})
        }catch(err){
            return res.status(500).send({error: err.message})
        }
    },
    getUser: async (req,res) => {
        try{
            const userId = req.user.id
            console.log(userId)
            const user = await userService.findById(userId)
            return res.status(200).send({user:user})
        }catch(err){
            return res.status(500).send({error: err.message})
        }
    }
}

export default userController