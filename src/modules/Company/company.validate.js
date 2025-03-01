import joi from "joi";
import { GeneralRouls } from "../../utils/GeneralRouls.js";

//---------------------- AddCompanyValidation -------------------------------
export const AddCompanyValidation = {
  params: GeneralRouls.id.required(),
  body: joi
    .object({
      companyName: joi.string().required(),
      description: joi.string().required(),
      industry: joi.string().required(),
      address: joi.string().required(),
      numberOfEmployees: joi
        .string()
        .valid("1-10", "11-20", "21-50", "51-100", "101-500", "500+")
        .required(),
      companyEmail: joi.string().required(),
      HRs: joi.array().items(joi.string()).required(),
    })
    .required(),
};

//---------------------- UpdateCompnyValidation -------------------------------
export const UpdateCompnyValidation = {
  params: GeneralRouls.id.required(),
};

export const DeleteJobValidation = {
  params: GeneralRouls.id.required(),
};
//---------------------- SoftDeleteValidation -------------------------------
export const SoftDeleteValidation = {
  params: GeneralRouls.id.required(),
};

//---------------------- GetCompanyValidation -------------------------------
export const GetCompanyValidation = {
  params: GeneralRouls.id.required(),
};

//---------------------- SearshCompanyValidation -------------------------------
export const SearshCompanyValidation = {
  params: joi.string().required(),
};
//---------------------- CompanyCoverValidation -------------------------------
export const CompanyCoverValidation = {
  params: GeneralRouls.id.required(),
  file: joi.object().required(),
};

//---------------------- companylogoValidation -------------------------------
export const companylogoValidation = {
  params: GeneralRouls.id.required(),
  file: joi.object().required(),
};
//---------------------- companylogoValidation -------------------------------
export const DeletecompanylogoValidation = {
  params: GeneralRouls.id.required(),
};

//---------------------- DeleteCoverPicValidation -------------------------------
export const DeleteCoverPicValidation = {
    params: GeneralRouls.id.required(),
  };
  