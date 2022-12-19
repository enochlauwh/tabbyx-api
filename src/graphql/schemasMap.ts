import 'graphql-import-node';

import { GraphQLSchema } from 'graphql';
import { gql } from 'apollo-server-express';
import { typeDefs as scalarTypes } from 'graphql-scalars';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { schema as bookingSchema } from './modules/booking';
import resolvers from './resolversMap';

const types = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [types, ...scalarTypes, bookingSchema],
  resolvers,
});

export default schema;
