import UserModel from "../DB/models/User.model.js";
import { RoleTypes } from "../utils/enumTypes.js";
import { asyncHandeler } from "../utils/error/index.js";
import { V_TOKEN } from "../utils/token/verifyToken.js";

export const Authentication = async (req, res, next) => {
  const { authorization } = req.headers;
  const [prefex, token] = authorization.split(" ");
  if (!prefex || !token) {
    return next(new Error("Error in prefex or token", { cause: 400 }));
  }
  let TOKEN = undefined;
  if (prefex == "Bearer") {
    TOKEN = process.env.ACCESS_USER_KEY;
  } else if (prefex == RoleTypes.ADMIN) {
    TOKEN = process.env.ACCESS_ADMIN_KEY;
  } else {
    return next(new Error("error in prefex", { cause: 400 }));
  }
  const decoded = await V_TOKEN({ token, SECRIT_KEY: TOKEN });
  if (!decoded?.email) {
    return next(new Error("Error in token", { cause: 400 }));
  }
  // ----------------- return user from token ---------------------
  const user = await UserModel.findOne({ email: decoded.email });
  // ------------------ if password Change ------------------------
  if (parseInt(user?.changeCredentialTime?.getTime() / 1000) > decoded.iat) {
    return next(
      new Error("invalid token and Password is shanged", { cause: 400 })
    );
  }
  // -------------------- if account freaze ----------------------
  if (parseInt(user?.deletedAt?.getTime() / 1000) > decoded.iat) {
    return next(new Error("invalid token and email is Delete", { cause: 400 }));
  }

  // -------------------- if account bann By Admin ----------------------
  if (parseInt(user?.bannedAt?.getTime() / 1000) > decoded.iat) {
    return next(new Error("invalid token and email is banned", { cause: 400 }));
  }
  // save user in req
  req.user = user;
  next();
};

export const Authorization = (AccessRole = []) => {
  return asyncHandeler(async(req , res , next ) =>{
    if (!AccessRole.includes(req.user.role)) {
      return next(new Error("sorry youDon't allow to do that", { cause: 400 }));
    }
    next()
  })
}
 