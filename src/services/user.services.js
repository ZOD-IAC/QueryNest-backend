import {
  fetchUserByFilter,
  fetchSavedQuestion,
} from "../repositories/user.repository.js";

const getUserRelatedtoFilter = async (options) => {
  const user = await fetchUserByFilter(options);
  return user;
};

const getSavedQuestion = async (userId) => {
  const saved = await fetchSavedQuestion(userId);
  return saved;
};

export { getUserRelatedtoFilter, getSavedQuestion };
