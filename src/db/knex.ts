import config from '../../knexfile';
import dotenv from 'dotenv';
import knex from 'knex';
dotenv.config();

export const knexConfig = config;

// @ts-ignore
export default knex(knexConfig);
