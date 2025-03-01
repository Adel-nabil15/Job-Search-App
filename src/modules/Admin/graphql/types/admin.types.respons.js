import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { imgeType } from "../../../../utils/graphql/index.js";
import {compnyResponse} from "../../../Company/graphql/compny.type.response.js"
// ---------- oneUser ---------------------------
export const oneUser = new GraphQLObjectType({
  name: "Users",
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    provider: { type: GraphQLString },
    gender: { type: GraphQLString },
    DOB: { type: GraphQLString },
    company: {
      type: compnyResponse
    },
    mobileNumber: { type: GraphQLString },
    role: { type: GraphQLString },
    isConfirmed: { type: GraphQLBoolean },
    FreazUser: { type: GraphQLBoolean },
    profilePic: { type: imgeType },
    coverPic: { type: imgeType },
  },
});

// ---------- AllUsers ---------------------------
export const AllUsers = new GraphQLList(oneUser);
