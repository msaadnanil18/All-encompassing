import { app } from './app';
import connectDB from './db';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running: http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('MONGO db connection error', error);
  });
