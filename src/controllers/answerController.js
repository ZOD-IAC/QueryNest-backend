import User from '../models/user.js';
import Question from '../models/question.js';
import Answer from '../models/answer.js';

export const answerQuestion = async (req, res) => {
  try {
    const { content, code, questionId } = req.body;

    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      {
        $inc: { answersCount: 1 },
      }
    );

    if (!question) {
      return res.status(400).json({
        ok: false,
        message: 'Question not found !',
      });
    }

    const answer = await Answer.create({
      questionId: questionId,
      body: content,
      code: code,
      user: req.user.id,
    });

    return res.status(200).json({
      message: 'Answer generated successfully ',
      ok: true,
    });
  } catch (error) {
    console.warn('error :', error);
    return res.status(400).json({
      ok: false,
      message: 'Server respose failed',
    });
  }
};
