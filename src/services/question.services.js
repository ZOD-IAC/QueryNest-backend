import {
  findByFilter,
  findByUser,
  findTagsbyFilter,
} from '../repositories/question.repository.js';

const getQuestionRelatedToUser = async (
  userId,
  options = { page: 1, limit: 10 },
) => {
  return await findByUser(userId, options);
};

const getQuestionRelatedToFilter = async (options) => {
  const tagArr = options?.tags?.split(',') || [];
  options = {
    ...options,
    tags: tagArr,
  };
  return await findByFilter(options);
};

const getTagsRelatedToFilter = async (options) => {
  return await findTagsbyFilter(options);
};
export {
  getQuestionRelatedToUser,
  getQuestionRelatedToFilter,
  getTagsRelatedToFilter,
};
