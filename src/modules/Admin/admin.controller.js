import { Router } from "express";
import { Approvecompany, banCompany, banUser } from "./admin.service.js";
import {
  Authentication,
  Authorization,
} from "../../middleware/Authentcationn.js";
import { RoleTypes } from "../../utils/enumTypes.js";
import {Validation} from "../../middleware/Valid.js";
import { ApprovecompanyValidation, banCompanyValidation, banUserValidation } from "./Admin.validation.js";
const AdminRouter = Router();

AdminRouter.patch(
  "/banOrNotBanuser/:userId",
  Authentication,
  Authorization(RoleTypes.ADMIN),
  Validation(banUserValidation),
  banUser
);
AdminRouter.patch(
  "/banornotbannCompany/:companyId",
  Authentication,
  Authorization(RoleTypes.ADMIN),
  Validation(banCompanyValidation),
  banCompany
);
AdminRouter.patch(
  "/Approvecompany/:companyId",
  Authentication,
  Authorization(RoleTypes.ADMIN),
  Validation(ApprovecompanyValidation),
  Approvecompany
);

export default AdminRouter;
