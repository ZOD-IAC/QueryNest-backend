import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoute from './routes/userRoutes.js';
import answerRoute from './routes/answerRoutes.js';
import questionRoute from './routes/questionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import createAdmin from './config/createAdmin.js';

dotenv.config();
connectDB();
createAdmin();
const app = express();

app.use(cors());
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
