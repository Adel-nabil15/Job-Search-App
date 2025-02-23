import bcrypt from "bcrypt";

export const HASH = async ({ key, saltOrRounds }) => {
  return  bcrypt.hashSync(key, saltOrRounds);
};
