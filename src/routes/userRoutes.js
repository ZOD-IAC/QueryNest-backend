import express from 'express';
import mongoose from 'mongoose';
import { createUser, getUser, loginUser } from '../controllers/userController.js';

const route = express.Router();

route.get('/', (req, res) => {
  res.send('user routes');
});

route.post('/api/register', createUser);

route.post('/api/login', loginUser);

route.get('/api/get-user/:userId', getUser);

route.post('/api/edit-user', (req, res) => {
  res.send('logiin page');
});

route.post('/api/add-avatar', (req, res) => {
  res.send('logiin page');
});

route.post('/api/remove-avatar', (req, res) => {
  res.send('logiin page');
});

export default route;
