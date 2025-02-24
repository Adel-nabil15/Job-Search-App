import { Router } from "express";
import {
  confirmOTP,
  ForgetPassword,
  RefreshToken,
  ResetPassword,
  signIn,
  signUp,
} from "./Auth.service.js";
import { Validation } from "../../middleware/Valid.js";
import { signupValidation } from "./Auth.validation.js";
import { fileFilter, multerHost } from "../../middleware/multer.js";
const AuthRouter = Router();
AuthRouter.post(
  "/signUp",
  multerHost(fileFilter.images).single("attatchment"),
  Validation(signupValidation),
  signUp
);
AuthRouter.patch("/confirmOTP", confirmOTP);
AuthRouter.post("/signIn", signIn);
AuthRouter.patch("/ForgetPassword", ForgetPassword);
AuthRouter.patch("/ResetPassword", ResetPassword);
AuthRouter.patch("/RefreshToken", RefreshToken);

export default AuthRouter;
