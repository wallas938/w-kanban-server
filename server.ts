import mongoose from "mongoose";
import express from "express";
import * as dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import boardRoutes from "./routes/board.routes";
import authMiddlewares from "./middlewares/auth.middleware";

dotenv.config();
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({origin: "*", methods:"*", allowedHeaders: "*", credentials: true}))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "*"
  );
  next();
});


app.use("/api/users", userRoutes);
app.use(
  "/api/boards",
  authMiddlewares.acc_tkn,
  authMiddlewares.rfsh_tkn,
  boardRoutes
);

app.listen(port, async () => {
  mongoose
    .connect(`${process.env.DATABASE_URI}`)
    .then((result) => {
      console.log("Connected to Database");
    })
    .catch((err) => console.log(err));
});
