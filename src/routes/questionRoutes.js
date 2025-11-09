import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createQuestion,
  deleteQuestion,
  userQuestion,
} from '../controllers/questionController.js';

const route = express.Router();

route.get('/', (req, res) => {
  res.send('question routes');
});

route.post('/add-question', protect, createQuestion);

route.post('/del-question', protect, deleteQuestion);

route.get('/user-questions/:userId', protect, userQuestion);

route.post('/edit-question', (req, res) => {
  res.send('logiin page');
});

route.post('/get-question', (req, res) => {
  res.send('logiin page');
});

route.get('/get-question/:questionId', (req, res) => {
  res.send('logiin page');
});

export default route;
