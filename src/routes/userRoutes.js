import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
import {
  createUser,
  getUser,
  loginUser,
  logout,
  refreshAccessToken,
} from "../controllers/userController.js";

const route = express.Router();

route.get("/", (req, res) => {
  res.send("user routes");
});

route.post("/api/register", createUser);

route.post("/api/login", loginUser);

route.post("/api/logout", logout);

route.get("/me", protect, (req, res) => {
  res.json({
    user: req.user,
    ok: true,
  });
});

route.post("/api/refreshtoken", refreshAccessToken);

route.get("/api/get-user/:userId", getUser);

route.post("/api/edit-user", (req, res) => {
  res.send("logiin page");
});

route.post("/api/add-avatar", (req, res) => {
  res.send("logiin page");
});

route.post("/api/remove-avatar", (req, res) => {
  res.send("logiin page");
});

export default route;
