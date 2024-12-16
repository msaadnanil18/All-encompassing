import { server } from './app';
import connectDB from './db';
import dotenv from 'dotenv';
import ip from 'ip';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running: http://localhost:${process.env.PORT}`);
      console.log(` http://${ip.address()}:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('MONGO db connection error', error);
  });
