import express from "express";

// TODO: Replace the following with your app's Firebase project configuration
const app = express();
// Initialize Firebase
const port = process.env.PORT || 3000;

app.use(express.json());

/* Routes */
/* app.use("/auth", authRoutes); */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
