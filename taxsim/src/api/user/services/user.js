import User from '../model/user.js'
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
    findById: async (user) => {
        return await User.findByPk(user.id)
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
    }
}

export default userService