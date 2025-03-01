import joi from "joi";
import {GeneralRouls} from "../../utils/GeneralRouls.js"

export const JoinJobValidation = {
    params: GeneralRouls.id.required(),
    file:joi.object().required()
  };

  export const StatusOfJobValidation = {
    params: GeneralRouls.id.required(),
    body:joi.object({
        status :joi.string().required()
    })
  };