
# TabbyX API

TabbyX is a simple demo for an appointment booking system using React on Vite, GraphQL and Typescript.

Frontend GitHub repo: [https://github.com/JetpackKitty/tabbyx-web](https://github.com/JetpackKitty/tabbyx-web) (instructions and description for frontend are in the repo readme)

## Live Preview

The website can be previewed here: [https://tabbyx.mechacat.app](https://tabbyx.mechacat.app)

The GraphQL backend can be previewed here: 
[https://tabbyx-api.mechacat.app/graphql](https://tabbyx-api.mechacat.app/graphql)

You can also use [Apollo Studio Explorer](https://studio.apollographql.com/sandbox/explorer) to view and query the schema.

## Usage
### Setup
- Clone the repo
- `yarn` to install dependencies
- Create `.env` file using `.env-sample` as reference
- `docker-compose up -d` to build and start the database instance (Docker Compose is required)
- `yarn migrate:latest` to run the DB setup migrations

### Development
- `yarn dev` to run in development mode
- `yarn codegen` or `yarn codegen:watch` to update GraphQL Typescript types after modifying the schema
- `yarn test` or `yarn test:watch` to run tests

### Build
- `yarn start` to build and run
- `yarn build` to build only


### Notes
- MySQL was used as the database because of existing skill familiarity
- This project is not intended to be a fully robust product-ready application, only to incorporate enough to demonstrate the intent for some of the code design.
- The code is covered by tests at the various levels to demonstrate some of the testing approaches but is not intended to have full coverage.
