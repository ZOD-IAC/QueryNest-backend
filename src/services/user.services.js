import { fetchUserByFilter } from "../repositories/user.repository.js";

const getUserRelatedtoFilter = async (options) => {
  const user = await fetchUserByFilter(options);
  return user;
};

export { getUserRelatedtoFilter };
