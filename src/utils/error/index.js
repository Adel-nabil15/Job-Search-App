export const asyncHandeler = (fn) => {
  return (req, res, next) => {
     fn(req, res, next).catch((err) => {
      next(err);
    });
  };
};

export const globalErrorHandel = (error, req, res, next) => {
  return res.status(error["cause"] || 500).json({ message: error.message, stack: error.stack });
};
