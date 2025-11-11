import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";



const Tax = await sequelize.define('Tax', {
    initial: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    end: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    factor: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM("Percent","Fixed","Multiplier","Progressive","Regressive","Capped")
    },
    formulaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Formulas',
            key: 'id'
        }
    }
},{
    tableName: 'Taxes'
})

export default Tax