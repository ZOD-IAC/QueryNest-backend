import User from "../models/user.js";
import { Question, Vote } from "../models/question.js";
import Tags from "../models/tags.js";
import { VoteOption } from "../utils/Constants.js";

export const createQuestion = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const { _id: userId } = req.user;

    await Question.create({
      title,
      body: content,
      tags,
      user: userId,
    });

    await Tags.bulkWrite(
      tags.map((tag) => ({
        updateOne: {
          filter: { _id: tag },
          update: { $inc: { usageCount: 1 } },
        },
      })),
    );

    await User.findByIdAndUpdate(userId, { $inc: { "stats.question": 1 } });

    res.status(200).json({
      message: "Question added successfully",
      ok: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
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
        message: "Question not found or unauthorized action",
        ok: false,
      });
    }

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $inc: { "stats.question": -1 },
      },
    );

    res.status(201).json({
      message: "Question deleted successfully",
      ok: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong while deleting the question",
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
        message: "Question not found",
        ok: false,
      });
    }

    res.status(201).json({
      message: "Question fetched successfully",
      question,
      ok: true,
    });
  } catch (error) {
    console.warns("error :", error);
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
      .populate({ path: "answers" })
      .populate("user", "name avatar reputation");

    if (!question) {
      return res.status(400).json({
        message: "Question not found !",
        ok: false,
      });
    }

    const tags = await Tags.find({ _id: { $in: question.tags } });
    if (!tags) tags = [];

    res.status(200).json({
      data: { question, tags },
      ok: true,
      message: "question fetched successfully",
    });
  } catch (error) {
    console.warn(error, ": error");
    return res.status(400).json({
      message: "Question not found !",
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
      tagName: { $regex: tagname, $options: "i" },
    });
    res.status(200).json({
      data: tags,
      ok: true,
      message: "Tags fetched successfully",
    });
  } catch (error) {
    console.log(error, "Something went wrong!");
    return res.status(400).json({
      message: "Question not found !",
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
      slug: tagName.replace(" ", "-"),
    });

    res.status(200).json({
      newtag,
      ok: true,
      message: "Tags fetched successfully",
    });
  } catch (error) {
    console.log(error, "Something went wrong!");
    return res.status(400).json({
      message: "Question not found !",
      ok: false,
    });
  }
};

export const questionVote = async (req, res) => {
  try {
    const { voteType } = req.query;
    const { questionID } = req.params;

    if (!voteType || !VoteOption[voteType]) {
      res.status(400).json({
        ok: false,
        message: "Valid voteType is required. 1 = upvote, 2 = downvote",
      });
    }

    const question = await Question.findById(questionID);
    if (!question) {
      return res.status(404).json({
        ok: false,
        message: "Question Not Found!",
      });
    }

    if (question.user.toString() === req.user._id.toString()) {
      return res.status(403).json({
        ok: false,
        message: "Cannot Vote your Own Question.",
      });
    }

    const existingVoted = await Vote.findOne({
      targetId: questionID,
      userId: req.user._id,
    });

    if (existingVoted) {
      if (existingVoted["voteType"] === VoteOption[voteType]) {
        await Vote.deleteOne({ _id: existingVoted._id });
        question[VoteOption[voteType]] -= 1;
      } else {
        await Vote.findOneAndUpdate(
          { _id: existingVoted._id },
          { voteType: VoteOption[voteType] },
        );
        question[existingVoted.voteType] -= 1;
        question[VoteOption[voteType]] += 1;
      }
    } else {
      await Vote.create({
        userId: req.user._id,
        targetId: question._id,
        targetType: "Question",
        voteType: VoteOption[voteType],
      });

      question[VoteOption[voteType]] += 1;
    }

    await question.save();

    return res.status(200).json({
      ok: true,
      message: `you ${VoteOption[voteType]} this Question`,
      data: {
        upvote: question.upvote,
        downvote: question.downvote,
        voted: question.upvote + question.downvote,
      },
    });
  } catch (error) {
    console.warn(error, ": error");
    return res.status(400).json({
      message: "Server error !",
      ok: false,
    });
  }
};
