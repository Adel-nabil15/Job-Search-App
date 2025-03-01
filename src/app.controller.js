import { createHandler } from "graphql-http/lib/use/express";
import DBC from "./DB/DBC.js";
import AdminRouter from "./modules/Admin/admin.controller.js";
import AppRouter from "./modules/App/app.controller.js";
import AuthRouter from "./modules/Auth/Auth.controller.js";
import CompanyRouter from "./modules/Company/company.controller.js";
import JobRouter from "./modules/Job/job.controller.js";
import UserRouter from "./modules/users/user.controller.js";
import { globalErrorHandel } from "./utils/error/index.js";
import scheduleOTPCleanup from "./utils/node-corn/index.js";
import { schema } from "./graph.schema.js";
import ChatRouter from "./modules/chat/chat.controller.js";

const bootstrapp = (express, app) => {
  app.use(express.json());
  DBC();
  app.use("/Auth", AuthRouter);
  app.use("/users", UserRouter);
  app.use("/Company", CompanyRouter);
  app.use("/job", JobRouter);
  app.use("/App", AppRouter);
  app.use("/Admin", AdminRouter);
  // controller of cht
  app.use("/chat", ChatRouter);
  // controller of graphql
  app.use(
    "/graphql",
    createHandler({
      schema,
      context: (req) => {
        const { authorization } = req.headers;
        return { authorization };
      },
      formatError :(err)=>{
        return {
          success :false,
          message :err.originalError?.message,
          statusCode: err.originalError?.cuse || 500
        }
      }
    })
  );
  // globalErrorHandel topic
  app.use(globalErrorHandel);
  // Corn Jop
  scheduleOTPCleanup();

  app.use("*", (req, res, next) => {
    res.status(400).json(`Url is wrong `);
  });
};
export default bootstrapp;
