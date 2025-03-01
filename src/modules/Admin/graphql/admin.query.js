
import {  allUserr, oneUserr } from "./admin.graph.service.js";
import { AllUsers, oneUser } from "./types/admin.types.respons.js";
import { ReqOneUser } from "./types/admin.types.requst.js";
import { isAthenticated } from "../../../graphql/AuthenticationGraph.js";
import { RoleTypes } from "../../../utils/enumTypes.js";

export const Authquery = {
  //allUsers&Allcompanies
  allUsers: {
    type:AllUsers,
    resolve: isAthenticated(RoleTypes.ADMIN)(allUserr),
  },
  //one User and one comany
  oneUser: {
    type:oneUser,
    args:ReqOneUser,
    resolve: oneUserr,
  },

};
