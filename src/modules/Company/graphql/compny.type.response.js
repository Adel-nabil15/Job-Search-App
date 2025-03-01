import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql"
import { imgeType } from "../../../utils/graphql/index.js"

export const compnyResponse =new GraphQLList(
    new GraphQLObjectType({
      name: "Allcompany",
      fields: {
        companyName: { type: GraphQLString},
        description: { type: GraphQLString },
        industry: { type: GraphQLString },
        address: { type: GraphQLString },
        numberOfEmployees: { type: GraphQLString },
        companyEmail: { type: GraphQLString },
        Logo: { type: imgeType },
        CoverPic: { type: imgeType },
      },
    })
  )