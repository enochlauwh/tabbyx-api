import { customAlphabet } from 'nanoid';

import { BookingStore, UserStore } from '@data-access';
import BookingService from './booking.service';

const nanoid = customAlphabet('1234567890abcdef', 7);

jest.mock('nanoid', () => ({
  customAlphabet: jest.fn(() => {
    return () => 'tes2790';
  }),
}));
jest.mock('@data-access');

describe('booking.service', () => {
  describe('getBooking', () => {
    test('it should retrieve the booking', async () => {
      const mockInput = 'adad328';

      const mockBooking = {
        id: 'abcd123',
        startDate: '2022-12-14 07:42:37',
        endDate: '2022-12-14 08:42:37',
        createdAt: '2022-12-14 07:42:37',
        createdBy: 98,
      };

      (BookingStore.getBookingById as jest.Mock).mockResolvedValue(mockBooking);

      const res = await BookingService.getBooking(mockInput);

      expect(BookingStore.getBookingById).toHaveBeenCalledWith(mockInput);
      expect(res).toEqual(mockBooking);
    });
  });
  describe('listBookings', () => {
    test('it should list the bookings', async () => {
      const mockBookings = [
        {
          id: 'abcd123',
          startDate: '2022-12-14 07:42:37',
          endDate: '2022-12-14 08:42:37',
          createdAt: '2022-12-14 07:42:37',
          createdBy: 98,
        },
        {
          id: 'abcd123',
          startDate: '2022-12-14 07:42:37',
          endDate: '2022-12-14 08:42:37',
          createdAt: '2022-12-14 07:42:37',
          createdBy: 98,
        },
      ];

      (BookingStore.listBookings as jest.Mock).mockResolvedValue(mockBookings);

      const res = await BookingService.listBookings();

      expect(BookingStore.listBookings).toHaveBeenCalled();
      expect(res).toEqual(mockBookings);
    });
  });

  describe('generateIdString', () => {
    test('it should generate an id string of length 7 characters', async () => {
      const nanoid = customAlphabet('1234567890abcdef', 7);
      const generatedId = nanoid();

      const res = BookingService.generateIdString();

      expect(res).toBe(generatedId);
      expect(res).toHaveLength(7);
    });
  });

  describe('generateUniqueBookingId', () => {
    test('it should generate a unique booking id', async () => {
      const nanoid = customAlphabet('1234567890abcdef', 7);
      const generatedId = nanoid();

      const spy = jest
        .spyOn(BookingService, 'generateIdString')
        .mockReturnValue(generatedId);

      (BookingStore.getBookingById as jest.Mock).mockResolvedValue(undefined);

      const res = await BookingService.generateUniqueBookingId();

      expect(res).toBe(generatedId);

      spy.mockRestore();
    });

    test('it should retry if the generated url already exists', async () => {
      const nanoid = customAlphabet('1234567890abcdef', 7);
      const generatedId = nanoid();

      const spy = jest
        .spyOn(BookingService, 'generateIdString')
        .mockReturnValue(generatedId);

      const mockDbBooking = {
        id: generatedId,
      };

      (BookingStore.getBookingById as jest.Mock)
        .mockResolvedValueOnce(mockDbBooking)
        .mockResolvedValueOnce(mockDbBooking)
        .mockResolvedValueOnce(undefined);

      const res = await BookingService.generateUniqueBookingId();

      expect(spy).toHaveBeenCalledTimes(3);
      expect(res).toBe(generatedId);

      spy.mockRestore();
    });

    test('it should reject if the maximum number of retries has been reached', async () => {
      const generatedId = nanoid();

      const spy = jest
        .spyOn(BookingService, 'generateIdString')
        .mockReturnValue(generatedId);

      (BookingStore.getBookingById as jest.Mock).mockResolvedValue({
        short_url: generatedId,
      });

      try {
        const res = await BookingService.generateUniqueBookingId();
      } catch (error) {
        expect(error as string).toBe(
          'Exceeded maximum retries, please report this issue.',
        );

        expect(spy).toHaveBeenCalledTimes(5);
      }

      spy.mockRestore();
    });
  });

  describe('makeBooking', () => {
    test('it should create a booking', async () => {
      const mockInput = {
        startDate: '2022-12-14 07:42:37',
        endDate: '2022-12-14 08:42:37',
        email: 'loretta@ginger.root',
      };

      const mockUser = {
        id: 98,
        email: 'loretta@ginger.root',
        name: 'Loretta',
      };

      const mockBooking = {
        id: 'abcd123',
        startDate: '2022-12-14 07:42:37',
        endDate: '2022-12-14 08:42:37',
        createdAt: '2022-12-14 07:42:37',
        createdBy: 98,
      };

      const generatedId = 'tect382';

      const spy = jest
        .spyOn(BookingService, 'generateUniqueBookingId')
        .mockResolvedValue(generatedId);

      (BookingStore.createBooking as jest.Mock).mockResolvedValue(mockBooking);
      (UserStore.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const res = await BookingService.makeBooking(mockInput);

      expect(BookingStore.createBooking).toHaveBeenCalledWith({
        id: generatedId,
        startDate: mockInput.startDate,
        endDate: mockInput.endDate,
        createdBy: mockUser.id,
      });

      expect(res).toEqual(mockBooking);

      spy.mockRestore();
    });
  });

  describe('getAvailableHours', () => {
    test('it should list hours from 9am to 6pm that have no bookings for a given date', async () => {
      const mockDate = {
        year: 2022,
        month: 12,
        day: 14,
      };

      const mockBookings = [
        {
          id: 'abcd123',
          startDate: '2022-12-14 13:00:00',
          endDate: '2022-12-14 14:00:00',
          createdAt: '2022-12-14 07:42:37',
          createdBy: 98,
        },
        {
          id: 'abcd123',
          startDate: '2022-12-14 10:00:00',
          endDate: '2022-12-14 11:00:00',
          createdAt: '2022-12-14 07:42:37',
          createdBy: 99,
        },
      ];

      const mockAvailableHours = [9, 11, 12, 14, 15, 16, 17, 18];

      (BookingStore.listBookings as jest.Mock).mockResolvedValue(mockBookings);

      const res = await BookingService.getAvailableHours(mockDate);

      expect(res).toEqual(mockAvailableHours);
    });
  });
});
