import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDb from './db/index.js';
import userRouter from './routes/userRoutes.js/index.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());

connectDb();

app.use('/user', userRouter);

app.listen(port, () => console.log('app is live on http://localhost:' + port, 'process id:' + process.pid));
