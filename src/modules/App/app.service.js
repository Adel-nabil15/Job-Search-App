import AppModel from "../../DB/models/Application.js";
import CompanyModel from "../../DB/models/Company.model.js";
import JobModel from "../../DB/models/Job.model.js";
import Send_Email from "../../service/SEND_EMAIL.js";
import cloudinary from "../../utils/cloudnairy/index.js";
import { asyncHandeler } from "../../utils/error/index.js";
import { io } from "../socket/index.js";
import moment from "moment";
import ExcelJS from "exceljs";
// --------------- JoinJob ----------------------------------
export const JoinJob = asyncHandeler(async (req, res, next) => {
  const { jobId } = req.params;
  const job = await JobModel.findById(jobId);
  if (!job) {
    return next(new Error("sorry this job not found", { cause: 400 }));
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path
    );
    req.body.CV = { secure_url, public_id };
  }

  const JoinByCv = await AppModel.create({
    jobId,
    userCV: req.body.CV,
    userId: req.user._id,
  });
  io.to(job.addedBy.toString()).emit("newApplication", {
    jobTitle: job.jobTitle,
    userId: req.user._id,
    userCV: req.body.CV,
  });
  res.status(200).json({ msg: "Done", JoinByCv });
});

// --------------- StatusOfJob ----------------------------------
export const StatusOfJob = asyncHandeler(async (req, res, next) => {
  const { AppId, jobId, companyId } = req.params;
  const { status } = req.body;

  const job = await JobModel.findById(jobId);
  if (!job) return next(new Error("Sorry, this job not found", { cause: 400 }));

  const application = await AppModel.findById(AppId).populate("userId");
  if (!application)
    return next(new Error("Sorry, this application not found", { cause: 400 }));

  const company = await CompanyModel.findById(companyId);
  if (!company)
    return next(new Error("Sorry, this company not found", { cause: 400 }));
  const isHR = company.HRs.some(
    (id) => id.toString() === req.user._id.toString()
  );
  if (!isHR) {
    return next(new Error(" You are not a HR of this company", { cause: 403 }));
  }
  if (!["accepted", "rejected"].includes(status)) {
    return next(
      new Error("Invalid status >> Allowed values: accepted or rejected", {
        cause: 400,
      })
    );
  }

  const updatedApp = await AppModel.findOneAndUpdate(
    { _id: AppId, jobId },
    { status },
    { new: true }
  ).populate("userId", " email firstName lastName");

  if (!updatedApp) {
    return next(
      new Error("Application not found or already updated", { cause: 400 })
    );
  }

  const subject =
    status === "accepted" ? "Congratulations!" : "Application Status";
  const message =
    status === "accepted"
      ? `<h1>Congratulations! You have been accepted for the job.</h1>`
      : `<h1>Sorry, your application has been rejected.</h1>`;

  await Send_Email(updatedApp.userId.email, subject, message);
  res
    .status(200)
    .json({ msg: `Application status updated to ${status}`, updatedApp });
});

// --------------- jenerateExil ponus----------------------------------
export const generateExcel = asyncHandeler(async (req, res, next) => {
  const { companyId, date } = req.params;

  const startOfDay = moment(date, "YYYY-MM-DD").startOf("day").toDate();
  const endOfDay = moment(date, "YYYY-MM-DD").endOf("day").toDate();

  const jobs = await JobModel.find({ companyId }).select("_id");

  if (!jobs.length) {
    return next(new Error("no job found", { cause: 400 }));
  }

  const applications = await AppModel.find({
    jobId: { $in: jobs.map((job) => job._id) },
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  })
    .populate("userId")
    .populate("jobId");

  if (!applications.length) {
    return next(new Error("No applications found for this company on the specified date", { cause: 400 }));
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Company Applications");

  worksheet.columns = [
    { header: "Application Date", key: "date", width: 15 },
    { header: "Applicant Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 25 },
    { header: "Job Title", key: "jobTitle", width: 30 },
    { header: "Status", key: "status", width: 15 },
    { header: "CV ", key: "cv", width: 50 },
  ];

  applications.forEach((application) => {
    worksheet.addRow({
      date: moment(application.createdAt).format("YYYY-MM-DD"),
      name: `${application.userId?.firstName || "N/A"} ${application.userId?.lastName || "N/A"}`,
      email: application.userId?.email || "N/A",
      jobTitle: application.jobId?.jobTitle || "N/A",
      status: application.status || "Pending",
      cv: application.userCV?.secure_url || "No CV uploaded",
    });
  });

  worksheet.getRow(1).font = { bold: true };

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=company-applications-${companyId}-${date}.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
});