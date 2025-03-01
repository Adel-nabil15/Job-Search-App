import { Router } from "express";
import { Validation } from "../../middleware/Valid.js";
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
import JobRouter from "../Job/job.controller.js";
import {
  AddCompanyValidation,
  CompanyCoverValidation,
  companylogoValidation,
  DeletecompanylogoValidation,
  DeleteCoverPicValidation,
  GetCompanyValidation,
  SearshCompanyValidation,
  SoftDeleteValidation,
  UpdateCompnyValidation,
} from "./company.validate.js";
const CompanyRouter = Router({ mergeParams: true });

CompanyRouter.use("/:companyId", JobRouter);
CompanyRouter.use("/", JobRouter);

CompanyRouter.post(
  "/AddCompany",
  Authentication,
  Validation(AddCompanyValidation),
  AddCompany
);
CompanyRouter.patch(
  "/UpdateCompny/:companyId",
  Authentication,
  Validation(UpdateCompnyValidation),
  UpdateCompny
);
CompanyRouter.delete(
  "/SoftDelete/:companyId",
  Authentication,
  Validation(SoftDeleteValidation),
  SoftDelete
);

  CompanyRouter.get(
    "/GetCompany/:companyId",
    Authentication,
    Validation(GetCompanyValidation),
    GetCompany
  );
CompanyRouter.get(
  "/SearshCompany/:name",
  Authentication,
  Validation(SearshCompanyValidation),
  SearshCompany
);
CompanyRouter.patch(
  "/companylogo/:companyId",
  multerHost(fileFilter.images).single("companyLogo"),
  Authentication,
  Validation(companylogoValidation),
  companylogo
);
CompanyRouter.patch(
  "/CompanyCover/:companyId",
  multerHost(fileFilter.images).single("CompanyCover"),
  Authentication,
  Validation(CompanyCoverValidation),
  CompanyCover
);
CompanyRouter.delete(
  "/Deletecompanylogo/:companyId",
  Authentication,
  Validation(DeletecompanylogoValidation),
  Deletecompanylogo
);
CompanyRouter.delete(
  "/DeleteCoverPic/:companyId",
  Authentication,
  Validation(DeleteCoverPicValidation),
  DeleteCoverPic
);

export default CompanyRouter;
