import jwt from "jsonwebtoken";

export const C_TOKEN = async ({
  payload = {},
  SECRIT_KEY,
  option = {},
}) => {
  return  jwt.sign(payload, SECRIT_KEY, option);
};
