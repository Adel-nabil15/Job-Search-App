import express from "express";
import bootstrapp from "./src/app.controller.js";
import dotenv from "dotenv";
import  {RunSocket}  from "./src/modules/socket/index.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
bootstrapp(express, app);

const server = app.listen(port, () => {
  console.log(`server is work on port ${port}`);
});

RunSocket(server)