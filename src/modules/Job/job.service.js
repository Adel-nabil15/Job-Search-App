import CompanyModel from "../../DB/models/Company.model.js";
import JobModel from "../../DB/models/Job.model.js";
import { asyncHandeler } from "../../utils/error/index.js";
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
  const Company = await CompanyModel.findById(companyId);
  if (!Company) {
    return next(new Error("sorry this Company not found", { cause: 400 }));
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
  if (!(await JobModel.findById(jobId))) {
    return next(new Error("I can't find the Job", { cause: 400 }));
  }
  const Company = await CompanyModel.findById(companyId);
  if (!Company) {
    return next(new Error("sorry this Company not found", { cause: 400 }));
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

  const Company = await CompanyModel.findById(companyId);
  if (!Company) {
    return next(new Error("sorry this Company not found", { cause: 400 }));
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
    company = await CompanyModel.findById(companyId);
  } else if (companyName) {
    company = await CompanyModel.findOne({
      companyName: { $regex: companyName, $options: "i" },
    });
  } else {
    return next(
      new Error("Please provide either companyId or companyName", {
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

// ---------------  ----------------------------------
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
  if (jobTitle) filter.jobTitle ={$regex : jobTitle  , $options : "i"};

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
