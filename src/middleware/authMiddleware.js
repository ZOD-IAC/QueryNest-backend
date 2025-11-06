import jwt from 'jsonwebtoken';
import User from '../models/user';

export const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startswith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token, process.env.JWT_KEY);
      req.user = User.findById(decode.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        message: 'server error : not authorized',
        code: 400,
      });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      messages: 'admin access only ',
    });
  }
};
