import sequelize from "./database.js";

async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    process.exit(1);
  }
}

export default connectDB;