import mockKnex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { camelizeKeys as camelize } from 'humps';
import { TableNames } from '@db/tables';

import UserStore from './user.store';

jest.mock('@db/knex', () => {
  return mockKnex({ client: MockClient });
});

describe('user.store', () => {
  let tracker: Tracker;

  beforeAll(() => {
    tracker = getTracker();
  });

  afterEach(() => {
    tracker.reset();
  });

  describe('getUserByEmail', () => {
    test('it should get a user by email', async () => {
      const mockDbResponse = {
        id: 23,
        name: 'Ginger Root',
        email: 'loretta@ginger.root',
      };
      tracker.on.select(TableNames.USERS).response([mockDbResponse]);

      const res = await UserStore.getUserByEmail(mockDbResponse.email);

      const selectHistory = tracker.history.select;

      const expectedResult = camelize(mockDbResponse);

      expect(selectHistory).toHaveLength(1);
      expect(selectHistory[0].method).toEqual('select');
      expect(selectHistory[0].bindings).toEqual([mockDbResponse.email]);

      expect(res).toEqual(expectedResult);
    });
  });

  describe('createUser', () => {
    test('it should create a new user', async () => {
      const mockInput = {
        name: 'Ginger Root',
        email: 'loretta@ginger.root',
      };

      const mockDbResponse = {
        id: 'exbc238',
        name: 'Ginger Root',
        email: 'loretta@ginger.root',
      };

      tracker.on.select(TableNames.USERS).response(mockDbResponse);
      tracker.on.insert(TableNames.USERS).response([mockDbResponse.id]);

      const res = await UserStore.createUser(mockInput);

      const expectedBindings = [mockInput.email, mockInput.name];

      const expectedResult = camelize(mockDbResponse);

      const insertHistory = tracker.history.insert;

      expect(insertHistory).toHaveLength(1);
      expect(insertHistory[0].method).toEqual('insert');
      expect(insertHistory[0].bindings).toEqual(expectedBindings);

      expect(res).toEqual(expectedResult);
    });
  });
});
