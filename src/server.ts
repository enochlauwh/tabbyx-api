import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schemasMap';

import './setup';

dotenv.config();

const app = express();

const startServer = async () => {
  app.get('/', (req, res) => {
    res.send('TabbyX is running');
  });

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      if (req.headers.authorization) {
        // In real life, this portion of code
        // would be proper authentication validation
        return { isAuthenticated: true };
      }

      return { isAuthenticated: false };
    },
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql' });

  const port = process.env.SERVER_PORT || 5700;
  app.listen(port, () => {
    console.log(`TabbyX is running on port ${port}`);
  });
};

startServer();

export default app;
