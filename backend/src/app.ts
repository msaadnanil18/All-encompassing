import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import router from './routes/routes';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import dbMiddleware from './middlewares/dbMiddleware';
import { initialize_socket_setup } from './sokets/socket';
dotenv.config({
  path: './.env',
});

const app = express();
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: [
      process.env.CROS_ORIGIN as any,
      'https://1a8b-27-100-13-114.ngrok-free.app',
    ],
    credentials: true,
  },
});
app.set('io', io);
app.use(
  cors({
    origin: [
      process.env.CROS_ORIGIN as any,
      'https://1a8b-27-100-13-114.ngrok-free.app',
    ],
    credentials: true,
  })
);

app.use(
  express.json({
    limit: '150kb',
  })
);
app.use(
  urlencoded({
    limit: '50mb',
    extended: true,
  })
);

app.use(express.static('public'));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
initialize_socket_setup(io);
app.use(dbMiddleware);

app.use('/api', router);

export { server };
