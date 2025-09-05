import express from "express";
import connectDB from "./config/connection.js";

const app = express();
app.use(express.json());


app.listen(process.env.PORT, () =>{
    connectDB();
    console.log('server running')
});