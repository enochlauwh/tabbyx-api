import mockKnex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { camelizeKeys as camelize } from 'humps';
import { TableNames } from '@db/tables';

import BookingStore from './booking.store';

jest.mock('@db/knex', () => {
  return mockKnex({ client: MockClient });
});

describe('booking.store', () => {
  let tracker: Tracker;

  beforeAll(() => {
    tracker = getTracker();
  });

  afterEach(() => {
    tracker.reset();
  });

  describe('getBookingById', () => {
    test('it should get a booking by id', async () => {
      const mockDbResponse = {
        id: 'abcd123',
        start_date: '2022-12-14 07:42:37',
        end_date: '2022-12-14 08:42:37',
        created_at: '2022-12-14 07:42:37',
        created_by: 98,
      };

      tracker.on.select(TableNames.BOOKINGS).response(mockDbResponse);

      const res = await BookingStore.getBookingById(mockDbResponse.id);

      const selectHistory = tracker.history.select;

      const expectedResult = camelize(mockDbResponse);

      expect(selectHistory).toHaveLength(1);
      expect(selectHistory[0].method).toEqual('select');
      expect(selectHistory[0].bindings).toEqual([mockDbResponse.id, 1]);

      expect(res).toEqual(expectedResult);
    });
  });

  describe('listBookings', () => {
    test('it should list bookings', async () => {
      const mockDbResponse = [
        {
          id: 'abcd123',
          start_date: '2022-12-14 07:42:37',
          end_date: '2022-12-14 08:42:37',
          created_at: '2022-12-14 07:42:37',
          created_by: 98,
        },
        {
          id: 'echp289',
          start_date: '2022-12-14 07:42:37',
          end_date: '2022-12-14 08:42:37',
          created_at: '2022-12-14 07:42:37',
          created_by: 98,
        },
      ];

      tracker.on.select(TableNames.BOOKINGS).response(mockDbResponse);

      const res = await BookingStore.listBookings();

      const selectHistory = tracker.history.select;

      const expectedResult = camelize(mockDbResponse);

      expect(selectHistory).toHaveLength(1);
      expect(selectHistory[0].method).toEqual('select');

      expect(res).toEqual(expectedResult);
    });
  });

  describe('getBookingsForUserId', () => {
    test('it should list bookings for a user id', async () => {
      const mockDbResponse = [
        {
          id: 'abcd123',
          start_date: '2022-12-14 07:42:37',
          end_date: '2022-12-14 08:42:37',
          created_at: '2022-12-14 07:42:37',
          created_by: 98,
        },
        {
          id: 'echp289',
          start_date: '2022-12-14 07:42:37',
          end_date: '2022-12-14 08:42:37',
          created_at: '2022-12-14 07:42:37',
          created_by: 98,
        },
      ];

      tracker.on.select(TableNames.BOOKINGS).response(mockDbResponse);

      const res = await BookingStore.getBookingsForUserId(98);

      const selectHistory = tracker.history.select;

      const expectedResult = camelize(mockDbResponse);

      expect(selectHistory).toHaveLength(1);
      expect(selectHistory[0].method).toEqual('select');
      expect(selectHistory[0].bindings).toEqual([98]);

      expect(res).toEqual(expectedResult);
    });
  });

  describe('createBooking', () => {
    test('it should create a new booking', async () => {
      const mockInput = {
        id: 'abcd123',
        startDate: '2022-12-14 07:42:37',
        endDate: '2022-12-14 08:42:37',
        createdBy: 78,
      };

      const mockDbResponse = {
        id: 'abcd123',
        start_date: '2022-12-14 07:42:37',
        end_date: '2022-12-14 08:42:37',
        created_at: '2022-12-14 08:42:37',
        created_by: 78,
      };

      tracker.on.select(TableNames.BOOKINGS).response(mockDbResponse);
      tracker.on.insert(TableNames.BOOKINGS).response([mockDbResponse.id]);

      const res = await BookingStore.createBooking(mockInput);

      const expectedBindings = [
        mockInput.createdBy,
        mockInput.endDate,
        mockInput.id,
        mockInput.startDate,
      ];

      const expectedResult = camelize(mockDbResponse);

      const insertHistory = tracker.history.insert;

      expect(insertHistory).toHaveLength(1);
      expect(insertHistory[0].method).toEqual('insert');
      expect(insertHistory[0].bindings).toEqual(expectedBindings);

      expect(res).toEqual(expectedResult);
    });
  });
});
