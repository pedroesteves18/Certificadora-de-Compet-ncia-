import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";



const Tax = sequelize.define('Tax', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  mode: {
    type: DataTypes.ENUM("percent", "fixed"),
    allowNull: false
  },

  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  appliesTo: {
    type: DataTypes.ENUM("profit", "initial", "total"),
    allowNull: false
  },

  formulaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Formulas',
      key: 'id'
    }
  }
}, {
  tableName: 'Taxes'
});

export default Tax;