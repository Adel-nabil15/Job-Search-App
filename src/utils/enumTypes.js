import mongoose from "mongoose";

// ------- OTPtypes -------
export const OTPtypes = {
  C_email: "confirmEmail",
  F_password: "forgetPassword",
};

// ------- RoleTypes -------
export const RoleTypes = {
  USER: "User",
  ADMIN: "Admin",
};

// ------- ProviderTypes ------
export const ProviderTypes = {
  Google: "google",
  SYSTEM: "system",
};

// ------- GenderTypes -------
export const GenderTypes = {
  MALE: "Male",
  FEMALE: "Female",
};

// ------- FileSchema -------
export const FileSchema = new mongoose.Schema({
  secure_url: String,
  public_id: String,
}, { _id: false });