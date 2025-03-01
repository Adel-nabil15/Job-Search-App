import jwt from "jsonwebtoken";

export const V_TOKEN = async ({ token, SECRIT_KEY }) => {
  return jwt.verify(token, SECRIT_KEY);
};
