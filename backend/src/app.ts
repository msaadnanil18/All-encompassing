import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import router from './routes/routes';
import dbMiddleware from './middlewares/dbMiddleware';
dotenv.config({
  path: './.env',
});

const app = express();
app.use(
  cors({
    origin: process.env.CROS_ORIGIN,
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
app.use(dbMiddleware);

app.use('/api', router);

export { app };
