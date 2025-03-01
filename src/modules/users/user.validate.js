import joi from "joi";
import { GeneralRouls } from "../../utils/GeneralRouls.js";


// ------------------- UpdatePasswodValidation --------------------------
export const UpdatePasswodValidation = {
  body: joi.object({
    oldpassword: GeneralRouls.password.required(),
    newPassword: GeneralRouls.password.required(),
    Cpassword: joi.string().valid(joi.ref("newPassword")).required(),
  }),
  Headers: GeneralRouls.Headers,
};

// ------------------- UploadProfilPicValid --------------------------
export const UploadProfilPicValid = {
  file:joi.object(),
  Headers: GeneralRouls.Headers,
};

// ------------------- UploadcoverPicValid --------------------------
export const UploadcoverPicValid = {
  file:joi.object(),
  Headers: GeneralRouls.Headers,
};
// ------------------- DeleteProfilePicValid --------------------------
export const DeleteProfilePicValid = {
  Headers: GeneralRouls.Headers,
};

// ------------------- DeletecoverPicValid --------------------------
export const DeletecoverPicValid = {
  Headers: GeneralRouls.Headers,
};

// ------------------- SoftDeleteValid --------------------------
export const SoftDeleteValid = {
  Headers: GeneralRouls.Headers,
};