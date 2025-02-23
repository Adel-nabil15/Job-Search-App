import bcrypt from "bcrypt";

export const COMPARE = async ({ key, keyhashed }) => {
  return bcrypt.compareSync(key, keyhashed);
};
