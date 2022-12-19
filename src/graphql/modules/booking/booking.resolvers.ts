import { Resolvers } from '@generated/graphql-types';
import { ApolloError, UserInputError } from 'apollo-server-express';
import Joi from 'joi';

import { BookingService } from '@services';
import { UserStore } from '@data-access';
import { BookingModel } from '@models/booking.model';

export const resolvers: Resolvers = {
  Query: {
    hello: () => 'Hello user!',
    bookings: async (root, { email }) => {
      try {
        const user = await UserStore.getUserByEmail(email);

        if (!user) {
          // No error thrown because this is a valid scenario
          return [];
        }

        const bookings = (await BookingService.getBookingsForUserId(
          user.id,
        )) as BookingModel[];
        return bookings;
      } catch (error) {
        throw new ApolloError(error as string);
      }
    },
    availableHours: async (root, { input }) => {
      try {
        const schema = Joi.object({
          year: Joi.number().min(2022).required(),
          month: Joi.number().min(1).max(12).required(),
          day: Joi.number().min(1).max(31).required(),
        });

        const { error } = schema.validate(input);
        if (error) {
          throw new Error(error.message);
        }

        const availableHours = await BookingService.getAvailableHours(input);
        return availableHours;
      } catch (error) {
        throw new UserInputError(error as string);
      }
    },
  },
};
