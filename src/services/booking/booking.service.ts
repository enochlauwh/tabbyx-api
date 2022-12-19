import { customAlphabet } from 'nanoid';

import { BookingStore, UserStore } from '@data-access';

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
  email: string;
  startDate: string;
  endDate: string;
}) => {
  try {
    const { email, startDate, endDate } = input;

    const user = await UserStore.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

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

// this manner of export is necessary to allow for mocking functions within the same module
const exportFunctions = {
  getBooking,
  listBookings,
  makeBooking,
  generateIdString,
  generateUniqueBookingId,
};

export default exportFunctions;
