import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { genToken, genRefreshToken } from "../utils/generateToken.js";
import User from "../models/user.js";
import multiavatar from "@multiavatar/multiavatar/esm";
import { RefreshToken } from "../models/RefreshToken.js";
import { getQuestionRelatedToUser } from "../services/question.services.js";

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email }).select("-password");

    if (existUser) {
      res.status(400).json({ message: "User already exist", ok: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const avatar = multiavatar(name, true, { part: "10", theme: "B" });

    const newUser = await User.create({
      name,
      email: email,
      password: hashPass,
      reputation: 0,
      avatar: avatar,
      role: "user",
    });

    const token = genToken(newUser._id);

    res.status(201).json({
      message: "User created successfully",
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
    console.log(error, "error occured");
    res.status(500).json({
      code: 500,
      message: "something went wrong",
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
        message: "User does not exist",
        code: 400,
        ok: false,
      });
    }

    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(400).json({
        message: "Email or password is incorrect",
        code: 400,
        ok: false,
      });
    }

    const token = genToken(user._id);
    const refreshToken = genRefreshToken();

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      // secure: true,
      // sameSite: 'Strict',
      secure: false, // localhost
      sameSite: "lax", // localhost
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: true,
      // sameSite: 'Strict',
      secure: false, // localhost
      sameSite: "lax", // localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        reputation: user.reputation,
        role: user.role,
        avatar: user.avatar,
      },
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error",
      code: 500,
      ok: false,
    });
  }
};

const logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  try {
    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out", ok: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", ok: false });
  }
};

const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ ok: false });

  const stored = await RefreshToken.findOne({ token });

  if (!stored || stored.expiresAt < new Date()) {
    return res.status(403).json({ ok: false });
  }

  const accessToken = generateAccessToken(stored.userId);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000,
  });

  res.json({ ok: true });
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        ok: false,
      });
    }

    const question = await getQuestionRelatedToUser(userId);

    return res.status(200).json({
      message: "User fetched successfully",
      data: { user, question },
      ok: true,
    });
  } catch (error) {
    console.warn(error, ": server error");
    return res.status(500).json({
      message: "something went wrong",
      data: {},
      ok: false,
    });
  }
};

export { createUser, loginUser, getUser, logout, refreshAccessToken };
