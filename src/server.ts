import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const startServer = async () => {
  app.get('/', (req, res) => {
    res.send('TabbyX is running');
  });

  const port = process.env.SERVER_PORT || 5700;
  app.listen(port, () => {
    console.log(`TabbyX is running on port ${port}`);
  });
};

startServer();

export default app;
