import UserModel from "../../DB/models/User.model.js";
import cloudinary from "../../utils/cloudnairy/index.js";
import { eventEmiteer } from "../../utils/email/index.js";
import { RoleTypes } from "../../utils/enumTypes.js";
import { asyncHandeler } from "../../utils/error/index.js";
import { COMPARE } from "../../utils/Hash/compare.js";
import { C_TOKEN } from "../../utils/token/creatToken.js";
import { OTPtypes } from "../../utils/enumTypes.js";

// ------------------ signUp ------------------------------
export const signUp = asyncHandeler(async (req, res, next) => {
  const { firstName, lastName, email, DOB, mobileNumber, gender, password } =
    req.body;
  if (await UserModel.findOne({ email })) {
    return next(new Error("Email already Exist ", { cause: 400 }));
  }
  // upload pic
  if (!req.file) {
    return next(new Error("i nead a profilePic", { cause: 400 }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path
  );
  // creat user
  const user = await UserModel.create({
    firstName,
    lastName,
    email,
    DOB,
    mobileNumber,
    gender,
    password,
    profilePic: { public_id, secure_url },
  });
  // send otp
  eventEmiteer.emit("SendOTP", { email });
  return res.status(200).json({ msg: "done", user });
});

// ------------------ confirmOTP ------------------------------
export const confirmOTP = asyncHandeler(async (req, res, next) => {
  const { email, code } = req.body;
  const checkUser = await UserModel.findOne({ email });
  if (!checkUser) {
    return next(new Error("Email not found", { cause: 400 }));
  }
  
  const validOTP = checkUser.OTP.find(otp => 
    otp.type === OTPtypes.C_email && 
    new Date(otp.expiresIn) > new Date()
  );
  
  if (!validOTP) {
    return next(new Error("OTP has expired", { cause: 400 }));
  }
  const otpEntry = checkUser.OTP.find((otp) => otp.code);
  if (!otpEntry) {
    return next(new Error("OTP is invalid", { cause: 400 }));
  }
  const CompareOTP = await COMPARE({ key: code, keyhashed: otpEntry.code });
  if (!CompareOTP) {
    return next(new Error("code is not match", { cause: 400 }));

  }
  const user = await UserModel.findOneAndUpdate(
    { email },
    { isConfirmed: true },
    { new: true }
  );

  return res.status(200).json({ msg: "done", user });
});

// ------------------ signIn ------------------------------
export const signIn = asyncHandeler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email, isConfirmed: true, so });
  if (!user) {
    return next(
      new Error("sorry this email is not exist or not confirmed", {
        cause: 400,
      })
    );
  }
  if (!(await COMPARE({ key: password, keyhashed: user.password }))) {
    return next(new Error("password is wrong ", { cause: 400 }));
  }
  const access_token = await C_TOKEN({
    payload: { email },
    SECRIT_KEY:
      user.role == RoleTypes.USER
        ? process.env.USER_SEKRIT_KEY
        : process.env.ADMIN_SEKRIT_KEY,
    option: { expiresIn: "1h" },
  });
  const Refresh_token = await C_TOKEN({
    payload: { email },
    SECRIT_KEY:
      user.role == RoleTypes.USER
        ? process.env.USER_SEKRIT_KEY
        : process.env.ADMIN_SEKRIT_KEY,
    option: { expiresIn: "7d" },
  });

  return res.status(200).json({ msg: "done", access_token, Refresh_token });
});

// ------------------ ForgetPassword ------------------------------
export const ForgetPassword = asyncHandeler(async (req, res, next) => {
  const { email } = req.body;
  

  return res.status(200).json({ msg: "done", access_token, Refresh_token });
});
