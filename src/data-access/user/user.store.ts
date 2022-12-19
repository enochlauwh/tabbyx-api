import knex from '@db/knex';
import _ from 'lodash';
import { camelizeKeys as camelize } from 'humps';
import { TableNames } from '@db/tables';
import { UserId } from '@models/user.model';

// Caching is not implemented in this example but if it were to be used
// to improve performance, then it would implemented in this layer.

const getUserByEmail = async (email: string) => {
  try {
    const res = await knex
      .from(TableNames.USERS)
      .where('email', email)
      .select();

    return camelize(_.head(res));
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUserById = async (id: UserId) => {
  try {
    const res = await knex
      .from(TableNames.USERS)
      .where('id', id)
      .select()
      .first();

    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const createUser = async (input: { name: string; email: string }) => {
  try {
    const { name, email } = input;

    const insertRes = await knex(TableNames.USERS).insert({
      name,
      email,
    });

    const res = await knex
      .from(TableNames.USERS)
      .where('id', _.head(insertRes))
      .select()
      .first();

    return camelize(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default {
  getUserByEmail,
  getUserById,
  createUser,
};
