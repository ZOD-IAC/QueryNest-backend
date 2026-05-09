import User from "../models/user.js";
import { Question } from "../models/question.js";
import Answer from "../models/answer.js";

export const answerQuestion = async (req, res) => {
  try {
    const { content, code, questionId } = req.body;

    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      {
        $inc: { answersCount: 1 },
      },
    );

    if (!question) {
      return res.status(400).json({
        ok: false,
        message: "Question not found !",
      });
    }

    const answer = await Answer.create({
      questionId: questionId,
      body: content,
      code: code,
      user: req.user.id,
    });

    return res.status(200).json({
      message: "Answer generated successfully ",
      ok: true,
    });
  } catch (error) {
    console.warn("error :", error);
    return res.status(400).json({
      ok: false,
      message: "Server respose failed",
    });
  }
};

export const getAnswers = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return;
    const answers = await Answer.find({ user: userId }).populate({
      path: "question",
    });

    console.log(answers ,'<=== answer')

    if (!Answer) {
      return res.status(200).json({
        ok: true,
        message: "No Answers found for this user",
      });
    }

    return res.status(200).json({
      ok: true,
      data: answers,
      message: "answer fetched successfully",
    });
  } catch (error) {
    console.warn("error :", error);
    return res.status(400).json({
      ok: false,
      message: "Server respose failed",
    });
  }
};

export const upDownVoting = async (req, res) => {
  try {
    const { answerId, type } = req.query;
    const answer = await Answer.findOne({ _id: answerId });
    if (type === "up") {
      answer.upvotes++;
    } else {
      answer.downvotes--;
    }

    return res.status(200).json({
      message: "vote successfull",
      ok: true,
    });
  } catch (error) {
    console.warn("error :", error);
    return res.status(400).json({
      ok: false,
      message: "Server respose failed",
    });
  }
};
