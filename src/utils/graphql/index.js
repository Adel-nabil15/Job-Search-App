import { GraphQLObjectType, GraphQLString } from "graphql";

export const imgeType =new GraphQLObjectType({
    name: "image",
    fields: {
      secure_url: { type: GraphQLString },
      public_id: { type: GraphQLString },
    },
  })