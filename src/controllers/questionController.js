import User from '../models/user.js';
import Question from '../models/question.js';
import Tags from '../models/tags.js';

export const createQuestion = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const { _id: userId } = req.user;
    const question = await Question.create({
      title,
      body: content,
      tags,
      user: userId,
    });

    await Tags.bulkWrite(
      tags.map((tag) => ({
        updateOne: {
          filter: {
            tagName: tag;
          },
          update : { $inc : {usageCount : 1}}
        }
      })),
    );

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $inc: { 'stats.question': 1 },
      },
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
      },
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
      },
      { new: true },
    )
      .populate({ path: 'answers' })
      .populate('user', 'name avatar reputation');

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

export const getQuestionPageData = () => {
  try {
    const question = Question.find();
  } catch (error) {}
};

export const getQuestionTags = async (req, res) => {
  try {
    const { tagname } = req.params;

    const tags = await Tags.find({
      tagName: { $regex: tagname, $options: 'i' },
    });
    console.log(tags, '<----- tagssssssssssss');
    res.status(200).json({
      data: tags,
      ok: true,
      message: 'Tags fetched successfully',
    });
  } catch (error) {
    console.log(error, 'Something went wrong!');
    return res.status(400).json({
      message: 'Question not found !',
      ok: false,
    });
  }
};

export const addTag = async (req, res) => {
  try {
    const { tag } = req.body;
    const tagName = tag.toLowerCase();
    let existingTag = await Tags.findOne({ tagName });

    if (existingTag) {
      return res.json({
        newtag: existingTag,
        ok: true,
      });
    }

    const newtag = await Tags.create({
      tagName: tagName,
      slug: tagName.replace(' ', '-'),
    });

    res.status(200).json({
      newtag,
      ok: true,
      message: 'Tags fetched successfully',
    });
  } catch (error) {
    console.log(error, 'Something went wrong!');
    return res.status(400).json({
      message: 'Question not found !',
      ok: false,
    });
  }
};
