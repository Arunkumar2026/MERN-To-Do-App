import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './config/db.js';
import todoRoutes from "./routes/todo.routes.js";
import cors from "cors";

dotenv.config();


const app = express();

// MIDDLEWARE 
app.use(express.json())

app.use(cors());

app.use("/api/todos", todoRoutes);

// Test Route 
app.get("/", (req,res) => {
    res.send("API working...");
});

app.listen(5000, () => {
    connectDB();
    console.log("server started at http://localhost:5000")
});