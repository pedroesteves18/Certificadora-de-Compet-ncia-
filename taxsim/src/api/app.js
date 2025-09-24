import express from "express";
import connectDB from "./config/connection.js";
import dotenv from 'dotenv'
import userRoutes from './user/routes/user.js'


dotenv.config()
const app = express();
app.use(express.json());


app.use('/api/users', userRoutes)

app.listen(process.env.PORT, async () =>{
    await connectDB();
    console.log('server running')
});