import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();

dotenv.config();
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL, // or 3000
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

import authRoutes from  "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

app.use("/api/user", authRoutes);
app.use("/api/admin", authRoutes);

app.use("/api/task", taskRoutes);
app.use("/api/admin", adminRoutes);

export default app;