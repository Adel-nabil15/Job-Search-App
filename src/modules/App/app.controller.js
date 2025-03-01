import { Router } from "express";
import { fileFilter, multerHost } from "../../middleware/multer.js";
import { generateExcel, JoinJob, StatusOfJob } from "./app.service.js";
import {
  Authentication,
  Authorization,
} from "../../middleware/Authentcationn.js";
import { RoleTypes } from "../../utils/enumTypes.js";
import { Validation } from "../../middleware/Valid.js";
import { JoinJobValidation, StatusOfJobValidation } from "./app.validation.js";

const AppRouter = Router();

AppRouter.post(
  "/:jobId",
  multerHost(fileFilter.images).single("CV"),
  Authentication,
  Authorization(RoleTypes.USER),
  Validation(JoinJobValidation),
  JoinJob
);
AppRouter.patch(
  "/StatusOfJob/:companyId/:jobId/:AppId",
  Authentication,
  Validation(StatusOfJobValidation),
  StatusOfJob
);

AppRouter.get(
  "/jenerateExil/:companyId/:date",
  generateExcel
);
export default AppRouter;
