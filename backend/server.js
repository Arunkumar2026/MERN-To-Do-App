import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './config/db.js';
dotenv.config();


const app = express();

// MIDDLEWARE 
app.use(express.json())

// Test Route 
app.get("/", (req,res) => {
    res.send("API is running");
});

app.listen(5000, () => {
    connectDB();
    console.log("server started at http://localhost:5000")
});