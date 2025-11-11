import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";


const Formula = await sequelize.define('Formula',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

},{
    tableName: 'Formulas'
}
)

export default Formula