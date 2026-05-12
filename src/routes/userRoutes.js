import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";
import {
  changeAvater,
  createUser,
  editUser,
  getUser,
  getUserList,
  getUserSaveList,
  loginUser,
  logout,
  refreshAccessToken,
  removeAvater,
} from "../controllers/userController.js";

const route = express.Router();

// PUBLIC ROUTES -------------------------------------------------------------------------------------------------

//POST

route.post("/api/register", createUser); // CREATE NEW USER
route.post("/api/login", loginUser); // LOGIN USER
route.post("/api/logout", logout); // LOGOUT USER
route.post("/api/refreshtoken", refreshAccessToken); // REFRESH NEW USER TOKEN

//GET
route.get("/api/getusers/", getUserList); // GET USER LIST
route.get("/api/getusersaved/:userId", getUserSaveList); //GET QUESTIONs SAVED BY USER
route.get("/api/get-user/:userId", getUser);  // GET USER DEATILs
route.get("/me", (req, res) => {
  res.json({
    user: req.user,
    ok: true,
  });
});

// PRIVATE ROUTES -------------------------------------------------------------------------------------------------
route.use(protect);

route.patch("/api/edit-user", editUser); // EDIT USER DETAILS
route.patch("/api/add-avatar", changeAvater); // CHANGE USER AVATAR
route.delete("/api/remove-avatar", removeAvater); // REMOVE AVATAR
route.get("/question/:userId/save", getUserSaveList); // Saved Question

export default route;
