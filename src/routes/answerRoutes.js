import express from 'express';

const route = express.Router();

route.get('/', (req, res) => {
  res.send('answer routes');
});

route.post('/write-answer', (req, res) => {
  res.send('answer routes');
});

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
