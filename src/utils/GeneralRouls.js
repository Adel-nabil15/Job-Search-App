import joi from "joi";
import moment from "moment";
import { Types } from "mongoose";

// -------------- ConfirmDOB -----------------------
export const ConfirmDOB = (value, helpers) => {
  const age = moment().diff(moment(value), "years");
  if (age < 18) {
    return helpers.message("Age must be greater than 18 years");
  }
    return value;
};
// -------------- valid -----------------------
export const validId = (value, helpers) => {
  const isvalid = Types.ObjectId.isValid(value);
  isvalid ?  value :  helpers.message(`id is not match ${value}`) 
};


export const GeneralRouls = {
  id:joi.custom(validId),
  DOB: joi.date().iso().max("now").custom(ConfirmDOB, "Age Validation"),
  email: joi.string().email({  tlds: { allow: true }, minDomainSegments: 1, maxDomainSegments: 2}),
  password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
  Headers: joi.object({
    authorization: joi.string().required(),
    host: joi.string(),
    "Cache-Control": joi.string(),
    "Postman-Token": joi.string(),
    "User-Agent": joi.string(),
    Accept: joi.string(),
    "Accept-Encoding": joi.string(),
    Connection: joi.string(),
    "Content-Type": joi.string(),
    "Content-Length": joi.string(),
  }),
};
