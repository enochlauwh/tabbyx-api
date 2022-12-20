import { gql, ApolloServer } from 'apollo-server-express';
import schema from '@graphql/schemasMap';
import { BookingService } from '@services';
import { UserStore } from '@data-access';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(tz);
dayjs.extend(utc);

jest.mock('@services');
jest.mock('@data-access');

const testServer = new ApolloServer({
  schema,
});

describe('booking.schema', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('bookings', () => {
    test('it should return the bookings for a user email', async () => {
      const mockResponse = [
        {
          id: 'abcd123',
          startDate: '2022-12-14 07:42:37',
          endDate: '2022-12-14 08:42:37',
        },
        {
          id: 'abcd123',
          startDate: '2022-12-14 07:42:37',
          endDate: '2022-12-14 08:42:37',
        },
      ];

      (BookingService.getBookingsForUserId as jest.Mock).mockResolvedValue(
        mockResponse,
      );
      (UserStore.getUserByEmail as jest.Mock).mockResolvedValue({ id: 98 });

      const result = await testServer.executeOperation({
        query: gql`
          query BookingsQuery($email: String!) {
            bookings(email: $email) {
              id
              startDate
              endDate
            }
          }
        `,
        variables: {
          email: 'cat@cat.com',
        },
      });

      expect(UserStore.getUserByEmail).toBeCalledWith('cat@cat.com');
      expect(BookingService.getBookingsForUserId).toBeCalledWith(98);
      expect(result.errors).toBeUndefined();
      expect(result.data?.bookings).toEqual(mockResponse);
    });
  });
  describe('makeBooking', () => {
    test('it should create a booking', async () => {
      const mockResponse = {
        id: 'abcd123',
        startDate: '2022-12-14 07:42:37',
        endDate: '2022-12-14 08:42:37',
      };

      (BookingService.makeBooking as jest.Mock).mockResolvedValue(mockResponse);

      const result = await testServer.executeOperation({
        query: gql`
          mutation MakeBookingMutation($input: MakeBookingInput!) {
            makeBooking(input: $input) {
              id
              startDate
              endDate
            }
          }
        `,
        variables: {
          input: {
            year: 2022,
            month: 12,
            day: 14,
            hour: 10,
            name: 'Loretta',
            email: 'ginger@root.com',
          },
        },
      });

      expect(BookingService.makeBooking).toBeCalledWith({
        year: 2022,
        month: 12,
        day: 14,
        hour: 10,
        name: 'Loretta',
        email: 'ginger@root.com',
      });
      expect(result.errors).toBeUndefined();
      expect(result.data?.makeBooking).toEqual(mockResponse);
    });
    test('it should reject an invalid input', async () => {
      const mockResponse = {
        id: 'abcd123',
        startDate: '2022-12-14 07:42:37',
        endDate: '2022-12-14 08:42:37',
      };

      (BookingService.makeBooking as jest.Mock).mockResolvedValue(mockResponse);

      const result = await testServer.executeOperation({
        query: gql`
          mutation MakeBookingMutation($input: MakeBookingInput!) {
            makeBooking(input: $input) {
              id
              startDate
              endDate
            }
          }
        `,
        variables: {
          input: {
            year: 2022,
            month: 12,
            day: 14,
            hour: 7, // 7am is an invalid hour
            name: 'Loretta',
            email: 'ginger@root.com',
          },
        },
      });

      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0].message).toEqual(
        'Error: "hour" must be greater than or equal to 9',
      );
    });
  });
});
