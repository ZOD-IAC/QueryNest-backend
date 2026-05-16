import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  answerQuestion,
  deleteAnswer,
  editAnswer,
  getAnswers,
  upDownVoting,
} from "../controllers/answerController.js";

const route = express.Router();

// PUBLIC ROUTES
route.get("/api/get-answers", getAnswers); // GET ANSWERS

// PRIVATE ROUTES
route.use(protect);

route.post("/api/write-answer", answerQuestion);
route.post("/api/answers-vote", upDownVoting);
route.post("/del-answer", deleteAnswer);
route.post("/edit-answer", editAnswer);

export default route;
