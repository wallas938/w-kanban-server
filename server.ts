import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoClient, ServerApiVersion, MongoClientOptions } from "mongodb";
dotenv.config();
// TODO: Replace the following with your app's Firebase project configuration
const app = express();
// Initialize Firebase

const port = process.env.PORT || 3000;
const client = new MongoClient(`${process.env.URI}`);

app.use(express.json());

app.listen(port, async () => {
  client.connect((err) => {
    console.log("Connection successful");
    client.close();
  });
});
