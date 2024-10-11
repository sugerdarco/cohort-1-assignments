import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_DBNAME}`)
    .then(res => console.log("connected to mongodb. response:", res))
    .catch((err) => console.log("Error while connecting to mongodb. error:", err));
