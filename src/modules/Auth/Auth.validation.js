import joi from "joi";
import { GenderTypes } from "../../utils/enumTypes.js";
import { GeneralRouls } from "../../utils/GeneralRouls.js";


// ------------------------ signupValidation ---------------------------------
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
};

// ------------------------ confirmOTPValidation ---------------------------------
export const confirmOTPValidation = {
  body: joi.object({
    code:joi.string().max(5).required(),
    email:GeneralRouls.email.required(),
  }).required()
};

// ------------------------ signInValidation ---------------------------------
export const signInValidation = {
  body: joi.object({
    password:GeneralRouls.password.required(),
    email:GeneralRouls.email.required(),
  }).required()
};

// ------------------------ ForgetPasswordValidation ---------------------------------
export const ForgetPasswordValidation = {
  body: joi.object({
    email:GeneralRouls.email.required(),
  }).required()
};

// ------------------------ ResetPasswordValidation ---------------------------------
export const ResetPasswordValidation = {
  body: joi.object({
    email:GeneralRouls.email.required(),
    code:joi.string().max(5).required(),
    newPassword:GeneralRouls.password.required(),
    Cnewpassword:joi.valid(joi.ref("newPassword")).required()

  }).required()
};

// ------------------------ RefreshTokenValidation ---------------------------------
export const RefreshTokenValidation = {
  body: joi.object({
    authorization:joi.string().required()
  }).required()
};

// ------------------------ loginGmailValidation ---------------------------------
export const loginGmailValidation = {
  body : joi.object({
    idToken :joi.string().required()
  }).required()
};
