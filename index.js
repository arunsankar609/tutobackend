import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import { protect } from "./middlewares/protect.js";
import { verifyUser } from "./controllers/user.controller.js";
dotenv.config();
const app = express();
app.use(cors());

app.use(express.json({ limit: "50mb" }));
const arr = [{ name: "Arun", Age: "28" }];
app.get("/", (req, res) => {
  res.send({ message: "hello word" });
});
app.get("/test", protect, (req, res) => {
  res.send(arr);
});

app.use("/api/v1/users", userRouter);

connectDB(process.env.MONGO_URL);

app.listen(process.env.PORT, () => {
  console.log(`Now listening on port ${process.env.PORT}`);
});
