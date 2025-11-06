import app from './src/app.js';

const port = process.env.port || 5000;

app.listen(port, () => {
  console.log(`listening to port: ${port}`);
});
