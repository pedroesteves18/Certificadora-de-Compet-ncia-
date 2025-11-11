import User from './user.model.js'
import bcrypt from 'bcrypt'


const userService = {
    create: async (user) => {
        user.password = await userService.hashPassword(user.password)
        console.log(user)
        return await User.create({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role

        })
    },
    findById: async (id) => {
        return await User.findByPk(id)
    },
    findByEmail: async (user) => {
        return await User.findOne({
            where: {
                email: user.email
            }
        })
    },
    hashPassword: async (password) => {
        return await bcrypt.hash(password, parseInt(process.env.ROUNDS))
    },
    compare: async (user, password) => {
        return await bcrypt.compare(password, user.password)
    },
    login: async (email, password) =>{
        const user = await userService.findByEmail({email})
        if(!user) return null
        const isMatch = await userService.compare(user, password)
        if(!isMatch) return null
        return user
    }
}

export default userService