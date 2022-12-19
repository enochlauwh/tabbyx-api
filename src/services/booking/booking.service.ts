import { customAlphabet } from 'nanoid';
import dayjs from 'dayjs';

import { BookingStore, UserStore } from '@data-access';
import { UserId } from '@models/user.model';
import { BookingModel } from '@models/booking.model';

const GEN_RETRY_LIMIT = 5;

// Although this appears to be adding another redundant layer over the data access layer,
// this is where additional enhancements or logic would be located should the requirements be expanded.
// e.g. needing to call additional services for data or triggering analytics
const getBooking = async (id: string) => {
  try {
    const res = await BookingStore.getBookingById(id);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

const listBookings = async () => {
  try {
    const res = await BookingStore.listBookings();
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

// id string generation is abstracted to allow for changing
// generation method without affecting other business logic
const generateIdString = () => {
  const nanoid = customAlphabet('1234567890abcdef', 7);
  const generatedId = nanoid();

  return generatedId;
};

const generateUniqueBookingId = async (
  attempts: number = 1,
): Promise<string> => {
  try {
    const generatedId = exportFunctions.generateIdString();
    const existingShortUrl = await BookingStore.getBookingById(generatedId);

    if (existingShortUrl) {
      throw new Error('exists');
    }

    return generatedId;
  } catch (error) {
    const maxAttempts = GEN_RETRY_LIMIT;

    if (attempts >= maxAttempts) {
      return Promise.reject(
        'Exceeded maximum retries, please report this issue.',
      );
    }

    return generateUniqueBookingId(attempts + 1);
  }
};

const makeBooking = async (input: {
  name: string;
  email: string;
  day: number;
  month: number;
  year: number;
  hour: number;
}) => {
  try {
    const { name, email, day, month, year, hour } = input;

    const availableHours = await exportFunctions.getAvailableHours({
      day,
      month,
      year,
    });

    if (!availableHours.includes(hour)) {
      return Promise.reject('Selected hour is not available');
    }

    let user = await UserStore.getUserByEmail(email);
    if (!user) {
      user = await UserStore.createUser({
        name,
        email,
      });
    }

    const startDate = dayjs()
      .year(year)
      .month(month - 1)
      .date(day)
      .hour(hour)
      .minute(0)
      .second(0)

      .format('YYYY-MM-DD HH:mm:ss');
    const endDate = dayjs()
      .year(year)
      .month(month - 1)
      .date(day)
      .hour(hour)
      .minute(0)
      .second(0)
      .add(1, 'hour')
      .format('YYYY-MM-DD HH:mm:ss');

    const generatedId = await exportFunctions.generateUniqueBookingId();

    const createdBooking = await BookingStore.createBooking({
      id: generatedId,
      startDate,
      endDate,
      createdBy: user.id,
    });

    return createdBooking;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getBookingsForUserId = async (userId: UserId) => {
  try {
    const res = await BookingStore.getBookingsForUserId(userId);
    return res;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAvailableHours = async (input: {
  year: number;
  month: number;
  day: number;
}) => {
  try {
    const selectedDay = dayjs()
      .year(input.year)
      .month(input.month - 1)
      .date(input.day);

    const currentBookings = (await BookingStore.listBookings({
      startDate: selectedDay.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endDate: selectedDay.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    })) as BookingModel[];

    // find which hours are not booked
    const availableHours = [];
    for (let i = 9; i <= 17; i++) {
      // from 9am to 5pm (because 1 hour slot ends at 6pm)
      const hour = i;
      const foundBooking = currentBookings.find((booking) => {
        const bookingStart = dayjs(booking.startDate);
        const bookingEnd = dayjs(booking.endDate);

        return bookingStart.hour() <= hour && bookingEnd.hour() > hour;
      });

      if (!foundBooking) {
        availableHours.push(hour);
      }
    }

    return availableHours;
  } catch (error) {
    return Promise.reject(error);
  }
};

// this manner of export is necessary to allow for mocking functions within the same module
const exportFunctions = {
  getBooking,
  listBookings,
  makeBooking,
  generateIdString,
  generateUniqueBookingId,
  getBookingsForUserId,
  getAvailableHours,
};

export default exportFunctions;
