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

    const res = await knex
      .from(TableNames.BOOKINGS)
      .where('id', _.head(insertRes))
      .select();

    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  getBookingById,
  createBooking,
};
