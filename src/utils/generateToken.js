import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const genToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_KEY, {
    expiresIn: "15m",
  });
};

export const genRefreshToken = () => {
  return uuidv4();
};
