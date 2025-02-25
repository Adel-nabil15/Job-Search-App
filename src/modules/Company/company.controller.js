import { Router } from "express";
import {
  AddCompany,
  CompanyCover,
  companylogo,
  Deletecompanylogo,
  DeleteCoverPic,
  GetCompany,
  SearshCompany,
  SoftDelete,
  UpdateCompny,
} from "./company.service.js";
import { Authentication } from "../../middleware/Authentcationn.js";
import { fileFilter, multerHost } from "../../middleware/multer.js";
const CompanyRouter = Router();

CompanyRouter.post("/AddCompany", Authentication, AddCompany);
CompanyRouter.patch("/UpdateCompny/:companyId", Authentication, UpdateCompny);
CompanyRouter.delete("/SoftDelete/:companyId", Authentication, SoftDelete);
CompanyRouter.get("/GetCompany/:companyId", Authentication, GetCompany);
CompanyRouter.get("/SearshCompany/:name", Authentication, SearshCompany);
CompanyRouter.patch(
  "/companylogo/:companyId",
  multerHost(fileFilter.images).single("companyLogo"),
  Authentication,
  companylogo
);
CompanyRouter.patch(
  "/CompanyCover/:companyId",
  multerHost(fileFilter.images).single("CompanyCover"),
  Authentication,
  CompanyCover
);
CompanyRouter.delete(
  "/Deletecompanylogo/:companyId",
  Authentication,
  Deletecompanylogo
);
CompanyRouter.delete(
  "/DeleteCoverPic/:companyId",
  Authentication,
  DeleteCoverPic
);

export default CompanyRouter;
