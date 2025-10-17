import express from "express";
import connectDB from "./config/connection.js";
import dotenv from 'dotenv'
import userRoutes from './user/routes/user.js'
import taxRoutes from './tax/routes/tax.js'

dotenv.config()
const app = express();
app.use(express.json());


app.use('/api/users', userRoutes)
app.use('/api/taxes', taxRoutes)


app.listen(process.env.PORT, '0.0.0.0', async () =>{
    await connectDB();
    console.log('server running on port', process.env.PORT);
});