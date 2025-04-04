import express from "express";
import authroutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./DB/connectMongoDB.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //to parse form data
app.use(cookieParser()); //to parse cookies

app.use("/api/auth", authroutes);

app.listen(PORT, () => {
  connectMongoDB();
  console.log("Server is running on port:", PORT);
});
