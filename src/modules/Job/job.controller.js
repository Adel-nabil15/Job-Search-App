import { Router } from "express";
import { Validation } from "../../middleware/Valid.js";
import {
  AddJob,
  DeleteJob,
  GetAllAPP,
  searchJobs,
  searchJobsBy,
  UbdateJob,
} from "./job.service.js";
import { Authentication } from "../../middleware/Authentcationn.js";
import {
  AddJobValidation,
  DeleteJobValidation,
  GetAllAPPValidation,
  searchJobsByValidation,
  UbdateJobValidation,
} from "./job.validate.js";

const JobRouter = Router({ mergeParams: true });
JobRouter.post(
  "/AddJob/:companyId",
  Authentication,
  Validation(AddJobValidation),
  AddJob
);
JobRouter.patch(
  "/UbdateJob/:companyId/:jobId",
  Authentication,
  Validation(UbdateJobValidation),
  UbdateJob
);
JobRouter.delete(
  "/DeleteJob/:companyId/:jobId",
  Authentication,
  Validation(DeleteJobValidation),
  DeleteJob
);
//
JobRouter.get(
  "/jobs/:jobId?",
  Authentication,
  Validation(DeleteJobValidation),
  searchJobs
);
//
JobRouter.get(
  "/searchJobsBy",
  Authentication,
  Validation(searchJobsByValidation),
  searchJobsBy
);
JobRouter.get(
  "/GetAllAPP/:companyId/:jobId",
  Authentication,
  Validation(GetAllAPPValidation),
  GetAllAPP
);

export default JobRouter;
