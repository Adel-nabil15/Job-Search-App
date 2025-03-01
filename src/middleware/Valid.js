export const Validation = (model) => {
  return (req, res, next) => {
    let ErrorResult = [];
    for (const key of Object.keys(model)) {
      const validationError = model[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationError?.error) {
        ErrorResult.push(validationError.error.details);
      }
    }
    if (ErrorResult.length > 0) {
      return res.json({ msg: "there is error ", error: ErrorResult });
    }
    next(); 
  };
};
