import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import genToken from '../utils/generateToken.js';
import User from '../models/user.js';
import multiavatar from '@multiavatar/multiavatar/esm';

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email }).select('-password');

    if (existUser) {
      res.status(400).json({ message: 'User already exist', ok: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const avatar = multiavatar(name, true, { part: '10', theme: 'B' });

    const newUser = await User.create({
      name,
      email: email,
      password: hashPass,
      reputation: 0,
      avatar: avatar,
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
        avatar: avatar,
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
        ok: false,
      });
    }

    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(400).json({
        message: 'Email or password is incorrect',
        code: 400,
        ok: false,
      });
    }

    const token = genToken(user._id);

    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        reputation: user.reputation,
        role: user.role,
        avatar: user.avatar,
      },
      token,
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'server error',
      code: 500,
      ok: false,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select('-password')
      .populate('questions')
      // .populate('answers');

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
        ok: false,
      });
    }

    return res.status(200).json({
      message: 'User fetched successfully',
      user,
      ok: true,
    });
  } catch (error) {
    // console.warn(error, ': server error');
    return res.status(500).json({
      message: 'something went wrong',
      ok: false,
    });
  }
};

export { createUser, loginUser, getUser };
