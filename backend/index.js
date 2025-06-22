import express from "express";
import dotenv from "dotenv";

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("api/user", userRouter);

app.listen(port, () => {
  connectDb();
  console.log(`port is listening at ${port}`);
});
