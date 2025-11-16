import sequelize from "./database.js";
import User from "../user/user.model.js";
import Formula from "../formula/formula.model.js";
import Tax from "../tax/tax.model.js";
import Investment from "../investment/investment.model.js";

const tableAssociations = async (User,Formula,Tax,Investment) => {
  User.hasMany(Formula, {foreignKey: "userId"})
  Formula.belongsTo(User, {foreignKey: "userId"})

  Formula.hasMany(Tax, {foreignKey: "formulaId", onDelete: 'CASCADE'})
  Tax.belongsTo(Formula, {foreignKey: "formulaId"})
  Formula.hasMany(Investment, {foreignKey: "formulaId", onDelete: 'CASCADE'})
  Investment.belongsTo(Formula, {foreignKey: "formulaId"})
}



async function connectDB() {
  try {
    console.log(process.env.DB_PASS)
    await sequelize.authenticate();
    await tableAssociations(User,Formula,Tax,Investment)
    await sequelize.sync({alter: true, force: false});
  } catch (error) {
    console.log(error.message)
    process.exit(1);
  }
}

export default connectDB;