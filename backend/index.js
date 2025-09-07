import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import filesRouter from "./routes/files.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Vite 기본 포트
app.use(express.json());

app.use("/api/files", filesRouter);

await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT, () => console.log("server on", process.env.PORT));
