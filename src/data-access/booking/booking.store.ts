import knex from '@db/knex';
import _ from 'lodash';
import { camelizeKeys as camelize } from 'humps';
import { TableNames } from '@db/tables';
import { BookingId } from '@models/booking.model';
import { UserId } from '@models/user.model';

// Caching is not implemented in this example but if it were to be used
// to improve performance, then it would implemented in this layer.

const getBookingById = async (id: BookingId) => {
  try {
    const res = await knex
      .from(TableNames.BOOKINGS)
      .where('id', id)
      .select()
      .first();

    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const listBookings = async (input?: { startDate: string; endDate: string }) => {
  try {
    const { startDate, endDate } = input || {};
    const res = await knex
      .from(TableNames.BOOKINGS)
      .where((builder) => {
        if (startDate && endDate) {
          builder
            .where('start_date', '>=', startDate)
            .andWhere('end_date', '<=', endDate)
            .andWhere('cancelled_at', null);
        }
      })
      .select();

    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getBookingsForUserId = async (userId: UserId) => {
  try {
    const res = await knex
      .from(TableNames.BOOKINGS)
      .where({ created_by: userId, cancelled_at: null })
      .select();
    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const createBooking = async (input: {
  id: string;
  startDate: string;
  endDate: string;
  createdBy: UserId;
}) => {
  try {
    const { id, startDate, endDate, createdBy } = input;

    const insertRes = await knex(TableNames.BOOKINGS).insert({
      id,
      start_date: startDate,
      end_date: endDate,
      created_by: createdBy,
      created_at: knex.fn.now(),
    });

    const res = await knex.from(TableNames.BOOKINGS).where('id', id).select();

    return camelize(_.head(res));
  } catch (error) {
    return Promise.reject(error);
  }
};

const cancelBooking = async (id: BookingId) => {
  try {
    const updateRes = await knex(TableNames.BOOKINGS).where('id', id).update({
      cancelled_at: knex.fn.now(),
    });

    return updateRes;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  getBookingById,
  getBookingsForUserId,
  createBooking,
  listBookings,
  cancelBooking,
};
