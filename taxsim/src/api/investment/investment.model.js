import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";



const Investment = await sequelize.define('Investment', {
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    factor: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM("Ação","Fundo Imobiliário","Renda Fixa","Criptomoeda","Outro")
    },
    formulaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Formulas',
            key: 'id'
        }
    }
},{
    tableName: 'Investments'
})

export default Investment