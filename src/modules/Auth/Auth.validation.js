import joi from "joi";
import { GenderTypes } from "../../utils/enumTypes.js";
import { GeneralRouls } from "../../utils/GeneralRouls.js";

export const signupValidation = {
  body: joi.object({
    firstName:joi.string().alphanum().min(3).required(),
    lastName:joi.string().alphanum().min(3).required(),
    email:GeneralRouls.email.required(),
    password:GeneralRouls.password.required(),
    Cpassword:joi.string().valid(joi.ref("password")).required(),
    DOB:GeneralRouls.DOB.required(),
    mobileNumber:joi.string().required(),
    gender:joi.string().valid(GenderTypes.MALE,GenderTypes.FEMALE).required()
  }),
  file:joi.object().required()
};
