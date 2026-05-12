import mongoose, { Schema } from "mongoose";

const SavedSchema = new Schema(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

// Prevent duplicate saves
SavedSchema.index({ user: 1, question: 1 }, { unique: true });

export const Saved = mongoose.model("Saved", SavedSchema);
