import userService from './user.services.js'
import { generateToken } from '../auth/token.js'
import { createUserSchema, loginSchema, updateUserSchema } from '../utils/validation.js';

const userController = {
    create: async (req,res) => {
        try{
            // Validação com Zod
            const validation = createUserSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).send({ msg: "Dados inválidos", errors: validation.error.errors });
            }
            
            const user = validation.data;
            const usedEmail = await userService.findByEmail(user)
            if(usedEmail) return res.status(409).send({msg:"Email já em uso!"})
            
            const createdUser = await userService.create(user)
            if(!createdUser) return res.status(400).send({msg:"Usuário não criado!"})
            
            // Remove a senha da resposta
            const { password, ...userResponse } = createdUser.dataValues;
            return res.status(200).send({msg:"Usuário criado!", user: userResponse})
        }catch(err){
            return res.status(500).send({error:err.message})
        }
    },
    login: async (req,res) => {
        try{
            // Validação com Zod
            const validation = loginSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).send({ msg: "Dados inválidos", errors: validation.error.errors });
            }

            const {email, password} = validation.data
            const loggedUser = await userService.login(email, password)
            if(!loggedUser) return res.status(401).send({msg:"Credenciais inválidas!"})
            
            const token = generateToken(loggedUser)
            res.setHeader('Authorization', `Bearer ${token}`)
            
            // Remove a senha da resposta
            const { password: _, ...userResponse } = loggedUser.dataValues;
            return res.status(200).send({msg:"Login realizado com sucesso!", user: userResponse, token: token})
        }catch(err){
            return res.status(500).send({error:err.message})
        }
    },
    update: async (req,res) => {
        try{
             // Validação com Zod
            const validation = updateUserSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).send({ msg: "Dados inválidos", errors: validation.error.errors });
            }

            const userId = req.user.id
            const userData = validation.data
            
            if (Object.keys(userData).length === 0) {
                 return res.status(400).send({ msg: "Nenhum dado para atualizar" });
            }

            const updatedUser = await userService.update(userId, userData)
            if(!updatedUser) return res.status(400).send({msg:"Usuário não atualizado!"})

            // Remove a senha da resposta
            const { password, ...userResponse } = updatedUser.dataValues;
            return res.status(200).send({msg:"Usuário atualizado!", user: userResponse})
        }catch(err){
            return res.status(500).send({error: err.message})
        }
    },
    delete: async (req,res) => {
        try{
            const userId = req.user.id
            const deletedUser = await userService.delete(userId)
            if(!deletedUser) return res.status(400).send({msg:"Usuário não deletado!"})
            return res.status(200).send({msg:"Usuário deletado!"})
        }catch(err){
            return res.status(500).send({error: err.message})
        }
    },
    getUser: async (req,res) => {
        try{
            const userId = req.user.id
            const user = await userService.findById(userId)
            if (!user) {
                return res.status(404).send({ msg: "Usuário não encontrado" });
            }
            // Remove a senha da resposta
            const { password, ...userResponse } = user.dataValues;
            return res.status(200).send({user: userResponse})
        }catch(err){
            return res.status(500).send({error: err.message})
        }
    }
}

export default userController