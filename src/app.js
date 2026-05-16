import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { bootstrap } from './config/dummyData.js';
import userRoute from './routes/userRoutes.js';
import answerRoute from './routes/answerRoutes.js';
import questionRoute from './routes/questionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();
bootstrap();
const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://solvly.website', // production frontend
      'https://www.solvly.website', // with www
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('hello');
});

app.use('/user', userRoute);
app.use('/answer', answerRoute);
app.use('/question', questionRoute);
app.use('/admin', adminRoutes);

export default app;
