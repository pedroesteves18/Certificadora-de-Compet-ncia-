import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
    const payload = {
        id: user.id,    
        email: user.email
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})
}

export const verifyToken = async (req,res,next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1]
        if(!token) return res.status(403).send({msg: "Não autenticado!"})
        const isValid = jwt.verify(token, process.env.JWT_SECRET)
        if(!isValid) return res.status(403).send({msg: "Token inválido!"})
        req.user = isValid
            
        next()
    }catch(err){
        return res.status(500).send({msg:"Erro na verificação do token"})
    }
}