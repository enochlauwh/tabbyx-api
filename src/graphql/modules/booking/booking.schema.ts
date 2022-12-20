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

  input MakeBookingInput {
    year: Int!
    month: Int!
    day: Int!
    hour: Int!
    name: String!
    email: String!
  }

  extend type Query {
    """
    Returns the bookings for a given user by email
    """
    bookings(email: String!): [Booking!]!

    """
    Returns a list of available hours for a given day (9am to 6pm) as integers
    """
    availableHours(input: AvailableHoursInput!): [Int!]!
  }

  extend type Mutation {
    makeBooking(input: MakeBookingInput!): Booking!
    cancelBooking(id: ID!): Boolean!
  }
`;
