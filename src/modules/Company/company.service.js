import CompanyModel from "../../DB/models/Company.model.js";
import UserModel from "../../DB/models/User.model.js";
import cloudinary from "../../utils/cloudnairy/index.js";
import { RoleTypes } from "../../utils/enumTypes.js";
import { asyncHandeler } from "../../utils/error/index.js";

// --------------- AddCompany ----------------------------------
export const AddCompany = asyncHandeler(async (req, res, next) => {
  // Data from body
  const {
    companyName,
    description, 
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    HRs
  } = req.body;
  // Check if email of company exist Before
  if (await UserModel.findOne({ email: companyEmail })) {
    return next(new Error("sorry this email is Exist Before", { cause: 400 }));
  }
  // Check if name of company exist Before
  if (await CompanyModel.findOne({ companyName })) {
    return next(new Error("sorry this name is exist before", { cause: 400 }));
  }
  // Creat Copany
  const company = await CompanyModel.create({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    HRs,
    CreatedBy: req.user._id,
  });
  res.status(200).json({ msg: "done", company });
});

// --------------- UpdateCompny ----------------------------------
export const UpdateCompny = asyncHandeler(async (req, res, next) => {
  // Data from body
  const { companyId } = req.params;
  const company = await CompanyModel.findById(companyId);
  if (!company) {
    return next(new Error("sorry this Company not found", { cause: 400 }));
  }
  // just owner can update
  if (company.CreatedBy.toString() != req.user._id.toString()) {
    return next(new Error("sorry you not allow to do Ubdate", { cause: 400 }));
  }
  // check if commpany name is used befor or no
  if (req.body.companyName) {
    if (await CompanyModel.findOne({ companyName: req.body.companyName })) {
      return next(new Error("sorry this name is used", { cause: 400 }));
    }
  }
  // remof fildes that con't allow to ubdate
  const DontUpdate = ["approvedByAdmin", "bannedAt", "deletedAt"];
  for (const key of DontUpdate) {
    delete req.body[key];
  }
  // updte Company
  const NewUpdate = await CompanyModel.findByIdAndUpdate(companyId, req.body, {
    new: true,
  });
  res.status(200).json({ msg: "Update is Done", NewUpdate });
});

// --------------- SoftDelete ----------------------------------
export const SoftDelete = asyncHandeler(async (req, res, next) => {
  const { companyId } = req.params;
  // Check if company there
  const CheckCompany = await CompanyModel.findById(companyId);
  if (!CheckCompany) {
    return next(new Error("sorry Copany not found ", { cause: 400 }));
  }
  // you must Be owner or Admin
  if (
    CheckCompany.CreatedBy.toString() != req.user._id.toString() &&
    req.user.role != RoleTypes.ADMIN
  ) {
    return next(new Error("sorry you don't allow to do that", { cause: 400 }));
  }
  // Delete Company
  const DeleteAction = await CompanyModel.findByIdAndUpdate(
    companyId,
    { FreazeCompany: true, deletedAt: Date.now() },
    { new: true }
  );
  return res.status(200).json({ msg: "Company is Delete", DeleteAction });
});

// --------------- GetCompany ----------------------------------
export const GetCompany = asyncHandeler(async (req, res, next) => {
  const { companyId } = req.params;
  // Check if company there and Show with their Jobs
  // Job must contain Jobs To work
  const company = await CompanyModel.findOne({
    _id: companyId,
    FreazeCompany: false,
  })
    .populate("Jobs")
    .lean();
  if (!company) {
    return next(new Error("sorry Copany not found or deleted", { cause: 400 }));
  }
  return res.status(200).json({ msg: "Done", company });
});

// --------------- SearshCompany ----------------------------------
export const SearshCompany = asyncHandeler(async (req, res, next) => {
  const { name } = req.params;
  // search company by name
  const company = await CompanyModel.findOne({
    companyName: name,
    FreazeCompany: false,
    approvedByAdmin: true,
  });
  if (!company) {
    return next(
      new Error("sorry company not found or deleted", { cause: 400 })
    );
  }
  return res.status(200).json({ msg: "Done", company });
});

// --------------- companylogo ----------------------------------
export const companylogo = asyncHandeler(async (req, res, next) => {
  const { companyId } = req.params;
  // Check if company there
  const CheckCompany = await CompanyModel.findById(companyId);
  if (!CheckCompany) {
    return next(new Error("sorry Copany not found ", { cause: 400 }));
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "JopSearch/companyLogo",
      }
    );
    req.body.CompanyCover = { public_id, secure_url };
  }
  const company = await CompanyModel.findOneAndUpdate(
    { _id: companyId, FreazeCompany: false, approvedByAdmin: true },
    { Logo: req.body.CompanyCover },
    { new: true }
  );
  res.status(200).json({ msg: "done ", company });
});

// --------------- CompanyCover ----------------------------------
export const CompanyCover = asyncHandeler(async (req, res, next) => {
  const { companyId } = req.params;
  // Check if company there
  const CheckCompany = await CompanyModel.findById(companyId);
  if (!CheckCompany) {
    return next(new Error("sorry Copany not found ", { cause: 400 }));
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "JopSearch/CompanyCover",
      }
    );
    req.body.CompanyCover = { public_id, secure_url };
  }
  const company = await CompanyModel.findOneAndUpdate(
    { _id: companyId, FreazeCompany: false, approvedByAdmin: true },
    { CoverPic: req.body.CompanyCover },
    { new: true }
  );
  res.status(200).json({ msg: "done ", company });
});

// --------------- Deletecompanylogo ----------------------------------
export const Deletecompanylogo = asyncHandeler(async (req, res, next) => {
  const { companyId } = req.params;
  // Check if company there
  const CheckCompany = await CompanyModel.findById(companyId);
  if (!CheckCompany) {
    return next(new Error("sorry Copany not found ", { cause: 400 }));
  }
  // remove Logo picture from Cloudynary
  await cloudinary.uploader.destroy(CheckCompany.Logo.public_id);
  // remove Logo picture from DB
  const commpany = await CompanyModel.findOneAndUpdate(
    { _id: companyId, FreazeCompany: false, approvedByAdmin: true },
    { $unset: { Logo: "" } },
    { new: true }
  );
  return res.status(200).json({ msg: "done ", commpany });
});

// --------------- DeleteCoverPic ----------------------------------
export const DeleteCoverPic = asyncHandeler(async (req, res, next) => {
  const { companyId } = req.params;
  // Check if company there
  const CheckCompany = await CompanyModel.findById(companyId);
  if (!CheckCompany) {
    return next(new Error("sorry Copany not found ", { cause: 400 }));
  }
  // remove Logo picture from Cloudynary
  await cloudinary.uploader.destroy(CheckCompany.CoverPic.public_id);
  // remove Logo picture from DB
  const commpany = await CompanyModel.findOneAndUpdate(
    { _id: companyId, FreazeCompany: false, approvedByAdmin: true },
    { $unset: { CoverPic: "" } },
    { new: true }
  );
  return res.status(200).json({ msg: "done ", commpany });
});
