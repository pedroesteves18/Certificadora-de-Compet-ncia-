import sequelize from '../config/database.js'
import { DataTypes } from 'sequelize'

const User = await sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin','default'),
        defaultValue: 'default',
        allowNull: false
    }
})

export default User