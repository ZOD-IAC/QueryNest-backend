import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createQuestion,
  deleteQuestion,
  fetchQuestoinDetail,
  questionVote,
  userQuestion,
  getQuestionList,
  createTag,
  getTagList,
  getStatsData,
} from '../controllers/questionController.js';

const route = express.Router();

route.get('/', (req, res) => {
  res.send('question routes');
});

route.post('/create-question', protect, createQuestion);

route.post('/del-question', protect, deleteQuestion);

route.get('/user-questions/:userId', protect, userQuestion);

route.post('/api/edit-question', (req, res) => {
  res.send('logiin page');
});

route.get('/api/get-question/:questionId', fetchQuestoinDetail);
route.patch('/api/:questionID/vote', protect, questionVote);

route.get('/api/get-questionList', getQuestionList);

route.post('/api/add-tags/', createTag);
route.get('/api/getTags/', getTagList);
route.get('/api/getStats/', getStatsData);

export default route;
