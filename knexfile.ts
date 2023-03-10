import dotenv from 'dotenv';
dotenv.config();

const environments = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true,
  },
  pool: {
    min: 0,
    max: 10,
  },
  migrations: {
    directory: './src/db/migrations',
    tableName: 'tabby_migrations',
  },
};

export default environments;
