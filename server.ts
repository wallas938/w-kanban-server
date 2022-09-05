import mongoose from "mongoose";
import express from "express";
import * as dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/users", userRoutes);

app.listen(port, async () => {
  mongoose
    .connect(`${process.env.DATABASE_URI}`)
    .then((result) => {
      console.log("Connected to Database");
    })
    .catch((err) => console.log(err));
});
