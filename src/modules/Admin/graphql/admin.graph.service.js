import UserModel from "../../../DB/models/User.model.js";

// ----------------- allUsers & companis -----------------------------
export const allUserr = async (_, argas, context) => {
  const alluser = await UserModel.find().populate("company");
  return alluser;
};

// ----------------- OneUser & onecompany-----------------------------
export const oneUserr = async (_, args) => {
  const { id } = args;
  const OneUser = await UserModel.findById(id).populate("company");
  return OneUser;
};
