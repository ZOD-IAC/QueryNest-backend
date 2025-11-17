import User from '../models/user.js';
import Question from '../models/question.js';

export const createQuestion = async (req, res) => {
  try {
    const { title, content, code, tags } = req.body;
    const { _id: userId } = req.user;
    const question = await Question.create({
      title,
      body: content,
      code,
      tags,
      user: userId,
    });

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $inc: { 'stats.question': 1 },
      }
    );

    res.status(200).json({
      message: 'Question added successfully',
      ok: true,
    });
  } catch (error) {
    // console.warn(error, '<-- error');
    res.status(500).json({
      message: 'Something went wrong while creating the question',
      ok: false,
    });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.body;
    const { _id: userId } = req.user;

    const question = await Question.findOneAndDelete({
      _id: questionId,
      user: userId,
    });

    if (!question) {
      res.status(404).json({
        message: 'Question not found or unauthorized action',
        ok: false,
      });
    }

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { 'stats.question': -1 },
      }
    );

    res.status(201).json({
      message: 'Question deleted successfully',
      ok: true,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong while deleting the question',
      ok: false,
    });
  }
};

export const userQuestion = async (req, res) => {
  try {
    const userId = req.params.userId;
    const question = await Question.find({
      user: userId,
    });

    if (!question) {
      res.status(404).json({
        message: 'Question not found',
        ok: false,
      });
    }

    res.status(201).json({
      message: 'Question fetched successfully',
      question,
      ok: true,
    });
  } catch (error) {
    console.warns('error :', error);
    res.status(400).json({
      message: "Something went wrong while fetching user's question",
      ok: false,
    });
  }
};

export const fetchQuestoinDetail = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      {
        $inc: { views: 1 },
      }
    ).populate('answers');

    if (!question) {
      return res.status(400).json({
        message: 'Question not found !',
        ok: false,
      });
    }

    res.status(200).json({
      question,
      ok: true,
      message: 'question fetched successfully',
    });
  } catch (error) {
    console.warn(error, ': error');
    return res.status(400).json({
      message: 'Question not found !',
      ok: false,
    });
  }
};
