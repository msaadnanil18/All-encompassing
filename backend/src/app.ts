import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import authRouter from './routes/authRouts';
import dbMiddleware from './middlewares/dbMiddleware';
import dotenv from 'dotenv';
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
app.use(dbMiddleware);

app.use('/api', authRouter);

export { app };
