import app from './src/app.js';

const port = process.env.port || 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(`listening to port: ${port}`);
});
