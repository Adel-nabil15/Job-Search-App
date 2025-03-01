import UserModel from "../../DB/models/User.model.js";
import { eventEmiteer } from "../../utils/email/index.js";
import { RoleTypes } from "../../utils/enumTypes.js";
import { asyncHandeler } from "../../utils/error/index.js";
import { C_TOKEN } from "../../utils/token/creatToken.js";
import { OTPtypes } from "../../utils/enumTypes.js";
import { V_TOKEN } from "../../utils/token/verifyToken.js";
import COMPARE from "../../utils/Hash/compare.js";

// ------------------ signUp ------------------------------
export const signUp = asyncHandeler(async (req, res, next) => {
  const { firstName, lastName, email, DOB, mobileNumber, gender, password } =
    req.body;
    const CheckUser = await UserModel.findOne({ email })
  if (!CheckUser || CheckUser.bannedAt) {
    return next(new Error("Email already Exist or banned ", { cause: 400 }));
  }
  // creat user
  const user = await UserModel.create({
    firstName,
    lastName,
    email,
    DOB,
    mobileNumber,
    gender,
    password,
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

  const validOTP = checkUser.OTP.find(
    (otp) =>
      otp.type === OTPtypes.C_email && new Date(otp.expiresIn) > new Date()
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
  const user = await UserModel.findOne({ email, isConfirmed: true ,FreazUser :false });
  if (!user) {
    return next(
      new Error("sorry this email is not exist or not confirmed or account is Delete", {
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
        ? process.env.ACCESS_USER_KEY
        : process.env.ACCESS_ADMIN_KEY,
    option: { expiresIn: "1d" },
  });
  const Refresh_token = await C_TOKEN({
    payload: { email },
    SECRIT_KEY:
      user.role == RoleTypes.USER
        ? process.env.REFRESH_USER_KEY
        : process.env.REFRESH_ADMIN_KEY,
    option: { expiresIn: "7d" },
  });

  return res.status(200).json({ msg: "done", access_token, Refresh_token });
});

// ------------------ ForgetPassword ------------------------------
export const ForgetPassword = asyncHandeler(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(
      new Error("sorry this email is not exist or not confirmed", {
        cause: 400,
      })
    );
  }
  eventEmiteer.emit("ForgetPassOTP", { email, id: user._id });

  return res.status(200).json({ msg: "done", user });
});

// ------------------ ResetPassword ------------------------------
export const ResetPassword = asyncHandeler(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  const user = await UserModel.findOne({ email });
  const validOTP = user.OTP.find(
    (otp) =>
      otp.type === OTPtypes.F_password && new Date(otp.expiresIn) > new Date()
  );
  if (!validOTP) {
    return next(
      new Error("Sorry error in OTp type or otp is expiresIn", { cause: 400 })
    );
  }
  const CompareCode = await COMPARE({ key: code, keyhashed: validOTP.code });
  if (!CompareCode) {
    return next(new Error("code is wrong", { cause: 400 }));
  }
  const newUser = await UserModel.findOneAndUpdate(
    { email },
    { password: newPassword ,changeCredentialTime : Date.now()},
    { new: true }
  );
  newUser.save();
  return res.status(200).json({ msg: "done", newUser });
});

// ------------------ RefreshToken ------------------------------
export const RefreshToken = asyncHandeler(async (req, res, next) => {
  const { authorization } = req.body;
  const [prefex, token] = authorization.split(" ");
  if (!prefex || !token) {
    return next(new Error("Error in prefex or token", { cause: 400 }));
  }
  let TOKEN = undefined;
  if (prefex == "Bearer") {
    TOKEN = process.env.REFRESH_USER_KEY;
  } else if (prefex == RoleTypes.ADMIN) {
    TOKEN = process.env.REFRESH_ADMIN_KEY;
  } else {
    return next(new Error("error in prefex", { cause: 400 }));
  }
  const decoded = await V_TOKEN({ token, SECRIT_KEY: TOKEN });
  if (!decoded?.email) {
    return next(new Error("Error in token", { cause: 400 }));
  }
  const user = await UserModel.findOne({ email: decoded.email });
  const access_token = await C_TOKEN({
    payload: { email:decoded.email },
    SECRIT_KEY:
      user.role == RoleTypes.USER
        ? process.env.ACCESS_USER_KEY
        : process.env.ACCESS_ADMIN_KEY,
    option: { expiresIn: "1h" },
  });

  return res.status(200).json({ msg: "done", access_token });
});


// ------------------ loginGmail ------------------------------
export const loginGmail = asyncHandeler(async (req, res, next) => {
  // const {idToken} = req.body
  // const client = new OAuth2Client()
  // async function veryfy(){
  //   const ticket = await client.veryfyIdToken({
  //     idToken ,
  //     audience : process.env.CLIENT_ID
  //   })
  // }

  return res.status(200).json({ msg: "done", access_token });
});
