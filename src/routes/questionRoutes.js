import express from 'express';

const route = express.Router();

route.get('/', (req, res) => {
  res.send('question routes');
});

route.post('/add-question', (req, res) => {
  res.send('register page');
});

route.post('/del-question', (req, res) => {
  res.send('logiin page');
});

route.post('/edit-question', (req, res) => {
  res.send('logiin page');
});

route.post('/get-question', (req, res) => {
  res.send('logiin page');
});

export default route;
