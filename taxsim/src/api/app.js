import express from "express";
import connectDB from "./config/connection.js";
import dotenv from 'dotenv'
import userRoutes from './user/user.routes.js'
import taxRoutes from './tax/tax.routes.js'
import investmentRoutes from './investment/investment.routes.js'
import formulaRoutes from './formula/formula.routes.js'
import swaggerUi from 'swagger-ui-express'
import { specs } from './docs/swagger.js'
import cors from 'cors';

dotenv.config()
const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRoutes)
app.use('/api/taxes', taxRoutes)
app.use('/api/formulas', formulaRoutes)
app.use('/api/investments', investmentRoutes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(process.env.PORT, '0.0.0.0', async () =>{
    await connectDB();
    console.log('server running on port', process.env.PORT);
});