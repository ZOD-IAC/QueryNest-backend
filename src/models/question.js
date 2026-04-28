import mongoose from "mongoose";
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Question body is required"],
      trim: true,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tags" }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    upvotes: { type: Number, default: 0, min: 0 },
    downvotes: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 },
    answersCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const VoteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: Schema.Types.ObjectId, required: true }, // questionId or answerId
    targetType: { type: String, enum: ["Question", "Answer"] }, // reusable for answers too
    voteType: { type: String, enum: ["upvote", "downvote"] },
  },
  { timestamps: true },
);

questionSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "questionId",
});

questionSchema.set("toObject", { virtuals: true });
questionSchema.set("toJSON", { virtuals: true });

export const Question = mongoose.model("Question", questionSchema);
export const Vote = mongoose.model("Vote", VoteSchema);
