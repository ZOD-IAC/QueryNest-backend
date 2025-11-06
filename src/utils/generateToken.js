import jwt from 'jsonwebtoken';

const genToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_KEY);
};


export default genToken;