import joi from "joi";
import moment from "moment";

export const ConfirmDOB = (value, helpers) => {
  const age = moment().diff(moment(value), "years");
  if (age < 18) {
    return helpers.message("Age must be greater than 18 years");
  }
    return value;
};

export const GeneralRouls = {
  DOB: joi.date().iso().max("now").custom(ConfirmDOB, "Age Validation"),
  email: joi.string().email({  tlds: { allow: true }, minDomainSegments: 1, maxDomainSegments: 2}),
  password: joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
};
