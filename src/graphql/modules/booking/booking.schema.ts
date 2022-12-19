import { gql } from 'apollo-server-express';

export const schema = gql`
  scalar DateTime

  type Booking {
    id: ID
  }
`;
