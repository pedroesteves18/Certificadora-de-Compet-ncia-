import userService from '../services/user.js'

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
    }
}

export default userController