import bcrypt from "bcrypt";
const COMPARE = async ({ key, keyhashed }) => {
  return bcrypt.compareSync(key, keyhashed);
};

export default COMPARE;
