import { Router } from "express";
import { confirmOTP, signIn, signUp } from "./Auth.service.js";
import { Validation } from "../../middleware/Valid.js";
import { signupValidation } from "./Auth.validation.js";
import { fileFilter, multerHost } from "../../middleware/multer.js";
const AuthRouter = Router();
AuthRouter.post("/signUp",
  multerHost(fileFilter.images).single("attatchment"),
  Validation(signupValidation),
  signUp
);
AuthRouter.patch("/confirmOTP", confirmOTP);
AuthRouter.post("/signIn", signIn);

export default AuthRouter;
