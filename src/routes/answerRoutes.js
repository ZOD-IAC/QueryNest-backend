import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { answerQuestion } from '../controllers/answerController.js';

const route = express.Router();

route.get('/', (req, res) => {
  res.send('answer routes');
});

route.post('/api/write-answer', protect, answerQuestion);

route.post('/del-answer', (req, res) => {
  res.send('answer routes');
});

route.post('/edit-answer', (req, res) => {
  res.send('answer routes');
});

route.post('/get-answer', (req, res) => {
  res.send('answer routes');
});

export default route;
