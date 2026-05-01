// models/RefreshToken.js
import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: String,
  expiresAt: Date,
});

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
