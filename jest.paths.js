module.exports = {
  '@db/(.*)': '<rootDir>/src/db/$1',
  '@graphql/(.*)': '<rootDir>/src/graphql/$1',
  '@data-access': '<rootDir>/src/data-access/index',
  '@models/(.*)': '<rootDir>/src/models/$1',
  '@services': '<rootDir>/src/services/index',
};
