import { Router } from "express";
import { AddJob, DeleteJob, searchJobs, searchJobsBy, UbdateJob } from "./job.service.js";
import { Authentication } from "../../middleware/Authentcationn.js";

const JobRouter = Router({mergeParams : true});
JobRouter.post("/AddJob/:companyId",Authentication,AddJob)
JobRouter.patch("/UbdateJob/:companyId/:jobId",Authentication,UbdateJob)
JobRouter.delete("/DeleteJob/:companyId/:jobId",Authentication,DeleteJob)
//
JobRouter.get("/jobs/:jobId?",Authentication,searchJobs)
//
JobRouter.get("/searchJobsBy",Authentication,searchJobsBy)


export default JobRouter;
