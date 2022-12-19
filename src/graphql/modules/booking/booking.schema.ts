import { gql } from 'apollo-server-express';

export const schema = gql`
  scalar DateTime

  type User {
    id: ID
    name: String
    email: String
  }

  type Booking {
    id: ID
    startDate: DateTime
    endDate: DateTime
    createdAt: DateTime
    createdBy: User
    cancelledAt: DateTime
  }

  input AvailableHoursInput {
    year: Int!
    month: Int!
    day: Int!
  }

  extend type Query {
    hello: String
    """
    Returns the bookings for a given user by email
    """
    bookings(email: String!): [Booking]!
    """
    Returns a list of available hours for a given day (9am to 6pm) as integers
    """
    availableHours(input: AvailableHoursInput!): [Int!]!
  }
`;
