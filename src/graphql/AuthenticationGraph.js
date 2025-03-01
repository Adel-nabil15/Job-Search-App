import UserModel from "../DB/models/User.model.js";
import { RoleTypes } from "../utils/enumTypes.js";
import { V_TOKEN } from "../utils/token/verifyToken.js";

export const isAthenticated = (accessRole = []) => {
  return (resolve) => {
    return async (parent, args, context) => {
      const { authorization } = context;
      const [prefex, token] = authorization.split(" ");
      if (!prefex || !token) {
        throw new Error("Prefex is required", { cause: 400 });
      }
      let TOKEN = undefined;
      if (prefex == "Bearer") {
        TOKEN = process.env.ACCESS_USER_KEY;
      } else if (prefex == RoleTypes.ADMIN) {
        TOKEN = process.env.ACCESS_ADMIN_KEY;
      } else {
        throw new Error("error in Prefex", { cause: 400 });
      }
      const decoded = await V_TOKEN({ token, SECRIT_KEY: TOKEN });
      if (!decoded?.email) {
        throw new Error("error in Token", { cause: 400 });
      }

      // ----------------- return user from token ---------------------
      const user = await UserModel.findOne({ email: decoded.email });
      // chech on Role
      if(!accessRole.includes(user.role))  throw new Error("sorry you don't allow that ",{cause:400})

      context.user = user;
      return resolve(parent, args, context);
    };
  };
};
