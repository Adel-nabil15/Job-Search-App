import { GeneralRouls } from "../../utils/GeneralRouls.js";
import joi from "joi";

export const banUserValidation = {
  body: joi
    .object({
      action: joi.string().valid("unbanuser", "bannuser").required(),
    })
    .required(),
  params: GeneralRouls.id.required(),
};

export const banCompanyValidation = {
  body: joi
    .object({
      action: joi.string().valid("banncompany", "unbanncompany").required(),
    })
    .required(),
  params: GeneralRouls.id.required(),
};

export const ApprovecompanyValidation = {
  params: GeneralRouls.id.required(),
  query: joi.required(),
};
