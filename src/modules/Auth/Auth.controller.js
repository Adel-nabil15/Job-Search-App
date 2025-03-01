import { Router } from "express";
import {
  confirmOTP,
  ForgetPassword,
  loginGmail,
  RefreshToken,
  ResetPassword,
  signIn,
  signUp,
} from "./Auth.service.js";
import { Validation } from "../../middleware/Valid.js";
import {
  confirmOTPValidation,
  ForgetPasswordValidation,
  loginGmailValidation,
  ResetPasswordValidation,
  signInValidation,
  signupValidation,
} from "./Auth.validation.js";
import { fileFilter, multerHost } from "../../middleware/multer.js";
const AuthRouter = Router();

AuthRouter.post(
  "/signUp",
  multerHost(fileFilter.images).single("attatchment"),
  Validation(signupValidation),
  signUp
);
AuthRouter.patch("/confirmOTP", Validation(confirmOTPValidation), confirmOTP);
AuthRouter.post("/signIn", Validation(signInValidation), signIn);
AuthRouter.patch(
  "/ForgetPassword",
  Validation(ForgetPasswordValidation),
  ForgetPassword
);
AuthRouter.patch(
  "/ResetPassword",
  Validation(ResetPasswordValidation),
  ResetPassword
);
AuthRouter.patch("/RefreshToken", RefreshToken);


  AuthRouter.patch("/loginGmail",Validation(loginGmailValidation), loginGmail);

export default AuthRouter;
