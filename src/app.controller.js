import DBC from "./DB/DBC.js";
import AuthRouter from "./modules/Auth/Auth.controller.js";
import { globalErrorHandel } from "./utils/error/index.js";

const bootstrapp = (express, app) => {
  app.use(express.json());
  DBC();
  app.use("/Auth", AuthRouter);
  app.use(globalErrorHandel);

  app.use("*", (req, res, next) => {
    res.status(400).json(`Url is wrong `);
  });
};
export default bootstrapp;
