import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { Authquery } from "./modules/Admin/graphql/admin.query.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "MainQuery",
    fields: {
      ...Authquery,
    },
  }),
});
