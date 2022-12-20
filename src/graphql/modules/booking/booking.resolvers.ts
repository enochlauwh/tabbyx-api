import { Resolvers } from '@generated/graphql-types';
import { ApolloError, UserInputError } from 'apollo-server-express';
import Joi from 'joi';

import { BookingService } from '@services';
import { UserStore } from '@data-access';
import { BookingModel } from '@models/booking.model';
import dayjs from 'dayjs';

export const resolvers: Resolvers = {
  Booking: {
    startDate: ({ startDate }) =>
      dayjs.tz(startDate, 'Asia/Kuala_Lumpur').format('YYYY-MM-DD HH:mm:ss'),

    endDate: ({ endDate }) =>
      dayjs.tz(endDate, 'Asia/Kuala_Lumpur').format('YYYY-MM-DD HH:mm:ss'),
    createdBy: async ({ createdBy }) => {
      if (createdBy) {
        const user = await UserStore.getUserById(createdBy);
        return user;
      }
      return null;
    },
  },
  Query: {
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
        throw new ApolloError(error as string);
      }
    },
  },
  Mutation: {
    makeBooking: async (root, { input }) => {
      try {
        const schema = Joi.object({
          year: Joi.number().min(2022).required(),
          month: Joi.number().min(1).max(12).required(),
          day: Joi.number().min(1).max(31).required(),
          hour: Joi.number().min(9).max(18).required(),
          name: Joi.string().required(),
          email: Joi.string().email().required(),
        });

        const { error } = schema.validate(input);
        if (error) {
          throw new Error(error.message);
        }

        const booking = await BookingService.makeBooking({
          year: input.year,
          month: input.month,
          day: input.day,
          hour: input.hour,
          name: input.name,
          email: input.email,
        });

        return booking;
      } catch (error) {
        throw new ApolloError(error as string);
      }
    },
    cancelBooking: async (root, { id }) => {
      try {
        const booking = await BookingService.getBooking(id);
        if (!booking) {
          throw new UserInputError('Booking not found');
        }

        const affectedRows = await BookingService.cancelBooking(id);
        return affectedRows > 0;
      } catch (error) {
        throw new ApolloError(error as string);
      }
    },
  },
};
