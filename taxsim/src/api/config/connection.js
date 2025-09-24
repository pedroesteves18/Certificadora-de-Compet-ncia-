import sequelize from "./database.js";
import User from "../user/model/user.js";
import Formula from "../formula/model/formula.js";
import Tax from "../tax/model/tax.js";

const tableAssociations = async (User,Formula,Tax) => {
  User.hasMany(Formula, {foreignKey: "userId"})
  Formula.belongsTo(User, {foreignKey: "userId"})

  Formula.hasMany(Tax, {foreignKey: "formulaId"})
  Tax.belongsTo(Formula, {foreignKey: "formulaId"})
}



async function connectDB() {
  try {
    console.log(process.env.DB_PASS)
    await sequelize.authenticate();
    await tableAssociations(User,Formula,Tax)
    await sequelize.sync({alter: true, force: false});
  } catch (error) {
    console.log(error.message)
    process.exit(1);
  }
}

export default connectDB;