import DBC from "./DB/DBC.js";
import AuthRouter from "./modules/Auth/Auth.controller.js";
import CompanyRouter from "./modules/Company/company.controller.js";
import JobRouter from "./modules/Job/job.controller.js";
import UserRouter from "./modules/users/user.controller.js";
import { globalErrorHandel } from "./utils/error/index.js";
import scheduleOTPCleanup from "./utils/node-corn/index.js";

const bootstrapp = (express, app) => {
  app.use(express.json());
  DBC();
  app.use("/Auth", AuthRouter);
  app.use("/users", UserRouter);
  app.use("/Company", CompanyRouter);
  app.use("/job", JobRouter);
  app.use(globalErrorHandel);
  scheduleOTPCleanup();

  app.use("*", (req, res, next) => {
    res.status(400).json(`Url is wrong `);
  });
};
export default bootstrapp;
