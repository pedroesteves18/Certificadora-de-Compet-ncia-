import sequelize from "../../config/database.js";
import { DataTypes } from "sequelize";


const Formula = await sequelize.define('Formula',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

})

export default Formula