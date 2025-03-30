import express from 'express';
import authroutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import connectMongoDB from './DB/connectMongoDB.js';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use("/api/auth", authroutes);

app.listen(8000, () => { 
  connectMongoDB()
  console.log('Server is running on port:', PORT);
})