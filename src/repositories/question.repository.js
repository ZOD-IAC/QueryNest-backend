import { Question } from "../models/question.js";

const findByUser = async (userId, options) => {
  const { page = 1, limit = 10 } = options;
  return await Question.find({ user: userId })
    .populate("tags")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

const findByFilter = async (options) => {
  const { tags, title, sort, limit } = options;

  const filter = {};

  // title search
  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

  // tag filtering
  if (tags.length) {
    filter.tags = { $in: tags };
  }

  //sorting
  if (sort) {
    sort = "-1" ? -1 : 1;
  }

  return await Question.find(filter)
    .populate("tags")
    .limit(limit)
    .sort(sort)
    .lean();
};
export { findByUser, findByFilter };
