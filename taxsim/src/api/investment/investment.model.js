import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Investment = sequelize.define('Investment', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  
  interestRate: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  type: {
    type: DataTypes.ENUM("Acao", "FII", "RendaFixa", "Cripto", "Cambio"),
    allowNull: false
  },

  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },

  formulaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Formulas',
      key: 'id'
    }
  }

}, {
  tableName: 'Investments'
});

export default Investment;
