import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import genToken from '../utils/generateToken.js';
import User from '../models/user.js';

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email }).select('-password');

    if (existUser) {
      res.status(400).json({ message: 'User already exist', ok: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email,
      password: hashPass,
      reputation: 0,
      role: 'user',
    });

    const token = genToken(newUser._id);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        reputation: newUser.reputation,
      },
      token: token,
      ok: true,
    });
  } catch (error) {
    console.log(error, 'error occured');
    res.status(500).json({
      code: 500,
      message: 'something went wrong',
      ok: false,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist',
        code: 400,
      });
    }

    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(400).json({
        message: 'Email or password is incorrect',
        code: 400,
      });
    }

    const token = genToken(user._id);

    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        name: user.name,
        email: user.email,
        reputation: user.reputation,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'server error',
      code: 500,
    });
  }
};

export { createUser, loginUser };
