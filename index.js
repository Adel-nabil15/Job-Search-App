import express from "express";
import bootstrapp from "./src/app.controller.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
bootstrapp(express, app);

app.listen(port, () => {
  console.log(`server is work on port ${port}`);
});
