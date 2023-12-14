import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDb from './db/index.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import auth from './middleware/auth.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

connectDb(); // database connection

app.get('/', auth, (req, res) => res.send(req.decoded));
app.use('/user', userRoutes);

const appInstance = app.listen(port, () =>
  console.log(
    '\x1b[34m%s\x1b[0m',
    'App is live on http://localhost:' + port + ' process_id:' + process.pid
  )
);

export default app;
export { appInstance };
