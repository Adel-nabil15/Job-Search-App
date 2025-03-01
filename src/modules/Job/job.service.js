import CompanyModel from "../../DB/models/Company.model.js";
import JobModel from "../../DB/models/Job.model.js";
import { asyncHandeler } from "../../utils/error/index.js";
import AppModel from "../../DB/models/Application.js";
import { pagination, paginationBy } from "../../utils/pagination/index.js";

// --------------- AddJob ----------------------------------
export const AddJob = asyncHandeler(async (req, res, next) => {
  const { companyId } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime, 
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills, 
  } = req.body;
  const Company = await CompanyModel.findOne({_id:companyId , bannedAt: { $exists: false }});
  if (!Company) {
    return next(new Error("sorry this Company not found or ban", { cause: 400 }));
  }
  if (
    Company.CreatedBy.toString() != req.user._id.toString() &&
    Company.HRs.some((id) => id.toString() != req.user._id.toString())
  ) {
    return next(new Error("sorry You can't add This job", { cause: 400 }));
  }
  const job = await JobModel.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: req.user._id,
    companyId,
  });

  return res.status(200).json({ msg: "done", job });
});

// --------------- UbdateJob ----------------------------------
export const UbdateJob = asyncHandeler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    closed,
  } = req.body;
  const Company = await CompanyModel.findOne({_id:companyId,bannedAt: { $exists: false }});
  if (!Company) {
    return next(new Error("sorry this Company not found or bann", { cause: 400 }));
  }

  if (!(await JobModel.findById(jobId))) {
    return next(new Error("I can't find the Job", { cause: 400 }));
  }

  if (Company.CreatedBy.toString() != req.user._id.toString()) {
    return next(new Error("sorry You can't add This job", { cause: 400 }));
  }
  if (req.body.closed) {
    if (closed != "true" && closed != "false") {
      return next(
        new Error("value of Closed is [true or false]", { cause: 400 })
      );
    }
  }
  const NewUpdate = await JobModel.findByIdAndUpdate(jobId, req.body, {
    new: true,
  });

  return res.status(200).json({ msg: "done", NewUpdate });
});

// --------------- DeleteJob ----------------------------------
export const DeleteJob = asyncHandeler(async (req, res, next) => {
  const { companyId, jobId } = req.params;

  const Company = await CompanyModel.findOne({_id:companyId,bannedAt: { $exists: false }});
  if (!Company) {
    return next(new Error("sorry this Company not found or bann", { cause: 400 }));
  }

  if (!(await JobModel.findById(jobId))) {
    return next(new Error("I can't find the Job", { cause: 400 }));
  }
  if (Company.HRs.some((id) => id.toString() != req.user._id.toString())) {
    return next(
      new Error("sorry you Don't allow to Delete Job", { cause: 400 })
    );
  }
  await JobModel.findByIdAndDelete(jobId);
  return res.status(200).json({ msg: "Deleted Done " });
});

// --------------- searshJobs ----------------------------------
export const searchJobs = asyncHandeler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const { companyName, page } = req.query;
  // if send optinal jobId
  if (jobId) {
    const job = await JobModel.findById(jobId);
    if (!job) {
      return next(new Error("Job not found", { cause: 404 }));
    }
    return res.status(200).json({ msg: "Done", job });
  }
  // save value in company
  let company;
  // if send companyId || companyName
  if (companyId) {
    company = await CompanyModel.findOne({_id:companyId , bannedAt: { $exists: false }});
  } else if (companyName) {
    company = await CompanyModel.findOne({
      companyName: { $regex: companyName, $options: "i" },bannedAt: { $exists: false }
    });
  } else {
    return next(
      new Error("Please provide either companyId or companyName or company is bann", {
        cause: 400,
      })
    );
  }
  if (!company) {
    return next(new Error("Sorry, company not found", { cause: 404 }));
  }

  // pagination
  const {
    data: jobs,
    _page,
    totalCount,
  } = await pagination({ page, model: JobModel });

  return res.status(200).json({
    msg: "Done",
    allJobs: jobs,
    page: _page,
    totalCount,
  });
});
  
// --------------- searchJobsBy ----------------------------------
export const searchJobsBy = asyncHandeler(async (req, res, next) => {
  const {
    page,
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;

  let filter = {};

  if (workingTime) filter.workingTime = workingTime;
  if (jobLocation) filter.jobLocation = jobLocation;
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
  if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" };

  if (technicalSkills) {
    const skillsArray = technicalSkills.split(",");
    filter.technicalSkills = { $in: skillsArray };
  }
  const {
    data: jobs,
    _page,
    totalCount,
  } = await paginationBy({
    page,
    model: JobModel,
    populate: ["companyId"],
    sort: { createdAt: -1 },
    filter,
  });

  return res.status(200).json({
    msg: "Done",
    allJobs: jobs,
    page: _page,
    totalCount,
  });
});

// --------------- GetAllAPP ----------------------------------
export const GetAllAPP = asyncHandeler(async (req, res, next) => {
  const { companyId, jobId } = req.params;
  const { page } = req.query;
  const company = await CompanyModel.findById(companyId);
  if (!company) {
    return next(new Error("sorry this company not found", { cause: 400 }));
  }
  const job = await JobModel.findById(jobId);
  if (!job) {
    return next(new Error("sorry this Job not found", { cause: 400 }));
  }
  if (
    company.CreatedBy.toString() != req.user._id.toString() &&
    company.HRs.some((id) => id.toString() != req.user._id)
  ) {
    return next(new Error("sorry You can't do that", { cause: 400 }));
  }
  
  const Job = await JobModel.findById(jobId).populate({
    path:"CV",
    populate:{path:"userId"}
  });
  
// ------------الكودا دا فيه ال pagination المطلوب ---------------
  // const { data, _page } = await pagination({
  //   page,
  //   model: JobModel,
  //   populate:["CV"],
  //   sort: { createdAt: -1 },
  // });
  // res.status(200).json({ msg: "done", ALLcv: data, page: _page });
// ------------------------------------------------------------------
  res.status(200).json({ msg: "done", Job});
});
