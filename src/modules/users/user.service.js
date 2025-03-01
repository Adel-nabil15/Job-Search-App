import UserModel from "../../DB/models/User.model.js";
import cloudinary from "../../utils/cloudnairy/index.js";
import { ENCRYPT } from "../../utils/Crypto/encrypt.js";
import { asyncHandeler } from "../../utils/error/index.js";
import COMPARE from "../../utils/Hash/compare.js";
import { HASH } from "../../utils/Hash/hach.js";

// --------------- UpdateUser ----------------------------------
export const UpdateUser = asyncHandeler(async (req, res, next) => {
  // if update in phone
  if (req.body.mobileNumber) {
    // encrypt phone Before save
    await ENCRYPT({
      key: req.body.mobileNumber,
      SekretKey: process.env.PHONE_SEKRIT,
    });
  }
  // find user and do Update
  const user = await UserModel.findOneAndUpdate(
    { email: req.user.email },
    { ...req.body },
    { new: true }
  );
  user.save();
  res.status(200).json({ msg: "Update is done ", user });
});

// --------------- getUser ----------------------------------
export const getUser = asyncHandeler(async (req, res, next) => {
  res.status(200).json({ msg: "Update is done ", User: req.user });
});

// --------------- GetProfile ----------------------------------
export const GetProfile = asyncHandeler(async (req, res, next) => {
    const {userId}=req.params
    const user = await UserModel.findById({_id:userId}).select("firstName lastName mobileNumber profilePic coverPic username");

    res.status(200).json({ msg: "done ", user });
  });

// --------------- UpdatePassword ----------------------------------
export const UpdatePassword = asyncHandeler(async (req, res, next) => {
  const { oldpassword, newPassword } = req.body;
  // check confirm password
  if (!(await COMPARE({ key: oldpassword, keyhashed: req.user.password }))) {
    return next(new Error("sorry Old password is wrong", { cause: 400 }));
  }
  // Hash new password
  const hash = await HASH({ key: newPassword, saltOrRounds: 9 });
  // Update new password
  const newUser = await UserModel.findOneAndUpdate(
    { email: req.user.email },
    { password: hash, changeCredentialTime: Date.now() ,updatedBy:req.user._id },
    { new: true }
  );
  // return new User
  res.status(200).json({ msg: "done ", newUser });
});

// --------------- UploadProfilPic ----------------------------------
export const UploadProfilPic = asyncHandeler(async (req, res, next) => {
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "JopSearch/ProfilPic",
      }
    );
    req.body.profilePic = { public_id, secure_url };
  }
  const user = await UserModel.findOneAndUpdate(
    { email: req.user.email },
    { profilePic: req.body.profilePic },
    { new: true }
  );

  res.status(200).json({ msg: "done ", user });
});

// --------------- UploadCoverPic ----------------------------------
export const UploadCoverPic = asyncHandeler(async (req, res, next) => {
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "JopSearch/CoverPic",
      }
    );
    req.body.CoverPic = { public_id, secure_url };
  }
  const user = await UserModel.findOneAndUpdate(
    { email: req.user.email },
    { coverPic: req.body.CoverPic },
    { new: true }
  );

  res.status(200).json({ msg: "done ", user });
});

// --------------- DeleteProfilePic ----------------------------------
export const DeleteProfilePic = asyncHandeler(async (req, res, next) => {
  try {
    await cloudinary.uploader.destroy(req.user.profilePic.public_id);
    const user = await UserModel.findOneAndUpdate(
      { email: req.user.email },
      { $unset: { profilePic: "" } },
      { new: true }
    );
    return res.status(200).json({ msg: "done ", user });
  } catch (error) {
    return res.status(400).json({ msg: "i don't find a Picture " });
  }
});

// --------------- DeletecoverPic----------------------------------
export const DeletecoverPic = asyncHandeler(async (req, res, next) => {
  try {
    await cloudinary.uploader.destroy(req.user.coverPic.public_id);
    const user = await UserModel.findOneAndUpdate(
      { email: req.user.email },
      { $unset: { coverPic: "" } },
      { new: true }
    );
    return res.status(200).json({ msg: "done ", user });
  } catch (error) {
    return res.status(400).json({ msg: "i don't find a Picture " });
  }
});

// --------------- SoftDelete----------------------------------
export const SoftDelete = asyncHandeler(async (req, res, next) => {
 const user = await UserModel.findByIdAndUpdate({_id:req.user._id},{FreazUser : true, deletedAt:Date.now() },{new: true})
 res.status(200).json({msg: "Account is Deleted",user})
});

