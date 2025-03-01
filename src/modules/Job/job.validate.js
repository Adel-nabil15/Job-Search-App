import joi from "joi";
import {GeneralRouls} from "../../utils/GeneralRouls.js"

export const AddJobValidation = {
    params: GeneralRouls.id.required(),
    body:joi.object({
        jobTitle:joi.string().required(),
        jobLocation:joi.string().valid("onsite", "remotely", "hybrid").required(),
        workingTime:joi.string().valid("part-time", "full-time").required(),
        seniorityLevel:joi.string().valid("CTO", "Team-Lead", "Senior", "Mid-Level", "fresh", "Junior").required(),
        jobDescription:joi.string().required(),
        technicalSkills:joi.array().items(joi.string()).required(),
        softSkills:joi.array().items(joi.string()).required()
    }).required()
  };

  export const UbdateJobValidation = {
    params: GeneralRouls.id.required(),
    body:joi.object({
        jobTitle:joi.string(),
        jobLocation:joi.string().valid("onsite", "remotely", "hybrid"),
        workingTime:joi.string().valid("part-time", "full-time"),
        seniorityLevel:joi.string().valid("CTO", "Team-Lead", "Senior", "Mid-Level", "fresh", "Junior"),
        jobDescription:joi.string(),
        closed:joi.string().valid("true", "false"),
        technicalSkills:joi.array().items(joi.string()),
        softSkills:joi.array().items(joi.string())
    }).required()
  };


  export const DeleteJobValidation = {
    params: GeneralRouls.id.required(),
  };
//---------------------- searchJobsValidation -------------------------------
  export const searchJobsValidation = {
    params: GeneralRouls.id.required(),
    query:joi.object({
        page:joi.number().integer().min(1).default(1).required()
    }).required()
  };

  //---------------------- searchJobsByValidation -------------------------------
  export const searchJobsByValidation = {
    query:joi.object({
        page: joi.number().integer().min(1).default(1), 
        workingTime: joi.string().valid("full-time", "part-time", "freelance"),
        jobLocation: joi.string().max(100), 
        seniorityLevel: joi.string().valid("junior", "mid", "senior", "lead"), 
        jobTitle: joi.string().min(3).max(50), 
        technicalSkills: joi.array().items(joi.string()).default([]), 
      })
  };

    //---------------------- searchJobsByValidation -------------------------------
    export const GetAllAPPValidation = {
        params: joi.object({
            companyId: GeneralRouls.id.required(),
            jobId: GeneralRouls.id.required()
        }).required()
      };